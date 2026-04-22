import type { Logger } from '../../../utils/shared-logger/create-logger'
import { GQLClient } from '../graphql/gql'

/**
 * T-467 — thin wrapper around `SkillVerdictsByMd5`.
 *
 * Returns a map keyed by md5. md5s omitted from the response are treated
 * as "unknown verdict" → the caller skips them (fail-open). On any error
 * (network, GraphQL, auth), returns an empty map + error metric; the
 * caller still treats the run as fail-open.
 */

export type SkillVerdict = {
  md5: string
  verdict: string
  summary: string | null
  scannerName: string
  scannerVersion: string
  scannedAt: string
}

export async function queryVerdicts(
  gqlClient: GQLClient,
  md5s: string[],
  log: Logger
): Promise<Map<string, SkillVerdict>> {
  if (md5s.length === 0) {
    return new Map()
  }
  try {
    const res = await gqlClient.skillVerdictsByMd5(md5s)
    const out = new Map<string, SkillVerdict>()
    for (const row of res.skillVerdictsByMd5) {
      out.set(row.md5, {
        md5: row.md5,
        verdict: row.verdict,
        summary: row.summary ?? null,
        scannerName: row.scannerName,
        scannerVersion: row.scannerVersion,
        scannedAt: row.scannedAt,
      })
    }
    return out
  } catch (err) {
    log.warn(
      { err, md5_count: md5s.length, metric: 'skill_quarantine.query_error' },
      'skill_quarantine: verdict query failed, failing open'
    )
    return new Map()
  }
}
