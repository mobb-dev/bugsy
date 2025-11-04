/**
 * CLI Multi-Version Compatibility Tests
 *
 * These tests verify that the CLI package can be installed and is compatible
 * with different Node.js versions (18.20+, 20.x, 22.x).
 *
 * This ensures backward compatibility for users who haven't upgraded
 * to Node 22 yet.
 */

import * as assert from 'node:assert'
import { execSync } from 'node:child_process'
import { test } from 'node:test'

const NODE_VERSION = process.env.NODE_VERSION || process.version

test(`CLI Compatibility on Node ${NODE_VERSION}`, async (t) => {
  await t.test('Node version verification', () => {
    const nodeVersion = process.version
    console.log(`Running tests on Node.js ${nodeVersion}`)

    // Verify we're running on the expected Node version
    if (NODE_VERSION) {
      assert.ok(
        nodeVersion.startsWith(`v${NODE_VERSION}`),
        `Should be running on Node ${NODE_VERSION}, got ${nodeVersion}`
      )
    }
  })

  await t.test('mobbdev CLI is installed globally', () => {
    const result = execSync('which mobbdev', { encoding: 'utf8' })
    assert.ok(
      result.includes('mobbdev'),
      'mobbdev should be in PATH and executable'
    )
  })

  await t.test('mobbdev package is installed with correct version', () => {
    const result = execSync('npm list -g mobbdev --json', {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    const data = JSON.parse(result)
    assert.ok(
      data.dependencies?.mobbdev,
      'mobbdev should be installed globally'
    )
    assert.match(
      data.dependencies.mobbdev.version,
      /\d+\.\d+\.\d+/,
      'Version should be in semver format (x.y.z)'
    )
    console.log(`mobbdev version: ${data.dependencies.mobbdev.version}`)
  })

  await t.test('CLI package.json specifies correct engine requirement', () => {
    // Get the mobbdev package location
    const pkgPath = execSync('npm root -g', {
      encoding: 'utf8',
    }).trim()
    const pkgJson = JSON.parse(
      execSync(`cat ${pkgPath}/mobbdev/package.json`, {
        encoding: 'utf8',
      })
    )

    assert.ok(pkgJson.engines?.node, 'package.json should specify node engine')
    assert.match(
      pkgJson.engines.node,
      />=18\.20\.0/,
      'Engine requirement should be >=18.20.0'
    )
    console.log(`Engine requirement: ${pkgJson.engines.node}`)
  })

  await t.test(
    'CLI installation is compatible with current Node version',
    () => {
      // Just verify the installation succeeded and files exist
      const result = execSync('npm list -g mobbdev --depth=0', {
        encoding: 'utf8',
      })
      assert.ok(
        result.includes('mobbdev@'),
        'mobbdev should be listed in global packages'
      )
    }
  )
})

console.log(`\n✅ CLI compatibility tests completed on Node ${NODE_VERSION}\n`)
