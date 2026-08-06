// E2E for the standalone binary distribution. Gates publishing.
//
// Covers the two things the Preview env never tests:
//   1. the standalone binary itself (starts, reads embedded assets, subcommands
//      parse, exit codes are correct)
//   2. the npm packaging via a real Verdaccio publish → install path
//      (platform packages published first, then @mobb.ai/cli resolving them via
//      optionalDependencies from the registry)
//
// Requires the host binary in clients/cli/binaries — run `pnpm run build:binary`
// in clients/cli first. The build is deliberately NOT done here: it is slow and
// CI already runs it in the preceding step.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { after, before, describe, test } from 'node:test'

import {
  CLI_DIR,
  hostTarget,
  parseTarget,
  platformPackageName,
  SCOPED_CLI_PKG,
  WRAPPER_DIR,
} from '../../scripts/targets.mjs'
import { assert } from './helpers/assertions.mjs'
import { Registry, REGISTRY_PORT } from './Registry.mjs'
import { run } from './utils.mjs'

const REGISTRY_URL = `http://localhost:${REGISTRY_PORT}`
const HOST = parseTarget(hostTarget())
const HOST_BINARY = path.join(CLI_DIR, 'binaries', HOST.outName)

/** Run the binary (or the installed launcher) and capture output + exit code. */
function cli(bin, args) {
  const res = spawnSync(bin, args, { encoding: 'utf8' })
  return { out: `${res.stdout ?? ''}${res.stderr ?? ''}`, code: res.status }
}

describe('standalone binary', () => {
  before(() => {
    assert(
      fs.existsSync(HOST_BINARY),
      `host binary not found at ${HOST_BINARY} — run 'pnpm run build:binary' in clients/cli first`
    )
  })

  test('--help prints the banner', () => {
    const { out, code } = cli(HOST_BINARY, ['--help'])
    assert(code === 0, `--help exited ${code}`)
    assert(out.includes('Bugsy'), '--help output missing banner')
  })

  for (const cmd of ['scan', 'analyze', 'convert-to-sarif']) {
    test(`${cmd} --help parses`, () => {
      const { code } = cli(HOST_BINARY, [cmd, '--help'])
      assert(code === 0, `${cmd} --help exited ${code}`)
    })
  }

  test('missing required args exits non-zero', () => {
    const { code } = cli(HOST_BINARY, ['scan', '--ci'])
    assert(code !== 0, 'scan without args should exit non-zero')
  })
})

describe('npm packaging (Verdaccio publish → install)', () => {
  const registry = new Registry(REGISTRY_PORT)
  let work
  let proj

  // The launcher's own entry. Invoked directly (fast, cross-platform) to test
  // resolution + exit-code passthrough without a shell shim in the way.
  const launcher = () =>
    path.join(proj, 'node_modules', SCOPED_CLI_PKG, 'bin/mobbdev.js')

  // The `mobbdev` command as npx / `npm i -g` expose it. Only the launcher
  // declares this bin (platform packages carry none), so npm links it
  // unambiguously. 1.4.56 shipped with a `mobbdev` bin on every platform
  // package too: npm saw the collision, linked NONE of them, and
  // `npx @mobb.ai/cli` died with "mobbdev: command not found".
  const binShim = () => path.join(proj, 'node_modules', '.bin', 'mobbdev')

  before(async () => {
    assert(
      fs.existsSync(HOST_BINARY),
      `host binary not found at ${HOST_BINARY} — run 'pnpm run build:binary' in clients/cli first`
    )

    // Generate the artifacts we are about to publish (same generator the
    // release uses, so this exercises the real manifests).
    await run(
      [process.execPath, path.join(WRAPPER_DIR, 'scripts/prepare_publish.mjs')],
      { cwd: WRAPPER_DIR }
    )

    await registry.start()
    work = await mkdtemp(path.join(os.tmpdir(), 'mobb-ai-cli-reg-'))
    const npmrc = [
      `registry=${REGISTRY_URL}`,
      `//localhost:${REGISTRY_PORT}/:_authToken=fake-token`,
      `//localhost:${REGISTRY_PORT}/:always-auth=true`,
    ].join('\n')
    await writeFile(path.join(work, '.npmrc'), npmrc)

    // npm_config_userconfig (not HOME) isolates us from the developer's real
    // ~/.npmrc: overriding HOME breaks version-manager shims that resolve
    // their install dir through it (asdf).
    const npmEnv = {
      ...process.env,
      npm_config_registry: REGISTRY_URL,
      npm_config_userconfig: path.join(work, '.npmrc'),
    }
    const publish = (cwd) =>
      run(
        [
          'npm',
          'publish',
          '--registry',
          REGISTRY_URL,
          '--ignore-scripts',
          '--access',
          'public',
        ],
        { cwd, env: npmEnv }
      )

    // Platform packages first, launcher last — a published launcher must
    // always be able to resolve its optionalDependencies.
    const platformRoot = path.join(WRAPPER_DIR, 'platform-packages')
    for (const name of fs.readdirSync(platformRoot)) {
      await publish(path.join(platformRoot, name))
    }
    await publish(path.join(WRAPPER_DIR, 'publish'))

    proj = path.join(work, 'proj')
    await mkdir(proj, { recursive: true })
    await writeFile(path.join(proj, '.npmrc'), npmrc)
    await writeFile(
      path.join(proj, 'package.json'),
      JSON.stringify({ name: 'mobb-ai-cli-e2e', private: true }, null, 2)
    )
    await run(
      [
        'npm',
        'install',
        '--no-fund',
        '--no-audit',
        '--registry',
        REGISTRY_URL,
        SCOPED_CLI_PKG,
      ],
      { cwd: proj, env: npmEnv }
    )
  })

  after(async () => {
    await registry.stop()
    if (work) fs.rmSync(work, { recursive: true, force: true })
  })

  test('os/cpu gating installs exactly the host platform package', () => {
    const installed = fs
      .readdirSync(path.join(proj, 'node_modules/@mobb.ai'))
      .filter((name) => name.startsWith('cli-'))
    const expected = platformPackageName(HOST.platform, HOST.arch).replace(
      '@mobb.ai/',
      ''
    )
    assert(
      installed.length === 1 && installed[0] === expected,
      `expected only ${expected} to be installed, got [${installed.join(', ')}]`
    )
  })

  test('the mobbdev command lands on PATH (.bin shim linked)', () => {
    // Regression guard for 1.4.56: a bin-name collision left this shim
    // uncreated, so `npx @mobb.ai/cli` could not find `mobbdev`.
    assert(
      fs.existsSync(binShim()),
      `${binShim()} missing — the mobbdev bin was not linked (bin-name collision?)`
    )
  })

  test('launcher runs the binary it resolved', () => {
    const { out, code } = cli(process.execPath, [launcher(), '--help'])
    assert(code === 0, `launcher --help exited ${code}`)
    assert(out.includes('Bugsy'), 'launcher --help output missing banner')
  })

  test('launcher forwards the exit code', () => {
    const direct = cli(HOST_BINARY, ['scan', '--ci'])
    const viaLauncher = cli(process.execPath, [launcher(), 'scan', '--ci'])
    assert(
      direct.code === viaLauncher.code,
      `exit code passthrough broken (direct=${direct.code} launcher=${viaLauncher.code})`
    )
  })
})
