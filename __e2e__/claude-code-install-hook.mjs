import * as assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE } from './utils.mjs'

test('Claude Code Install Hook E2E', async (t) => {
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
    'install-hook: creates settings.json hook, shim file, and upgrades old hooks',
    async () => {
      const homeDir = npm.homeDir

      // Pre-create ~/.claude/settings.json with an old-style npx hook
      // to also verify the upgrade path in a single test run.
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
                      'npx --yes mobbdev@latest claude-code-process-hook',
                  },
                ],
              },
            ],
          },
        })
      )

      const hook = await npm.npx(
        ['mobbdev', 'claude-code-install-hook', '--save-env'],
        CLI_LOCAL_ENV_OVERWRITE
      )

      // Complete the interactive login flow.
      await hook.waitForString(/Login to Mobb is Required/, 200000)
      hook.sendEnterKey()
      await hook.waitForString(
        /If the page does not open automatically/,
        200000
      )
      const loginId = hook
        .getOutput()
        .match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        )[0]
      await mobbApi.cliLogin(loginId)

      await hook.waitForString(/installed successfully/, 200000)
      await hook.waitForExit()

      // Assert — command exited cleanly
      assert.strictEqual(hook.getExitCode(), 0)

      // Verify settings.json was updated correctly
      const settings = JSON.parse(
        fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8')
      )
      assert.ok(settings.hooks, 'settings should have hooks')
      assert.ok(
        settings.hooks.PostToolUse,
        'settings should have PostToolUse hooks'
      )
      // Old npx hook should be upgraded (not duplicated)
      assert.strictEqual(
        settings.hooks.PostToolUse.length,
        1,
        'Should have exactly 1 hook (upgraded, not duplicated)'
      )

      const hookEntry = settings.hooks.PostToolUse[0]
      assert.strictEqual(hookEntry.matcher, '*', 'Matcher should be *')
      assert.strictEqual(hookEntry.hooks.length, 1)
      assert.strictEqual(hookEntry.hooks[0].type, 'command')
      assert.ok(
        hookEntry.hooks[0].command.includes('daemon-check.js'),
        'Hook command should reference daemon-check.js'
      )
      assert.strictEqual(hookEntry.hooks[0].async, true, 'Hook should be async')
      // --save-env should bake env vars into the command
      assert.ok(
        hookEntry.hooks[0].command.includes('API_URL='),
        'Command should contain API_URL env var'
      )
      assert.ok(
        hookEntry.hooks[0].command.includes('WEB_APP_URL='),
        'Command should contain WEB_APP_URL env var'
      )

      // Verify daemon-check.js shim was written to disk
      const shimPath = path.join(homeDir, '.mobbdev', 'daemon-check.js')
      assert.ok(fs.existsSync(shimPath), 'daemon-check.js should exist')
      const shimContent = fs.readFileSync(shimPath, 'utf8')
      assert.ok(
        shimContent.includes('daemon.pid'),
        'Shim should reference daemon.pid'
      )
      assert.ok(
        shimContent.includes('HEARTBEAT_STALE_MS'),
        'Shim should contain HEARTBEAT_STALE_MS'
      )
      assert.ok(
        shimContent.includes('claude-code-daemon'),
        'Shim should spawn claude-code-daemon'
      )
    }
  )
})
