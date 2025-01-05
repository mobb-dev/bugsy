import {
  Scanner,
  scannerToVulnerability_Report_Vendor_Enum,
  WEB_APP_URL,
} from '@mobb/bugsy/constants'
import Debug from 'debug'
import { z } from 'zod'

import {
  getCommitDescription,
  getCommitUrl,
  getFixUrlWithRedirect,
  getGuidances,
  getIssueTypeFriendlyString,
  ParsedSeverityZ,
  PatchAndQuestionsZ,
  toQuestion,
} from '../../scm'
import {
  IssueLanguage_Enum,
  IssueType_Enum,
  Vulnerability_Severity_Enum,
} from '../../scm/generates/client_generates'
import { COMMIT_FIX_SVG, MobbIconMarkdown } from '../constants'
import { PostFixCommentParams } from '../types'

const debug = Debug('mobbdev:handle-finished-analysis')

const getCommitFixButton = (commitUrl: string) =>
  `<a href="${commitUrl}"><img src=${COMMIT_FIX_SVG}></a>`

export type BuildCommentBodyParams = {
  fix: PostFixCommentParams['fixesById'][string]
  commentId: number
  commentUrl: string
  scanner: Scanner
  fixId: string
  projectId: string
  analysisId: string
  organizationId: string
  patch: string
}

export function buildCommentBody({
  fix,
  commentId,
  commentUrl,
  scanner,
  fixId,
  projectId,
  analysisId,
  organizationId,
  patch,
}: BuildCommentBodyParams) {
  const commitUrl = getCommitUrl({
    appBaseUrl: WEB_APP_URL,
    fixId,
    projectId,
    analysisId,
    organizationId,
    redirectUrl: commentUrl,
    commentId,
  })
  const fixUrl = getFixUrlWithRedirect({
    appBaseUrl: WEB_APP_URL,
    fixId,
    projectId,
    analysisId,
    organizationId,
    redirectUrl: commentUrl,
    commentId,
  })
  const issueType = getIssueTypeFriendlyString(fix.safeIssueType)
  const title = `# ${MobbIconMarkdown} ${issueType} fix is ready`

  const validFixParseRes = z
    .object({
      patchAndQuestions: PatchAndQuestionsZ,
      vulnerabilityReportIssues: z
        .array(
          z.object({
            parsedSeverity: ParsedSeverityZ,
          })
        )
        .min(1),
      safeIssueLanguage: z.nativeEnum(IssueLanguage_Enum),
      safeIssueType: z.nativeEnum(IssueType_Enum),
    })
    .safeParse(fix)
  if (!validFixParseRes.success) {
    debug(
      `fix ${fixId} has custom issue type or language, therefore the commit description will not be added`,
      validFixParseRes.error
    )
  }

  const subTitle = validFixParseRes.success
    ? getCommitDescription({
        issueType: validFixParseRes.data.safeIssueType,
        vendor: scannerToVulnerability_Report_Vendor_Enum[scanner],
        severity: validFixParseRes.data.vulnerabilityReportIssues[0]
          ?.parsedSeverity as Vulnerability_Severity_Enum,
        guidances: getGuidances({
          questions:
            validFixParseRes.data.patchAndQuestions.questions.map(toQuestion),
          issueType: validFixParseRes.data.safeIssueType,
          issueLanguage: validFixParseRes.data.safeIssueLanguage,
          fixExtraContext: validFixParseRes.data.patchAndQuestions.extraContext,
        }),
      })
    : ''
  const diff = `\`\`\`diff\n${patch} \n\`\`\``
  const fixPageLink = `[Learn more and fine tune the fix](${fixUrl})`
  return `${title}\n${subTitle}\n${diff}\n${getCommitFixButton(
    commitUrl
  )}\n${fixPageLink}`
}
