#!/usr/bin/env node
// Build standalone mobbdev binaries with Node.js Single Executable Applications
// (https://nodejs.org/api/single-executable-applications.html).
//
//   node scripts/build_binary.mjs            host platform only (local dev)
//   node scripts/build_binary.mjs --all      the release matrix (CI publish)
//   node scripts/build_binary.mjs linux-arm64 [...]   specific targets
//
// Output: binaries/mobbdev-<platform>-<arch>[.exe] — names use Node's
// process.platform/process.arch so the npm launcher can construct them.
//
// Cross-target builds download matching Node distributions into
// ~/.cache/mobbdev-node-sea/<version>/ and inject the SEA blob with postject.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

import {
  binJs,
  hostTarget,
  parseTarget,
  RELEASE_TARGETS,
  readVersion,
} from '../../scripts/targets.mjs'

const CLI_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const NODE_VERSION = process.versions.node
const CACHE_DIR = path.join(
  process.env['XDG_CACHE_HOME'] || path.join(os.homedir(), '.cache'),
  'mobbdev-node-sea',
  NODE_VERSION
)
const SEA_CONFIG = path.join(CLI_DIR, 'dist-binary/sea-config.json')
const SEA_BLOB = path.join(CLI_DIR, 'dist-binary/sea-prep.blob')
const FUSE = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2'
const OUT_DIR = path.join(CLI_DIR, 'binaries')
const CLI_PKG = path.join(CLI_DIR, 'package.json')

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { cwd: CLI_DIR, stdio: 'inherit', ...opts })
  if (res.error) throw res.error
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited ${res.status}`)
  }
}

function has(cmd) {
  return !spawnSync(cmd, ['--version'], { stdio: 'ignore' }).error
}

/** SEA assets: package.json, optional .env, and the proto files. */
function collectAssets() {
  const assets = { 'package.json': 'package.json' }
  if (fs.existsSync(path.join(CLI_DIR, '.env'))) assets['.env'] = '.env'

  const protoRoot = 'src/features/codeium_intellij/proto'
  const walk = (dir) => {
    for (const ent of fs.readdirSync(path.join(CLI_DIR, dir), {
      withFileTypes: true,
    })) {
      const rel = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(rel)
      else if (ent.name.endsWith('.proto')) assets[rel] = rel
    }
  }
  if (fs.existsSync(path.join(CLI_DIR, protoRoot))) walk(protoRoot)
  return assets
}

function writeSeaConfig() {
  fs.mkdirSync(path.join(CLI_DIR, 'dist-binary'), { recursive: true })
  fs.writeFileSync(
    SEA_CONFIG,
    JSON.stringify(
      {
        main: 'dist-binary/cli.js',
        output: path.relative(CLI_DIR, SEA_BLOB),
        disableExperimentalSEAWarning: true,
        // Required for cross-platform injection (host builds the blob once).
        useCodeCache: false,
        useSnapshot: false,
        assets: collectAssets(),
      },
      null,
      2
    ) + '\n'
  )
}

function nodeDistUrl(platform, arch) {
  const base = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}`
  if (platform === 'win32') return `${base}-win-${arch}.zip`
  if (platform === 'darwin') return `${base}-darwin-${arch}.tar.gz`
  return `${base}-linux-${arch}.tar.xz`
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok || !res.body) {
    throw new Error(`download failed with HTTP ${res.status}: ${url}`)
  }
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest))
}

/** Resolve (downloading + extracting if needed) a node binary for a target. */
async function nodeBinaryForTarget({ platform, arch }) {
  if (platform === process.platform && arch === process.arch) {
    return process.execPath
  }

  const nodeOs = platform === 'win32' ? 'win' : platform
  const extractDir = path.join(CACHE_DIR, `node-v${NODE_VERSION}-${nodeOs}-${arch}`)
  const binPath = path.join(
    extractDir,
    platform === 'win32' ? 'node.exe' : 'bin/node'
  )
  if (fs.existsSync(binPath)) return binPath

  const url = nodeDistUrl(platform, arch)
  const archive = path.join(CACHE_DIR, path.basename(url))
  console.log(`==> Downloading Node v${NODE_VERSION} (${nodeOs}-${arch})`)
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  await download(url, archive)
  fs.rmSync(extractDir, { recursive: true, force: true })

  if (platform === 'win32') {
    // unzip yields node-v.../node.exe; normalize to extractDir/node.exe
    const tmp = path.join(CACHE_DIR, `_unz_${process.pid}`)
    fs.rmSync(tmp, { recursive: true, force: true })
    fs.mkdirSync(tmp, { recursive: true })
    run('unzip', ['-q', archive, '-d', tmp])
    fs.renameSync(
      path.join(tmp, `node-v${NODE_VERSION}-win-${arch}`),
      extractDir
    )
    fs.rmSync(tmp, { recursive: true, force: true })
  } else {
    run('tar', [platform === 'darwin' ? '-xzf' : '-xJf', archive, '-C', CACHE_DIR])
  }

  if (!fs.existsSync(binPath)) {
    throw new Error(`node binary not found at ${binPath} after download`)
  }
  return binPath
}

function injectSea(nodeBin, out, platform) {
  // macOS refuses to exec a Mach-O whose signature postject invalidated (arm64
  // kills it outright), so re-signing is mandatory, not best-effort: without
  // codesign we would silently publish a binary that SIGKILLs on every Mac.
  if (platform === 'darwin' && !has('codesign')) {
    throw new Error(
      "macOS targets require 'codesign' (build them on a macOS host)"
    )
  }

  fs.copyFileSync(nodeBin, out)
  fs.chmodSync(out, 0o755)

  if (platform === 'darwin') {
    spawnSync('codesign', ['--remove-signature', out], { stdio: 'ignore' })
  }

  const args = [out, 'NODE_SEA_BLOB', SEA_BLOB, '--sentinel-fuse', FUSE]
  if (platform === 'darwin') args.push('--macho-segment-name', 'NODE_SEA')
  run(process.execPath, [binJs(CLI_PKG, 'postject'), ...args])

  if (platform === 'darwin') {
    run('codesign', ['--sign', '-', out])
    run('codesign', ['--verify', out])
  }
}

async function main() {
  const argv = process.argv.slice(2)
  let targets
  let wipe = true
  if (argv[0] === '--all') {
    targets = RELEASE_TARGETS
  } else if (argv.length > 0) {
    // Explicit targets add to existing binaries/ instead of replacing it.
    targets = argv
    wipe = false
  } else {
    targets = [hostTarget()]
  }

  console.log('==> Bundling (CJS, deps included)')
  run(process.execPath, [binJs(CLI_PKG, 'tsup', 'tsup-node'), '--config', 'tsup.binary.config.js'], {
    env: { ...process.env, npm_package_version: readVersion(CLI_DIR) },
  })

  writeSeaConfig()
  console.log('==> Generating SEA preparation blob')
  run(process.execPath, [
    '--experimental-sea-config',
    path.relative(CLI_DIR, SEA_CONFIG),
  ])

  if (wipe) fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const target of targets) {
    const { platform, arch, outName } = parseTarget(target)
    const out = path.join(OUT_DIR, outName)
    console.log(`==> SEA ${target} (Node ${NODE_VERSION}) -> binaries/${outName}`)
    injectSea(await nodeBinaryForTarget({ platform, arch }), out, platform)
  }

  console.log('==> Done. Binaries in clients/cli/binaries/')
  for (const f of fs.readdirSync(OUT_DIR)) {
    const mb = (fs.statSync(path.join(OUT_DIR, f)).size / 1024 ** 2).toFixed(0)
    console.log(`    ${f}  ${mb}M`)
  }
}

main().catch((err) => {
  console.error(`error: ${err.message}`)
  process.exit(1)
})
