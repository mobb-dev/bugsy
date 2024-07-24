import { Scanner } from '@mobb/bugsy/constants'

import { MOBB_ICON_IMG } from '../scm'

export const contactUsMarkdown = `For specific requests [contact us](https://mobb.ai/contact) and we'll do the most to answer your need quickly.`
export const MobbIconMarkdown = `![image](${MOBB_ICON_IMG})`
export const noVulnerabilitiesFoundTitle = `# ${MobbIconMarkdown} No security issues were found ✅`

export const COMMIT_FIX_SVG = `https://app.mobb.ai/gh-action/commit-button.svg`

export const scannerToFriendlyString: Record<Scanner, string> = {
  checkmarx: 'Checkmarx',
  codeql: 'CodeQL',
  fortify: 'Fortify',
  snyk: 'Snyk',
} as const
