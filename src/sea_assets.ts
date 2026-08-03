/**
 * Materialize SEA-embedded assets (package.json, .env, protos) to a versioned
 * cache dir so the rest of the CLI can keep using filesystem paths via
 * getModuleRootDir(). Must be imported before anything that reads those files.
 *
 * Uses process.getBuiltinModule so tsup/esbuild cannot rewrite `node:sea` into
 * the non-resolvable bare `sea` id (CJS shims strip the `node:` prefix from
 * require/import).
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

type SeaModule = {
  isSea: () => boolean
  getAsset: (key: string) => ArrayBuffer
  getAssetKeys: () => string[]
}

function loadSea(): SeaModule | null {
  const getBuiltin = (
    process as NodeJS.Process & {
      getBuiltinModule?: (id: string) => SeaModule | undefined
    }
  ).getBuiltinModule
  if (typeof getBuiltin !== 'function') {
    return null
  }
  return getBuiltin('node:sea') ?? null
}

function materializeSeaAssets(): void {
  const sea = loadSea()
  if (!sea?.isSea()) {
    return
  }

  const keys = sea.getAssetKeys()
  if (keys.length === 0) {
    return
  }

  const pkgBuf = Buffer.from(sea.getAsset('package.json'))
  const version =
    (JSON.parse(pkgBuf.toString('utf8')) as { version?: string }).version ||
    'unknown'
  const digest = crypto
    .createHash('sha256')
    .update(pkgBuf)
    .digest('hex')
    .slice(0, 12)
  const root = path.join(
    os.homedir(),
    '.mobb',
    'sea-assets',
    `${version}-${digest}`
  )
  const marker = path.join(root, '.complete')

  if (!fs.existsSync(marker)) {
    // Write-then-rename per file: two CLI processes starting concurrently on a
    // cold cache both materialize the same bytes, and rename is atomic, so a
    // reader never sees a half-written asset. Marker last — it means "done".
    for (const key of keys) {
      const dest = path.join(root, key)
      const tmp = `${dest}.tmp.${process.pid}`
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.writeFileSync(tmp, Buffer.from(sea.getAsset(key)))
      fs.renameSync(tmp, dest)
    }
    fs.writeFileSync(marker, '')
  }

  process.env['MOBBDEV_MODULE_ROOT'] = root
}

materializeSeaAssets()
