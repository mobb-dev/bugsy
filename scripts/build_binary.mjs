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
//
// macOS targets are re-signed after injection with rcodesign (downloaded into
// ~/.cache/mobbdev-rcodesign/<version>/ and checksum-verified), which signs
// Mach-O from any host — so this runs on the linux release runner, no macOS box
// needed.
//
// Signing config (optional; defaults to ad-hoc, which is enough for `npm i`
// but triggers Gatekeeper on browser-downloaded binaries):
//   MOBB_MACOS_CERT_P12           path to a PKCS#12 (.p12) file holding a
//                                 Developer ID Application cert + private key.
//   MOBB_MACOS_CERT_PASSWORD_FILE path to a file with the .p12 password on a
//                                 single line. Omit for a password-less .p12.
// Set both as CI secrets for signed release builds; leave unset for ad-hoc.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
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
  readVersion,
  RELEASE_TARGETS,
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

const RCODESIGN_VERSION = '0.29.0'
const RCODESIGN_CACHE = path.join(
  process.env['XDG_CACHE_HOME'] || path.join(os.homedir(), '.cache'),
  'mobbdev-rcodesign',
  RCODESIGN_VERSION
)
// SHA-256 of each release tarball (from the release's SHA256SUMS). rcodesign
// signs binaries we ship to users, so its download is verified against these
// before we execute it. Refresh alongside RCODESIGN_VERSION.
const RCODESIGN_SHA256 = {
  'aarch64-apple-darwin':
    'd1a532150adaf90048260d76359261aa716abafc45c53c5dc18845029184334a',
  'x86_64-apple-darwin':
    '14ef11bedd51a8d95eafd767939ae96d5900e5a61511bef75bb21db6e7c74140',
  'aarch64-unknown-linux-musl':
    '4af92c87ddf52f5f2d1258a3b4e56c7dcb8f1b2468df744976c5f139e031961f',
  'x86_64-unknown-linux-musl':
    'dbe85cedd8ee4217b64e9a0e4c2aef92ab8bcaaa41f20bde99781ff02e600002',
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { cwd: CLI_DIR, stdio: 'inherit', ...opts })
  if (res.error) throw res.error
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited ${res.status}`)
  }
}

/** Throw unless `file` hashes to `expected` (SHA-256, hex). */
function verifySha256(file, expected) {
  const actual = createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('hex')
  if (actual !== expected) {
    throw new Error(
      `checksum mismatch for ${path.basename(file)}: ` +
        `expected ${expected}, got ${actual}`
    )
  }
}

/** The rcodesign release triple for the machine we build/sign on. */
function rcodesignTriple() {
  const arch = process.arch === 'arm64' ? 'aarch64' : 'x86_64'
  if (process.platform === 'darwin') return `${arch}-apple-darwin`
  if (process.platform === 'linux') return `${arch}-unknown-linux-musl`
  throw new Error(
    `cannot sign macOS binaries on host ${process.platform}/${process.arch} — ` +
      'rcodesign ships only linux/darwin builds; run the mac targets there'
  )
}

/** Resolve (downloading if needed) an rcodesign binary for the host. */
async function ensureRcodesign() {
  const triple = rcodesignTriple()
  const inner = `apple-codesign-${RCODESIGN_VERSION}-${triple}`
  const bin = path.join(RCODESIGN_CACHE, inner, 'rcodesign')
  if (fs.existsSync(bin)) return bin

  const url =
    'https://github.com/indygreg/apple-platform-rs/releases/download/' +
    `apple-codesign/${RCODESIGN_VERSION}/${inner}.tar.gz`
  const archive = path.join(RCODESIGN_CACHE, `${inner}.tar.gz`)
  console.log(`==> Downloading rcodesign ${RCODESIGN_VERSION} (${triple})`)
  fs.mkdirSync(RCODESIGN_CACHE, { recursive: true })
  await download(url, archive)
  verifySha256(archive, RCODESIGN_SHA256[triple])
  run('tar', ['-xzf', archive, '-C', RCODESIGN_CACHE])
  if (!fs.existsSync(bin)) {
    throw new Error(`rcodesign not found at ${bin} after download`)
  }
  fs.chmodSync(bin, 0o755)
  return bin
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
  const extractDir = path.join(
    CACHE_DIR,
    `node-v${NODE_VERSION}-${nodeOs}-${arch}`
  )
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
    run('tar', [
      platform === 'darwin' ? '-xzf' : '-xJf',
      archive,
      '-C',
      CACHE_DIR,
    ])
  }

  if (!fs.existsSync(binPath)) {
    throw new Error(`node binary not found at ${binPath} after download`)
  }
  return binPath
}

function injectSea(nodeBin, out, platform, rcodesign) {
  fs.copyFileSync(nodeBin, out)
  fs.chmodSync(out, 0o755)

  const args = [out, 'NODE_SEA_BLOB', SEA_BLOB, '--sentinel-fuse', FUSE]
  if (platform === 'darwin') args.push('--macho-segment-name', 'NODE_SEA')
  run(process.execPath, [binJs(CLI_PKG, 'postject'), ...args])

  // macOS refuses to exec a Mach-O whose signature postject invalidated (arm64
  // kills it outright), so re-signing is mandatory. rcodesign re-signs from any
  // prior state (no separate remove step) and runs on the linux release runner.
  // Ad-hoc unless MOBB_MACOS_CERT_P12 points at a Developer ID .p12.
  if (platform === 'darwin') {
    const p12 = process.env['MOBB_MACOS_CERT_P12']
    const pass = process.env['MOBB_MACOS_CERT_PASSWORD_FILE']
    const signArgs = ['sign']
    if (p12) {
      signArgs.push('--p12-file', p12)
      if (pass) signArgs.push('--p12-password-file', pass)
    } else {
      console.warn(
        `    ! ${path.basename(out)}: ad-hoc signed (MOBB_MACOS_CERT_P12 unset) —` +
          ' fine for `npm i`, but Gatekeeper flags browser-downloaded copies'
      )
    }
    signArgs.push(out)
    run(rcodesign, signArgs)

    // `rcodesign verify` checks the CMS signature, which only a real cert
    // produces — it errors on ad-hoc signatures, so gate it on the cert path.
    if (p12) run(rcodesign, ['verify', out])
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
  run(
    process.execPath,
    [binJs(CLI_PKG, 'tsup', 'tsup-node'), '--config', 'tsup.binary.config.js'],
    {
      env: { ...process.env, npm_package_version: readVersion(CLI_DIR) },
    }
  )

  writeSeaConfig()
  console.log('==> Generating SEA preparation blob')
  run(process.execPath, [
    '--experimental-sea-config',
    path.relative(CLI_DIR, SEA_CONFIG),
  ])

  if (wipe) fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Fetch the signer once, only if a mac target is in this run.
  const rcodesign = targets.some((t) => parseTarget(t).platform === 'darwin')
    ? await ensureRcodesign()
    : null

  for (const target of targets) {
    const { platform, arch, outName } = parseTarget(target)
    const out = path.join(OUT_DIR, outName)
    console.log(
      `==> SEA ${target} (Node ${NODE_VERSION}) -> binaries/${outName}`
    )
    injectSea(
      await nodeBinaryForTarget({ platform, arch }),
      out,
      platform,
      rcodesign
    )
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
