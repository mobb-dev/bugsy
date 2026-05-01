import type { Logger } from '../../../utils/shared-logger/create-logger'
import { GQLClient } from '../graphql/gql'

/**
 * T-467 — thin wrapper around `SkillVerdictsByMd5`.
 * T-493 — also surfaces the per-user `quarantineEnabled` flag so the
 *        caller can short-circuit on-disk enforcement when no org the
 *        user belongs to has opted in.
 *
 * Returns a map keyed by md5. md5s omitted from the response are treated
 * as "unknown verdict" → the caller skips them (fail-open). On any error
 * (network, GraphQL, auth), returns an empty map + `quarantineEnabled:
 * false` + error metric; the caller still treats the run as fail-open
 * for verdicts and fail-closed for quarantine actions.
 */

export type SkillVerdict = {
  md5: string
  verdict: string
  summary: string | null
  scannerName: string
  scannerVersion: string
  scannedAt: string
}

export type QueryVerdictsResult = {
  verdicts: Map<string, SkillVerdict>
  quarantineEnabled: boolean
}

export async function queryVerdicts(
  gqlClient: GQLClient,
  md5s: string[],
  log: Logger
): Promise<QueryVerdictsResult> {
  if (md5s.length === 0) {
    return { verdicts: new Map(), quarantineEnabled: false }
  }
  try {
    const res = await gqlClient.skillVerdictsByMd5(md5s)
    const envelope = res.skillVerdictsByMd5
    const out = new Map<string, SkillVerdict>()
    for (const row of envelope.verdicts) {
      out.set(row.md5, {
        md5: row.md5,
        verdict: row.verdict,
        summary: row.summary ?? null,
        scannerName: row.scannerName,
        scannerVersion: row.scannerVersion,
        scannedAt: row.scannedAt,
      })
    }
    return { verdicts: out, quarantineEnabled: envelope.quarantineEnabled }
  } catch (err) {
    log.warn(
      { err, md5_count: md5s.length, metric: 'skill_quarantine.query_error' },
      'skill_quarantine: verdict query failed, failing open'
    )
    return { verdicts: new Map(), quarantineEnabled: false }
  }
}
