import { describe, expect, it } from 'vitest'

import {
  IssueType_Enum,
  Vulnerability_Severity_Enum,
} from '../../../scm/generates/client_generates'
import {
  buildFixCommentBody,
  BuildFixCommentBodyParams,
} from '../buildCommentBody'

const params: BuildFixCommentBodyParams = {
  fix: {
    id: 'fix123',
    safeIssueType: IssueType_Enum.Xss,
    safeIssueLanguage: 'JavaScript',
    severityText: Vulnerability_Severity_Enum.High,
    patchAndQuestions: {
      __typename: 'FixData',
      patch: 'test patch',
      patchOriginalEncodingBase64: Buffer.from('test patch').toString('base64'),
      questions: [],
      extraContext: {
        __typename: 'FixExtraContextResponse',
        fixDescription: 'test description',
        extraContext: [],
        manifestActionsRequired: [],
      },
    },
  },
  issueId: '123',
  commentId: 123,
  commentUrl: 'https://example.com/comment',
  scanner: 'checkmarx',
  fixId: 'fix123',
  projectId: 'project123',
  analysisId: 'analysis123',
  organizationId: 'org123',
  patch: '+ Added line\n- Removed line',
  irrelevantIssueWithTags: [],
}

describe('buildCommentBody', () => {
  it('should build a comment body with all required elements', () => {
    const result = buildFixCommentBody(params)
    expect(result).toMatchInlineSnapshot(`
      "# ![image](https://app.mobb.ai/gh-action/Logo_Rounded_Icon.svg) XSS fix is ready
      This change fixes a **high severity** (🚩) **XSS** issue reported by **Checkmarx**.

      ## Issue description
      Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users. This can lead to theft of session cookies, redirection to malicious websites, or defacement of the webpage.
       
      ## Fix instructions
      Implement input validation and output encoding. This includes sanitizing user input and escaping special characters to prevent execution of injected scripts.



      \`\`\`diff
      + Added line
      - Removed line 
      \`\`\`
      <a href="http://localhost:5173/organization/org123/project/project123/report/analysis123/fix/fix123/commit?redirect_url=https%3A%2F%2Fexample.com%2Fcomment&comment_id=123"><img src=https://app.mobb.ai/gh-action/commit-button.svg></a>
      [Learn more and fine tune the fix](http://localhost:5173/organization/org123/project/project123/report/analysis123/fix/fix123?commit_redirect_url=https%3A%2F%2Fexample.com%2Fcomment&comment_id=123)"
    `)
  })

  it('should handle custom issue type or language', () => {
    const result = buildFixCommentBody({
      ...params,
      fix: {
        ...params.fix,
        safeIssueType: 'CustomIssueType',
        safeIssueLanguage: 'CustomLanguage',
      },
    })

    // Check if the result contains all required elements except for the subtitle
    expect(result).toMatchInlineSnapshot(`
      "# ![image](https://app.mobb.ai/gh-action/Logo_Rounded_Icon.svg) CustomIssueType fix is ready

      \`\`\`diff
      + Added line
      - Removed line 
      \`\`\`
      <a href="http://localhost:5173/organization/org123/project/project123/report/analysis123/fix/fix123/commit?redirect_url=https%3A%2F%2Fexample.com%2Fcomment&comment_id=123"><img src=https://app.mobb.ai/gh-action/commit-button.svg></a>
      [Learn more and fine tune the fix](http://localhost:5173/organization/org123/project/project123/report/analysis123/fix/fix123?commit_redirect_url=https%3A%2F%2Fexample.com%2Fcomment&comment_id=123)"
    `)
  })
})
