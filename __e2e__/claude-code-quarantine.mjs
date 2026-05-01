import * as assert from 'node:assert'
import { randomUUID } from 'node:crypto'
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

import AdmZip from 'adm-zip'

import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE } from './utils.mjs'

// T-467 — spawn the real daemon against the local backend, drop a malicious
// skill into the workspace, and assert the daemon quarantines it on disk.
// Fixture: `ai-productivity-suite` (scanner has already verdicted it MALICIOUS).

const MALICIOUS_FIXTURE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../__tests__/files/malicious-skills/ai-productivity-suite'
)

// npx install + quarantine pipeline budget.
const TEST_TIMEOUT = 360_000
const QUARANTINE_WAIT = 240_000
const DAEMON_POLL_MS = 1_000

function transcriptLine(sessionId, cwd, content) {
  return (
    JSON.stringify({
      parentUuid: null,
      isSidechain: false,
      promptId: randomUUID(),
      type: 'user',
      message: { role: 'user', content },
      uuid: randomUUID(),
      timestamp: new Date().toISOString(),
      userType: 'external',
      entrypoint: 'cli',
      cwd,
      sessionId,
      version: '2.1.96',
      gitBranch: 'main',
    }) + '\n'
  )
}

/**
 * Simulate an active Claude Code user by appending a fresh user-turn line
 * to the transcript every `intervalMs`. The daemon ties quarantine checks
 * to transcript activity (see daemon.ts `drainTranscript`); without this
 * the check runs once up-front and never re-runs — missing verdicts from
 * scans that complete after the first tick.
 */
function simulateUserActivity(transcriptPath, sessionId, cwd, intervalMs) {
  const timer = setInterval(() => {
    try {
      appendFileSync(
        transcriptPath,
        transcriptLine(sessionId, cwd, `e2e heartbeat ${Date.now()}`)
      )
    } catch {
      // best-effort
    }
  }, intervalMs)
  return () => clearInterval(timer)
}

// Layout: `~/.tracy/quarantine/claude/skills/<md5>.zip` is the committed
// archive; `<md5>_tmp_<uuid>.zip` is an in-flight or crashed write.
const COMMITTED_ZIP_REGEX = /^[0-9a-f]{32}\.zip$/

function listCommittedZips(root) {
  if (!existsSync(root)) return []
  return readdirSync(root).filter((e) => COMMITTED_ZIP_REGEX.test(e))
}

function listStaging(root) {
  if (!existsSync(root)) return []
  return readdirSync(root).filter((e) => e.includes('_tmp_'))
}

/**
 * Wait until some `<md5>.zip` in `root` contains an entry whose name
 * starts with `<skillName>/SKILL.md` (folder skills zip with `origName`
 * as the top-level prefix). Returns the absolute zip path or null on
 * timeout.
 */
async function waitForQuarantine(root, skillName, deadline) {
  while (Date.now() < deadline) {
    for (const entry of listCommittedZips(root)) {
      const full = path.join(root, entry)
      try {
        const names = new AdmZip(full).getEntries().map((e) => e.entryName)
        if (names.includes(`${skillName}/SKILL.md`)) return full
      } catch {
        // broken zip — ignore, wait for a valid one to land
      }
    }
    await sleep(2_000)
  }
  return null
}

test(
  'Claude Code Daemon skill quarantine E2E',
  {
    timeout: TEST_TIMEOUT,
  },
  async (t) => {
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
      'malicious skill folder is quarantined end-to-end',
      async () => {
        // Workspace layout: malicious skill copied into .claude/skills/evil/.
        const workspace = path.join(npm.homeDir, 'workspace')
        const evilSkill = path.join(workspace, '.claude', 'skills', 'evil')
        mkdirSync(path.dirname(evilSkill), { recursive: true })
        cpSync(MALICIOUS_FIXTURE, evilSkill, { recursive: true })
        writeFileSync(path.join(workspace, 'README.md'), '# test workspace')

        const daemon = await npm.npx(
          ['mobbdev', 'claude-code-daemon'],
          {
            ...CLI_LOCAL_ENV_OVERWRITE,
            MOBB_TRACY_SKILL_QUARANTINE_DEBOUNCE_MS: '0',
            MOBB_DAEMON_POLL_INTERVAL_MS: String(DAEMON_POLL_MS),
          },
          workspace
        )

        try {
          // Log in via the daemon's browser flow.
          await daemon.waitForString(/If the page does not open automatically/)
          const loginId = daemon
            .getOutput()
            .match(
              /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
            )[0]
          await mobbApi.cliLogin(loginId)
          // T-493 — opt the freshly-created test org into quarantine before
          // the daemon's first verdict poll runs. Default for new orgs is
          // off; without this the daemon sees `quarantineEnabled: false` and
          // skips on-disk action.
          await mobbApi.setQuarantineEnabled(true)
          await daemon.waitForString(/Login to Mobb success/)

          // Drop a synthetic Claude Code transcript so the daemon's poll loop
          // has something to process. `cwd` in the transcript points at the
          // workspace so skill scanning finds our fixture.
          const sessionId = randomUUID()
          const projDir = path.join(
            npm.homeDir,
            '.claude',
            'projects',
            workspace.replace(/\//g, '-')
          )
          mkdirSync(projDir, { recursive: true })
          const transcriptPath = path.join(projDir, `${sessionId}.jsonl`)
          writeFileSync(
            transcriptPath,
            transcriptLine(sessionId, workspace, 'quarantine e2e trigger')
          )

          // Keep the transcript growing every few seconds so the daemon
          // keeps re-running drainTranscript (and the quarantine check).
          // The server scan completes in 2–120s; without simulated activity
          // the one-shot check runs before the verdict lands.
          const stopActivity = simulateUserActivity(
            transcriptPath,
            sessionId,
            workspace,
            3_000
          )

          try {
            const quarantineRoot = path.join(
              npm.homeDir,
              '.tracy',
              'quarantine',
              'claude',
              'skills'
            )
            const quarantineZip = await waitForQuarantine(
              quarantineRoot,
              'evil',
              Date.now() + QUARANTINE_WAIT
            )
            assert.ok(
              quarantineZip,
              'skill should have been quarantined within budget'
            )

            // Stub at origPath carries the quarantine notice + MD5 that
            // matches the archive filename.
            const stub = readFileSync(path.join(evilSkill, 'SKILL.md'), 'utf8')
            const md5 = path.basename(quarantineZip, '.zip')
            assert.match(stub, /^# ⛔ QUARANTINED BY TRACY/)
            assert.match(stub, /mobb-internal/)
            assert.match(stub, new RegExp(md5))
            assert.deepStrictEqual(listStaging(quarantineRoot), [])

            // Recovery round-trip: simulate the user running the stub's
            // `rm -rf <origPath> && unzip <zip> -d <parent>` recipe. The
            // daemon's next drainTranscript ticks should then see the
            // recovered skill and not re-quarantine (presence check on
            // `<md5>.zip` short-circuits).
            rmSync(evilSkill, { recursive: true, force: true })
            new AdmZip(quarantineZip).extractAllTo(
              path.dirname(evilSkill),
              /* overwrite */ true
            )
            await sleep(DAEMON_POLL_MS * 5 + 1_000)
            assert.ok(existsSync(path.join(evilSkill, 'SKILL.md')))
            assert.ok(existsSync(quarantineZip))
            assert.deepStrictEqual(listStaging(quarantineRoot), [])
          } finally {
            stopActivity()
          }
        } finally {
          daemon.kill()
          await daemon.waitForExit()
        }
      }
    )
  }
)
