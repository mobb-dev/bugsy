import * as assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { setTimeout } from 'node:timers/promises'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE } from './utils.mjs'

test('Claude Code Daemon E2E', async (t) => {
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
    'claude-code-daemon: process stays alive and writes PID file',
    async () => {
      const daemon = await npm.npx(
        ['mobbdev', 'claude-code-daemon'],
        CLI_LOCAL_ENV_OVERWRITE
      )

      // The daemon uses isSkipPrompts so it skips the keypress but still
      // goes through the login flow — printing the URL for us to extract.
      await daemon.waitForString(/If the page does not open automatically/)
      const loginId = daemon
        .getOutput()
        .match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        )[0]
      await mobbApi.cliLogin(loginId)

      // Wait for auth to complete and poll loop to start
      await daemon.waitForString(/Login to Mobb success/)
      await setTimeout(1_000)

      // Assert — process is still running (hasn't exited)
      assert.strictEqual(
        daemon.getExitCode(),
        null,
        'Daemon should still be running after startup'
      )

      // Verify PID file was created with valid contents
      const pidFile = path.join(npm.homeDir, '.mobbdev', 'daemon.pid')
      const pidData = JSON.parse(fs.readFileSync(pidFile, 'utf8'))
      assert.ok(pidData.pid > 0, 'PID should be a positive number')
      assert.ok(pidData.startedAt > 0, 'startedAt should be set')
      assert.ok(pidData.heartbeat > 0, 'heartbeat should be set')
      assert.ok(
        Date.now() - pidData.heartbeat < 15_000,
        'Heartbeat should be recent'
      )

      // Cleanup
      daemon.kill()
      await daemon.waitForExit()
    }
  )
})
