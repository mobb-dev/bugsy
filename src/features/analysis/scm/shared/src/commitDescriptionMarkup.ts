import { z } from 'zod'

import {
  IssueType_Enum,
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../generates/client_generates'
import { fixDetailsData } from './fixDetailsData'
import { getIssueTypeFriendlyString } from './getIssueType'

function capitalizeFirstLetter(str: string) {
  return str?.length ? str[0]!.toUpperCase() + str.slice(1) : ''
}

const severityToEmoji = {
  [Vulnerability_Severity_Enum.Critical]: '🚨',
  [Vulnerability_Severity_Enum.High]: '🚩',
  [Vulnerability_Severity_Enum.Medium]: '🟡',
  [Vulnerability_Severity_Enum.Low]: '🟢',
} as const

type Guidances = {
  guidance: string | undefined
  key: string
}[]

export const getCommitDescription = ({
  vendor,
  issueType,
  severity,
  guidances,
  fixUrl,
}: {
  issueType: string
  vendor: Vulnerability_Report_Vendor_Enum
  severity: Vulnerability_Severity_Enum
  guidances: Guidances
  fixUrl?: string
}): string => {
  const issueTypeString = getIssueTypeFriendlyString(issueType)

  let description = `This change fixes a **${severity} severity** (${
    severityToEmoji[severity]
  }) **${issueTypeString}** issue reported by **${capitalizeFirstLetter(
    vendor
  )}**.

`

  const parseIssueTypeRes = z.nativeEnum(IssueType_Enum).safeParse(issueType)
  if (issueType && parseIssueTypeRes.success) {
    const staticData = fixDetailsData[parseIssueTypeRes.data]
    if (staticData) {
      description += `## Issue description
${staticData.issueDescription}
 
## Fix instructions
${staticData.fixInstructions}
`
    }
  }

  description += `
${guidances
  .map(({ guidance }) => `## Additional actions required\n ${guidance}\n`)
  .join('')}
`
  if (fixUrl) {
    description += `\n[More info and fix customization are available in the Mobb platform](${fixUrl})`
  }
  return description
}
