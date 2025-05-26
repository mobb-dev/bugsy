import * as assert from 'node:assert'
import { test } from 'node:test'

import AdmZip from 'adm-zip'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import {
  cleanupCheckmarxCliConfig,
  CLI_LOCAL_ENV_OVERWRITE,
  SAST_PROVIDERS_ENV,
  SVJP_CX_REPORT,
} from './utils.mjs'

test('Bugsy E2E tests', async (t) => {
  await t.before(async () => {
    await mobbApi.init()
    await registry.start()
    await npm.init()
  })

  await t.beforeEach(async () => {
    await npm.cleanConfigstore()
  })

  await t.after(async () => {
    await registry.stop()
    await npm.destroy()
  })

  await t.test('help screen', async () => {
    // Arrange
    const bugsy = await npm.npx(['mobbdev'], CLI_LOCAL_ENV_OVERWRITE)

    // Act
    await bugsy.waitForExit()

    // Assert
    assert.strictEqual(bugsy.getExitCode(), 0)
    assert.match(
      bugsy.getOutput(),
      /Bugsy - Trusted, Automatic Vulnerability Fixer/
    )
    assert.match(bugsy.getOutput(), /mobbdev add-scm-token/)
    assert.match(bugsy.getOutput(), /mobbdev scan/)
    assert.match(bugsy.getOutput(), /mobbdev analyze/)
    assert.match(bugsy.getOutput(), /mobbdev review/)
  })

  await t.test(
    'analyze: login with browser, zip upload repo and opengrep scan',
    async () => {
      // Arrange
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const tmpDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'mobb-cli-test-pack')
      )
      const zip = new AdmZip(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          'services',
          'node_general_backend',
          'src',
          'maintenance',
          'try_now',
          'juice-shop',
          'repo.zip'
        )
      )
      zip.extractAllTo(tmpDir)
      const bugsy = npm.npx(
        ['mobbdev', 'analyze', '-p', tmpDir, '-r', 'https://example.com'],
        CLI_LOCAL_ENV_OVERWRITE
      )

      // Act
      await bugsy.waitForString(
        /Login to Mobb is Required, you will be redirected/
      )
      bugsy.sendEnterKey()
      await bugsy.waitForString(/If the page does not open automatically/)

      const loginId = bugsy
        .getOutput()
        .match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        )[0]
      await mobbApi.cliLogin(loginId)

      await bugsy.waitForString(/Hit any key to view available fixes/, 200000)
      await bugsy.sendEnterKey()
      await bugsy.waitForExit()

      // Assert
      assert.strictEqual(bugsy.getExitCode(), 0)
      assert.match(bugsy.getOutput(), /You can access the analysis at/)
      assert.match(
        bugsy.getOutput(),
        /\/organization\/[^/]+\/project\/[^/]+\/report\/[^/]+/,
        'Bugsy output should contain Mobb report URL.'
      )
    }
  )

  await t.test(
    'analyze: login with browser, public GitHub repo and opengrep scan',
    async () => {
      // Arrange
      const bugsy = npm.npx(
        [
          'mobbdev',
          'analyze',
          '-r',
          'https://github.com/mobb-dev/simple-vulnerable-java-project',
        ],
        CLI_LOCAL_ENV_OVERWRITE
      )

      // Act
      await bugsy.waitForString(
        /Login to Mobb is Required, you will be redirected/
      )
      bugsy.sendEnterKey()
      await bugsy.waitForString(/If the page does not open automatically/)

      const loginId = bugsy
        .getOutput()
        .match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        )[0]
      await mobbApi.cliLogin(loginId)

      await bugsy.waitForString(/Hit any key to view available fixes/)
      await bugsy.sendEnterKey()
      await bugsy.waitForExit()

      // Assert
      assert.strictEqual(bugsy.getExitCode(), 0)
      assert.match(bugsy.getOutput(), /You can access the analysis at/)
      assert.match(
        bugsy.getOutput(),
        /\/organization\/[^/]+\/project\/[^/]+\/report\/[^/]+/,
        'Bugsy output should contain Mobb report URL.'
      )
    }
  )

  await t.test('analyze: login with browser, public GitHub repo', async () => {
    // Arrange
    const bugsy = npm.npx(
      [
        'mobbdev',
        'analyze',
        '-r',
        'https://github.com/mobb-dev/simple-vulnerable-java-project',
        '-f',
        SVJP_CX_REPORT,
      ],
      CLI_LOCAL_ENV_OVERWRITE
    )

    // Act
    await bugsy.waitForString(
      /Login to Mobb is Required, you will be redirected/
    )
    bugsy.sendEnterKey()
    await bugsy.waitForString(/If the page does not open automatically/)

    const loginId = bugsy
      .getOutput()
      .match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)[0]
    await mobbApi.cliLogin(loginId)

    await bugsy.waitForString(/Hit any key to view available fixes/)
    await bugsy.sendEnterKey()
    await bugsy.waitForExit()

    // Assert
    assert.strictEqual(bugsy.getExitCode(), 0)
    assert.match(bugsy.getOutput(), /You can access the analysis at/)
    assert.match(
      bugsy.getOutput(),
      /\/organization\/[^/]+\/project\/[^/]+\/report\/[^/]+/,
      'Bugsy output should contain Mobb report URL.'
    )
  })

  await t.test(
    'scan: login with browser, Snyk, public GitHub repo (stop after Snyk login request)',
    async () => {
      // Arrange
      const bugsy = npm.npx(
        [
          'mobbdev',
          'scan',
          '-r',
          'https://github.com/mobb-dev/simple-vulnerable-java-project',
        ],
        CLI_LOCAL_ENV_OVERWRITE
      )

      // Act
      await bugsy.waitForString(
        /Choose a scanner you wish to use to scan your code/
      )
      bugsy.sendEnterKey()

      await bugsy.waitForString(
        /Login to Mobb is Required, you will be redirected/
      )
      bugsy.sendEnterKey()
      await bugsy.waitForString(/If the page does not open automatically/)

      const loginId = bugsy
        .getOutput()
        .match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        )[0]
      await mobbApi.cliLogin(loginId)

      await bugsy.waitForString(
        /Login to Snyk is required, press any key to continue/
      )
      bugsy.sendEnterKey()

      await bugsy.waitForString(/https:\/\/app\.snyk\.io\/oauth2\/authorize\?/)
      bugsy.kill()
      await bugsy.waitForExit()

      // Assert
      assert.match(
        bugsy.getOutput(),
        /https:\/\/app\.snyk\.io\/oauth2\/authorize\?/,
        'Bugsy output should contain Snyk authorization URL.'
      )
    }
  )

  await t.test('scan: API key, Checkmarx, public GitHub repo', async () => {
    // Arrange
    await cleanupCheckmarxCliConfig()
    const apiKey = await mobbApi.createApiToken()
    const bugsy = npm.npx(
      [
        'mobbdev',
        'scan',
        '--api-key',
        apiKey,
        '--cx-project-name',
        'kirill-test',
        '-r',
        'https://github.com/mobb-dev/simple-vulnerable-java-project',
      ],
      CLI_LOCAL_ENV_OVERWRITE
    )

    // Act
    await bugsy.waitForString(
      /Choose a scanner you wish to use to scan your code/
    )
    bugsy.sendArrowDownKey()
    bugsy.sendEnterKey()

    await bugsy.waitForString(
      /Checkmarx needs to be configured before we start, press any key to continue/
    )
    bugsy.sendEnterKey()
    await bugsy.waitForString(/AST Base URI/)
    bugsy.communicate(SAST_PROVIDERS_ENV.CX_BASE_URI)
    bugsy.sendEnterKey()
    await bugsy.waitForString(/AST Base Auth URI/)
    bugsy.communicate(SAST_PROVIDERS_ENV.CX_BASE_AUTH_URI)
    bugsy.sendEnterKey()
    await bugsy.waitForString(/AST Tenant/)
    bugsy.communicate(SAST_PROVIDERS_ENV.CX_TENANT)
    bugsy.sendEnterKey()
    await bugsy.waitForString(/Do you want to use API Key authentication/)
    bugsy.communicate('y')
    bugsy.sendEnterKey()
    await bugsy.waitForString(/AST API Key/)
    bugsy.communicate(SAST_PROVIDERS_ENV.CX_APIKEY)
    bugsy.sendEnterKey()

    // Checkmarx scan can take some time. Set timeout for 2 minutes to avoid test flakiness.
    await bugsy.waitForString(/Hit any key to view available fixes/, 200000)
    bugsy.sendEnterKey()
    await bugsy.waitForExit()

    // Assert
    assert.strictEqual(bugsy.getExitCode(), 0)
    assert.match(bugsy.getOutput(), /Checkmarx Scan completed/)
    assert.match(
      bugsy.getOutput(),
      /\/organization\/[^/]+\/project\/[^/]+\/report\/[^/]+/,
      'Bugsy output should contain Mobb report URL.'
    )
    assert.match(
      bugsy.getOutput(),
      /My work here is done for now, see you soon/
    )
  })
})
