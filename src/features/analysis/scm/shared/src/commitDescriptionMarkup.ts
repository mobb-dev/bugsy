import { z } from 'zod'

import {
  IssueType_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../generates/client_generates'
import { fixDetailsData } from './fixDetailsData'
import {
  getIssueTypeFriendlyString,
  getTagTooltip,
  issueDescription,
} from './getIssueType'

function capitalizeFirstLetter(str: string) {
  return str?.length ? str[0]!.toUpperCase() + str.slice(1) : ''
}

function lowercaseFirstLetter(str: string) {
  if (!str) return str
  return `${str.charAt(0).toLowerCase()}${str.slice(1)}`
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
  irrelevantIssueWithTags,
}: {
  issueType: string
  vendor: Vulnerability_Report_Vendor_Enum
  severity: Vulnerability_Severity_Enum
  guidances: Guidances
  fixUrl?: string
  irrelevantIssueWithTags?: { tag: Vulnerability_Report_Issue_Tag_Enum }[]
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
    if (irrelevantIssueWithTags?.[0]?.tag) {
      description += `
> [!tip]
> This issue was found to be irrelevant to your project - ${lowercaseFirstLetter(getTagTooltip(irrelevantIssueWithTags[0].tag))}.
> Mobb recommends to ignore this issue, however fix is available if you think differently. \n

## Justification
${issueDescription[irrelevantIssueWithTags[0].tag]}
`
    }

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

export const getCommitIssueDescription = ({
  vendor,
  issueType,
  irrelevantIssueWithTags,
}: {
  issueType: string
  vendor: Vulnerability_Report_Vendor_Enum
  irrelevantIssueWithTags?: { tag: Vulnerability_Report_Issue_Tag_Enum }[]
}): string => {
  const issueTypeString = getIssueTypeFriendlyString(issueType)

  let description = `The following issues reported by ${capitalizeFirstLetter(vendor)} on this PR were found to be irrelevant to your project:\n`

  const parseIssueTypeRes = z.nativeEnum(IssueType_Enum).safeParse(issueType)
  if (issueType && parseIssueTypeRes.success) {
    if (irrelevantIssueWithTags?.[0]?.tag) {
      description += `
> [!tip]
> ${issueTypeString} - ${lowercaseFirstLetter(getTagTooltip(irrelevantIssueWithTags[0].tag))}.
> Mobb recommends to ignore this issue, however fix is available if you think differently. \n

## Justification
${issueDescription[irrelevantIssueWithTags[0].tag]}
`
    }

    const staticData = fixDetailsData[parseIssueTypeRes.data]
    if (staticData) {
      description += `## Issue description
${staticData.issueDescription}
`
    }
  }

  return description
}
