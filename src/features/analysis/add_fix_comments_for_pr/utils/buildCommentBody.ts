import {
  Scanner,
  scannerToVulnerability_Report_Vendor_Enum,
  WEB_APP_URL,
} from '@mobb/bugsy/constants'
import { Vulnerability_Report_Issue_Tag_Enum } from '@mobb/bugsy/features/analysis/scm/generates/client_generates'
import Debug from 'debug'
import { z } from 'zod'

import {
  getCommitDescription,
  getCommitIssueDescription,
  getCommitIssueUrl,
  getCommitUrl,
  getFixUrlWithRedirect,
  getGuidances,
  getIssueTypeFriendlyString,
  getIssueUrlWithRedirect,
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

export type BuildFixCommentBodyParams = {
  fix: PostFixCommentParams['fixesById'][string]
  commentId: number
  commentUrl: string
  scanner: Scanner
  fixId: string
  issueId: string
  projectId: string
  analysisId: string
  organizationId: string
  patch: string
  irrelevantIssueWithTags: { tag: Vulnerability_Report_Issue_Tag_Enum }[]
}

export type BuildIssueCommentBodyParams = {
  commentId: number
  commentUrl: string
  scanner: Scanner
  issueId: string
  projectId: string
  analysisId: string
  organizationId: string
  issueType: string
  irrelevantIssueWithTags: { tag: Vulnerability_Report_Issue_Tag_Enum }[]
  fpDescription: string | null
}

export function buildFixCommentBody({
  fix,
  issueId,
  commentId,
  commentUrl,
  scanner,
  fixId,
  projectId,
  analysisId,
  organizationId,
  patch,
  irrelevantIssueWithTags,
}: BuildFixCommentBodyParams) {
  const isIrrelevantIssueWithTags = irrelevantIssueWithTags?.[0]?.tag
  const commitUrl = isIrrelevantIssueWithTags
    ? getCommitIssueUrl({
        appBaseUrl: WEB_APP_URL,
        issueId,
        projectId,
        analysisId,
        organizationId,
        redirectUrl: commentUrl,
        commentId,
      })
    : getCommitUrl({
        appBaseUrl: WEB_APP_URL,
        fixId,
        projectId,
        analysisId,
        organizationId,
        redirectUrl: commentUrl,
        commentId,
      })
  const fixUrl = isIrrelevantIssueWithTags
    ? getIssueUrlWithRedirect({
        appBaseUrl: WEB_APP_URL,
        issueId,
        projectId,
        analysisId,
        organizationId,
        redirectUrl: commentUrl,
        commentId,
      })
    : getFixUrlWithRedirect({
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
      safeIssueLanguage: z.nativeEnum(IssueLanguage_Enum),
      severityText: z.nativeEnum(Vulnerability_Severity_Enum),
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
        severity: validFixParseRes.data.severityText,
        guidances: getGuidances({
          questions:
            validFixParseRes.data.patchAndQuestions.questions.map(toQuestion),
          issueType: validFixParseRes.data.safeIssueType,
          issueLanguage: validFixParseRes.data.safeIssueLanguage,
          fixExtraContext: validFixParseRes.data.patchAndQuestions.extraContext,
        }),
        irrelevantIssueWithTags,
      })
    : ''
  const diff = `\`\`\`diff\n${patch} \n\`\`\``
  const fixPageLink = `[Learn more and fine tune the fix](${fixUrl})`
  return `${title}\n${subTitle}\n${diff}\n${getCommitFixButton(
    commitUrl
  )}\n${fixPageLink}`
}

export function buildIssueCommentBody({
  issueId,
  commentId,
  commentUrl,
  scanner,
  issueType,
  projectId,
  analysisId,
  organizationId,
  irrelevantIssueWithTags,
  fpDescription,
}: BuildIssueCommentBodyParams) {
  const issueUrl = getIssueUrlWithRedirect({
    appBaseUrl: WEB_APP_URL,
    issueId,
    projectId,
    analysisId,
    organizationId,
    redirectUrl: commentUrl,
    commentId,
  })
  const title = `# ${MobbIconMarkdown} Irrelevant issues were spotted - no action required 🧹`

  const subTitle = getCommitIssueDescription({
    issueType,
    vendor: scannerToVulnerability_Report_Vendor_Enum[scanner],
    irrelevantIssueWithTags,
    fpDescription,
  })
  const issuePageLink = `[Learn more about this issue](${issueUrl})`
  return `${title}\n${subTitle}\n${issuePageLink}`
}
