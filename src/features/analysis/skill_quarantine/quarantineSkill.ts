import { randomUUID } from 'node:crypto'
import {
  access,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

import AdmZip from 'adm-zip'

import type { Logger } from '../../../utils/shared-logger/create-logger'
import { PARTIAL_SWEEP_GRACE_MS } from './constants'
import { Metric } from './metrics'
import {
  COMMITTED_ZIP_REGEX,
  getQuarantineRoot,
  getQuarantineZipPath,
  getTmpZipPath,
  TMP_ZIP_REGEX,
} from './paths'
import type { SkillVerdict } from './queryVerdicts'
import { renderStub } from './stubTemplate'

/**
 * T-467 — quarantine one skill.
 *
 *   phase 1: build zip in memory, write to `<md5>_tmp_<uuid>.zip`.
 *   phase 2: replace skillPath with the stub (neutralizes execution).
 *   phase 3: rename `_tmp_` → `<md5>.zip`. Presence = "fully quarantined".
 *
 * `<md5>` matches the server's verdict record (sanitized md5). The zip
 * holds RAW bytes so false-positive recovery preserves secrets.
 *
 * `reconcileAndSweep` finishes crashed runs (leftover `_tmp_` → published
 * or swept depending on whether it parses as a valid zip).
 */

export type QuarantineSkillParams = {
  skillPath: string
  isFolder: boolean
  md5: string
  origName: string
  verdict: SkillVerdict
  log: Logger
}

export type QuarantineOutcome =
  | { status: 'quarantined' }
  | { status: 'already_quarantined' }
  | { status: 'zip_error'; err: unknown }
  | { status: 'stub_error'; err: unknown }
  | { status: 'publish_error'; err: unknown }

export async function quarantineSkill(
  params: QuarantineSkillParams
): Promise<QuarantineOutcome> {
  const { skillPath, isFolder, md5, origName, verdict, log } = params
  const finalZip = getQuarantineZipPath(md5)

  if (await exists(finalZip)) {
    log.debug(
      { md5, metric: Metric.ALREADY_QUARANTINED },
      'skill_quarantine: already quarantined'
    )
    return { status: 'already_quarantined' }
  }

  const tmpZip = getTmpZipPath(md5, randomUUID())

  try {
    await mkdir(getQuarantineRoot(), { recursive: true })
    const zip = new AdmZip()
    if (isFolder) {
      await addFolderAsync(zip, skillPath, origName)
    } else {
      zip.addFile(origName, await readFile(skillPath))
    }
    await writeFile(tmpZip, zip.toBuffer())
  } catch (err) {
    await unlink(tmpZip).catch(ignoreErr)
    log.error(
      { err, md5, metric: Metric.ZIP_ERROR },
      'skill_quarantine: phase-1 zip write failed'
    )
    return { status: 'zip_error', err }
  }

  try {
    await writeStub(params)
  } catch (err) {
    log.error(
      { err, md5, skillPath, metric: Metric.STUB_ERROR },
      'skill_quarantine: stub write failed; tmp zip preserved for reconcile'
    )
    return { status: 'stub_error', err }
  }

  try {
    await rename(tmpZip, finalZip)
  } catch (err) {
    log.error(
      { err, md5, tmpZip, metric: Metric.PUBLISH_ERROR },
      'skill_quarantine: phase-3 publish failed; reconcile will retry'
    )
    return { status: 'publish_error', err }
  }

  log.info(
    {
      md5,
      verdict: verdict.verdict,
      shape: isFolder ? 'folder' : 'standalone',
      scanner: verdict.scannerName,
      scannerVersion: verdict.scannerVersion,
      metric: Metric.QUARANTINED,
    },
    'skill_quarantine: quarantined'
  )
  return { status: 'quarantined' }
}

/**
 * Replace `skillPath` with the rendered stub. Folder skill: rm-rf then
 * recreate with a single SKILL.md. Standalone: overwrite the .md file.
 * The folder case isn't atomic across its steps; a crash mid-step leaves
 * a half-rebuilt directory that the next tick simply re-enumerates over
 * (the zip is already safely in `_tmp_`).
 */
async function writeStub(params: QuarantineSkillParams): Promise<void> {
  const { skillPath, isFolder, md5, verdict } = params
  const stubContent = renderStub({
    md5,
    isFolder,
    quarantinedZipPath: getQuarantineZipPath(md5),
    origPath: skillPath,
    summary: verdict.summary,
    scannerName: verdict.scannerName,
    scannerVersion: verdict.scannerVersion,
    scannedAt: verdict.scannedAt,
  })
  if (isFolder) {
    await rm(skillPath, { recursive: true, force: true })
    await mkdir(skillPath, { recursive: true })
    await writeFile(path.join(skillPath, 'SKILL.md'), stubContent, 'utf8')
  } else {
    await writeFile(skillPath, stubContent, 'utf8')
  }
}

/**
 * T-467 — reconcile + sweep pass, run at the top of every check.
 *
 * For each `<md5>_tmp_*.zip` in the root:
 *   - `<md5>.zip` sibling exists → unlink (redundant).
 *   - parses as a valid zip → rename → `<md5>.zip` (finish a crash
 *     between phase 2 and phase 3).
 *   - invalid zip and older than grace → unlink (partial from phase-1
 *     crash).
 *   - invalid zip and fresh → leave (may be in-flight).
 */
export async function reconcileAndSweep(log: Logger): Promise<void> {
  const root = getQuarantineRoot()
  let entries: string[]
  try {
    entries = await readdir(root)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return
    log.warn({ err, root }, 'skill_quarantine: reconcile readdir failed')
    return
  }

  const committed = new Set(
    entries
      .map((e) => COMMITTED_ZIP_REGEX.exec(e)?.[1])
      .filter((m): m is string => m !== undefined)
  )

  const now = Date.now()
  for (const entry of entries) {
    const md5 = TMP_ZIP_REGEX.exec(entry)?.[1]
    if (md5 === undefined) continue
    const full = path.join(root, entry)

    if (committed.has(md5)) {
      await unlink(full).catch((err) =>
        log.warn(
          { err, path: full, md5 },
          'skill_quarantine: redundant tmp unlink failed'
        )
      )
      log.info(
        { path: full, md5, metric: Metric.SWEPT_REDUNDANT_TMP },
        'skill_quarantine: swept redundant tmp'
      )
      continue
    }

    let valid: boolean
    try {
      new AdmZip(full).getEntries()
      valid = true
    } catch {
      valid = false
    }

    if (valid) {
      try {
        await rename(full, getQuarantineZipPath(md5))
        committed.add(md5)
        log.info(
          { path: full, md5, metric: Metric.RECONCILED },
          'skill_quarantine: reconciled tmp → published'
        )
      } catch (err) {
        log.warn(
          { err, path: full, md5 },
          'skill_quarantine: reconcile rename failed'
        )
      }
      continue
    }

    // Broken archive — probably a crashed writeFile. Give it the grace
    // window in case another process is mid-write, then sweep.
    const { mtimeMs } = await stat(full).catch(() => ({ mtimeMs: now }))
    if (now - mtimeMs < PARTIAL_SWEEP_GRACE_MS) continue
    await unlink(full).catch((err) =>
      log.warn({ err, path: full }, 'skill_quarantine: partial unlink failed')
    )
    log.info(
      { path: full, metric: Metric.SWEPT_PARTIAL },
      'skill_quarantine: swept broken tmp (partial write)'
    )
  }
}

function exists(p: string): Promise<boolean> {
  return access(p).then(
    () => true,
    () => false
  )
}

/** Swallow-on-failure handler for best-effort cleanup. */
function ignoreErr(): void {
  // intentionally empty
}

/**
 * Walk `root` and add every regular file to `zip` with entry paths of the
 * form `<prefix>/<rel-from-root>`. I/O stays async (readdir/readFile);
 * AdmZip's `addFile` is an in-memory buffer operation.
 */
async function addFolderAsync(
  zip: AdmZip,
  root: string,
  prefix: string
): Promise<void> {
  async function walk(dir: string, relPrefix: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      const rel = path.posix.join(relPrefix, e.name)
      if (e.isDirectory()) await walk(full, rel)
      else if (e.isFile()) zip.addFile(rel, await readFile(full))
    }
  }
  await walk(root, prefix)
}
