import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

import { move } from 'fs-extra'

import type { Logger } from '../../../utils/shared-logger/create-logger'
import { processContextFiles } from '../context_file_processor'
import type { ContextFileEntry, SkillGroup } from '../context_file_scanner'
import { ORPHAN_SWEEP_GRACE_MS } from './constants'
import { Metric } from './metrics'
import {
  getQuarantinedHashDir,
  getQuarantinedTargetPath,
  getQuarantineRoot,
  getStagingDir,
  STAGING_DIR_REGEX,
} from './paths'
import type { SkillVerdict } from './queryVerdicts'
import { renderStub } from './stubTemplate'

/**
 * T-467 — quarantine one skill. Two-phase transactional move, then stub
 * write, then pre-register the stub-md5 presence dir to suppress
 * self-quarantine loops (plan §3.2).
 *
 * All branches are idempotent: re-running on an already-quarantined skill
 * short-circuits at the presence check.
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
  | { status: 'move_error'; phase: 'stage' | 'publish'; err: unknown }
  | { status: 'stub_error'; err: unknown }

export async function quarantineSkill(
  params: QuarantineSkillParams
): Promise<QuarantineOutcome> {
  const { skillPath, isFolder, md5, origName, verdict, log } = params

  const hashDir = getQuarantinedHashDir(md5)

  // Step 2 (plan): presence check — the parent `{md5}/` dir is the state.
  // `existsSync` has no real async equivalent; for a single stat it's
  // fine.
  if (existsSync(hashDir)) {
    log.debug(
      { md5, metric: Metric.ALREADY_QUARANTINED },
      'skill_quarantine: already quarantined, skipping'
    )
    return { status: 'already_quarantined' }
  }

  const stagingDir = getStagingDir(md5, process.pid, randomUUID())
  const stagingTarget = path.join(stagingDir, origName)
  const finalTarget = getQuarantinedTargetPath(md5, origName)

  // Step 3: two-phase transactional move. {md5}/ only becomes visible
  // once fully published via the atomic rename in phase 2.
  try {
    await mkdir(stagingDir, { recursive: true })
  } catch (err) {
    log.error(
      { err, md5, metric: Metric.MOVE_ERROR, phase: 'stage' },
      'skill_quarantine: failed to create staging dir'
    )
    return { status: 'move_error', phase: 'stage', err }
  }

  try {
    // fs-extra's move transparently handles cross-filesystem moves
    // (EXDEV → copy-then-remove), so this one call works for dev-container
    // setups where workspace and ~/.tracy/ live on different mounts.
    await move(skillPath, stagingTarget)
  } catch (err) {
    // Phase-1 fail: destroy staging; original still at skillPath.
    await tryRm(stagingDir)
    log.error(
      { err, md5, metric: Metric.MOVE_ERROR, phase: 'stage' },
      'skill_quarantine: phase-1 move failed'
    )
    return { status: 'move_error', phase: 'stage', err }
  }

  try {
    await rename(stagingDir, hashDir)
  } catch (err) {
    // Phase-2 fail: preserve staging for manual recovery (plan §5). The
    // orphan sweep's grace window keeps it on disk for 10 minutes.
    log.error(
      {
        err,
        md5,
        stagingDir,
        metric: Metric.MOVE_ERROR,
        phase: 'publish',
      },
      'skill_quarantine: phase-2 publish failed; staging dir preserved for manual recovery'
    )
    return { status: 'move_error', phase: 'publish', err }
  }

  // Step 4: recreate skillPath with the stub.
  const quarantinedPath = finalTarget
  const stubContent = renderStub({
    md5,
    isFolder,
    quarantinedPath,
    origPath: skillPath,
    summary: verdict.summary,
    scannerName: verdict.scannerName,
    scannerVersion: verdict.scannerVersion,
    scannedAt: verdict.scannedAt,
  })

  try {
    if (isFolder) {
      await mkdir(skillPath, { recursive: true })
      await writeFile(path.join(skillPath, 'SKILL.md'), stubContent, 'utf8')
    } else {
      await writeFile(skillPath, stubContent, 'utf8')
    }
  } catch (err) {
    // The move has already succeeded; the quarantine is durable. Missing
    // stub is a UX bug, not a security one — next heartbeat's presence
    // check will short-circuit since {md5}/ exists.
    log.error(
      { err, md5, skillPath, metric: Metric.STUB_ERROR },
      'skill_quarantine: stub write failed; quarantine is still in place'
    )
    return { status: 'stub_error', err }
  }

  // Step 5: pre-register the stub-md5 dir to suppress self-quarantine loops.
  await preRegisterStubMd5(skillPath, isFolder, log)

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
 * Compute the stub's md5 (by re-zipping the stub exactly as the uploader
 * would) and create an empty `{stubMd5}/` dir. Next heartbeat's presence
 * check will hit → the stub won't be quarantined as its own malicious
 * artifact. See plan §3.2 step 5 for the known upload/scan-waste tradeoff.
 */
async function preRegisterStubMd5(
  skillPath: string,
  isFolder: boolean,
  log: Logger
): Promise<void> {
  try {
    const stubEntries = await gatherStubEntries(skillPath, isFolder)
    const stubGroup: SkillGroup = {
      name: path.basename(skillPath).replace(/\.md$/i, ''),
      root: 'workspace',
      skillPath,
      files: stubEntries,
      isFolder,
      maxMtimeMs: Date.now(),
      sessionKey: `quarantine-stub:${skillPath}`,
    }
    const { skills } = await processContextFiles([], [stubGroup])
    if (skills.length === 0) return
    const stubMd5 = skills[0]!.md5
    await mkdir(getQuarantinedHashDir(stubMd5), { recursive: true })
  } catch (err) {
    // Best-effort — if this fails, the worst case is an extra scan round
    // next heartbeat (captured in plan §3.2 tradeoff discussion).
    log.warn(
      { err, skillPath },
      'skill_quarantine: failed to pre-register stub md5'
    )
  }
}

async function gatherStubEntries(
  skillPath: string,
  isFolder: boolean
): Promise<ContextFileEntry[]> {
  const now = Date.now()
  const target = isFolder ? path.join(skillPath, 'SKILL.md') : skillPath
  const [st, content] = await Promise.all([
    stat(target),
    readFile(target, 'utf8'),
  ])
  return [
    {
      name: isFolder ? 'SKILL.md' : path.basename(skillPath),
      path: target,
      content,
      sizeBytes: st.size,
      category: 'skill',
      mtimeMs: now,
    },
  ]
}

/**
 * T-467 — sweep stale staging dirs at the top of every quarantine check.
 * Any `{md5}_tmp_*` dir older than the grace window is removed; fresher
 * ones are left (they may be in-flight or phase-2-failure preservations).
 */
export async function sweepOrphanStagingDirs(log: Logger): Promise<number> {
  const root = getQuarantineRoot()
  let entries: string[]
  try {
    entries = await readdir(root)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return 0
    log.warn({ err, root }, 'skill_quarantine: orphan sweep readdir failed')
    return 0
  }
  const now = Date.now()
  let swept = 0
  for (const entry of entries) {
    if (!STAGING_DIR_REGEX.test(entry)) continue
    const full = path.join(root, entry)
    let mtimeMs: number
    try {
      mtimeMs = (await stat(full)).mtimeMs
    } catch {
      continue
    }
    if (now - mtimeMs < ORPHAN_SWEEP_GRACE_MS) continue
    try {
      await rm(full, { recursive: true, force: true })
      swept += 1
      log.info(
        { path: full, metric: Metric.ORPHAN_SWEPT },
        'skill_quarantine: orphan swept'
      )
    } catch (err) {
      log.warn({ err, path: full }, 'skill_quarantine: orphan sweep rm failed')
    }
  }
  return swept
}

async function tryRm(p: string): Promise<void> {
  try {
    await rm(p, { recursive: true, force: true })
  } catch {
    // best-effort cleanup
  }
}
