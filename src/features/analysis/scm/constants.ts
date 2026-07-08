export const MOBB_ICON_IMG =
  'https://app.mobb.ai/gh-action/Logo_Rounded_Icon.svg'

export const MAX_BRANCHES_FETCH = 1000

// Per-repo cap on how many branches the 90-day contributor scan walks beyond the
// default/main branch. Only branches with a commit inside the 90-day window are
// considered (older ones are skipped for free), so this bites only when a single
// repo has more than this many branches active in the last 90 days — rare. When
// hit, it's logged (no silent truncation). Shared by GitHub, ADO, and Bitbucket.
export const MAX_ACTIVE_BRANCHES_SCAN = 250

export const REPORT_DEFAULT_FILE_NAME = 'report.json'
