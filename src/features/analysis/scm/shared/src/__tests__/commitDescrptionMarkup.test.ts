import { describe, expect, it } from 'vitest'

import {
  IssueType_Enum,
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../../generates/client_generates'
import { getCommitDescription } from '../commitDescriptionMarkup'
import { fixDetailsData } from '../fixDetailsData'

describe('getCommitDescription', () => {
  it('should generate correct description for valid input', () => {
    const result = getCommitDescription({
      issueType: IssueType_Enum.CmDi,
      vendor: Vulnerability_Report_Vendor_Enum.Snyk,
      severity: Vulnerability_Severity_Enum.High,
      guidances: [{ guidance: 'Test guidance', key: 'test' }],
      fixUrl: 'https://example.com/fix',
    })

    expect(result).toContain(
      'This change fixes a **high severity** (🚩) **Command Injection** issue reported by **Snyk**.'
    )
    expect(result).toContain(
      fixDetailsData[IssueType_Enum.CmDi]?.issueDescription
    )
    expect(result).toContain(
      fixDetailsData[IssueType_Enum.CmDi]?.fixInstructions
    )
    expect(result).toContain('## Additional actions required\n Test guidance')
    expect(result).toContain(
      '[More info and fix customization are available in the Mobb platform](https://example.com/fix)'
    )
  })
  it('should generate correct description for valid input with string issue type', () => {
    const result = getCommitDescription({
      issueType: 'RandonIssueType',
      vendor: Vulnerability_Report_Vendor_Enum.Snyk,
      severity: Vulnerability_Severity_Enum.High,
      guidances: [{ guidance: 'Test guidance', key: 'test' }],
      fixUrl: 'https://example.com/fix',
    })
    console.log(result)

    expect(result).toContain(
      'This change fixes a **high severity** (🚩) **RandonIssueType** issue reported by **Snyk**.'
    )
    expect(result).toContain('## Additional actions required\n Test guidance')
    expect(result).toContain(
      '[More info and fix customization are available in the Mobb platform](https://example.com/fix)'
    )
  })
})
