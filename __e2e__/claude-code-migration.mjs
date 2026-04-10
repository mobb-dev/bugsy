import * as assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE } from './utils.mjs'

test('Claude Code Hook Migration E2E', async (t) => {
  await t.before(async () => {
    await mobbApi.init()
    await registry.start()
    await npm.init()
  })

  await t.after(async () => {
    await registry.stop()
    await npm.destroy()
  })

  await t.test(
    'process-hook: auto-upgrades old npx hook to daemon-check shim',
    async () => {
      const homeDir = npm.homeDir

      // Seed settings.json with old-style npx hook (Write|Edit matcher, env vars, no async)
      const claudeDir = path.join(homeDir, '.claude')
      fs.mkdirSync(claudeDir, { recursive: true })
      fs.writeFileSync(
        path.join(claudeDir, 'settings.json'),
        JSON.stringify({
          hooks: {
            PostToolUse: [
              {
                matcher: 'Write|Edit',
                hooks: [
                  {
                    type: 'command',
                    command:
                      'API_URL="http://localhost:8080" WEB_APP_URL="http://localhost:5173" npx --yes mobbdev@latest claude-code-process-hook',
                  },
                ],
              },
            ],
          },
        })
      )

      // Verify no daemon-check.js exists yet
      const shimPath = path.join(homeDir, '.mobbdev', 'daemon-check.js')
      assert.ok(
        !fs.existsSync(shimPath),
        'Shim should not exist before migration'
      )

      // Run the old command — this triggers auto-upgrade
      const proc = await npm.npx(
        ['mobbdev', 'claude-code-process-hook'],
        CLI_LOCAL_ENV_OVERWRITE
      )
      await proc.waitForExit()
      assert.strictEqual(proc.getExitCode(), 0)

      // Verify settings.json was auto-upgraded
      const settings = JSON.parse(
        fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8')
      )
      assert.strictEqual(
        settings.hooks.PostToolUse.length,
        1,
        'Should still have exactly 1 hook'
      )

      const hookEntry = settings.hooks.PostToolUse[0]
      assert.strictEqual(
        hookEntry.matcher,
        '*',
        'Matcher should be upgraded from Write|Edit to *'
      )
      assert.ok(
        hookEntry.hooks[0].command.includes('daemon-check.js'),
        'Command should be upgraded to daemon-check.js'
      )
      assert.ok(
        !hookEntry.hooks[0].command.includes('npx'),
        'Old npx command should be removed'
      )
      assert.strictEqual(
        hookEntry.hooks[0].async,
        true,
        'Hook should be upgraded to async'
      )

      // Verify env vars are preserved in the upgraded command
      const command = hookEntry.hooks[0].command
      assert.ok(
        command.includes('API_URL="http://localhost:8080"'),
        'API_URL env var should be preserved'
      )
      assert.ok(
        command.includes('WEB_APP_URL="http://localhost:5173"'),
        'WEB_APP_URL env var should be preserved'
      )

      // Verify daemon-check.js shim was created
      assert.ok(
        fs.existsSync(shimPath),
        'Shim should be created during migration'
      )
      const shimContent = fs.readFileSync(shimPath, 'utf8')
      assert.ok(
        shimContent.includes('claude-code-daemon'),
        'Shim should spawn claude-code-daemon'
      )
    }
  )

  await t.test(
    'process-hook: overwrites tampered daemon-check.js on every invocation',
    async () => {
      const homeDir = npm.homeDir
      const shimPath = path.join(homeDir, '.mobbdev', 'daemon-check.js')

      // Precondition: shim exists from the previous test
      assert.ok(fs.existsSync(shimPath), 'Shim should exist from prior test')
      const originalContent = fs.readFileSync(shimPath, 'utf8')

      // Tamper with the shim (simulates user edit or stale version)
      fs.writeFileSync(shimPath, '// tampered content')

      // Run process-hook — should overwrite the tampered shim
      const proc = await npm.npx(
        ['mobbdev', 'claude-code-process-hook'],
        CLI_LOCAL_ENV_OVERWRITE
      )
      await proc.waitForExit()
      assert.strictEqual(proc.getExitCode(), 0)

      const restoredContent = fs.readFileSync(shimPath, 'utf8')
      assert.strictEqual(
        restoredContent,
        originalContent,
        'Shim should be restored to the canonical version'
      )
      assert.ok(
        !restoredContent.includes('tampered'),
        'Tampered content should be gone'
      )
    }
  )
})
