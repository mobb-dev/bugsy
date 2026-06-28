import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  Vulnerability_Report_Vendor_Enum,
  Vulnerability_Severity_Enum,
} from '../../../generates/client_generates'
import { getCommitDescription } from '../commitDescriptionMarkup'
import {
  hydrateIssueTypeCatalog,
  resetIssueTypeCatalog,
} from '../issueTypeCatalog'

const CMDI = {
  value: 'CMDi',
  label: 'Command Injection',
  issueDescription: 'A command injection issue description',
  fixInstructions: 'Sanitize and validate all command inputs',
}

describe('getCommitDescription', () => {
  beforeEach(() => {
    hydrateIssueTypeCatalog([CMDI])
  })
  afterEach(() => {
    resetIssueTypeCatalog()
  })

  it('renders the catalog-served description/fix-instructions for a hydrated type', () => {
    const result = getCommitDescription({
      issueType: 'CMDi',
      vendor: Vulnerability_Report_Vendor_Enum.Snyk,
      severity: Vulnerability_Severity_Enum.High,
      guidances: [{ guidance: 'Test guidance', key: 'test' }],
      fixUrl: 'https://example.com/fix',
    })

    expect(result).toContain(
      'This change fixes a **high severity** (🚩) **Command Injection** issue reported by **Snyk**.'
    )
    expect(result).toContain(CMDI.issueDescription)
    expect(result).toContain(CMDI.fixInstructions)
    expect(result).toContain('## Additional actions required\n Test guidance')
    expect(result).toContain(
      '[More info and fix customization are available in the Mobb platform](https://example.com/fix)'
    )
  })

  it('falls back (derived label, no description block) for a type absent from the catalog', () => {
    const result = getCommitDescription({
      issueType: 'RandonIssueType',
      vendor: Vulnerability_Report_Vendor_Enum.Snyk,
      severity: Vulnerability_Severity_Enum.High,
      guidances: [{ guidance: 'Test guidance', key: 'test' }],
      fixUrl: 'https://example.com/fix',
    })

    expect(result).toContain(
      'This change fixes a **high severity** (🚩) **RandonIssueType** issue reported by **Snyk**.'
    )
    expect(result).not.toContain('## Issue description')
    expect(result).toContain('## Additional actions required\n Test guidance')
    expect(result).toContain(
      '[More info and fix customization are available in the Mobb platform](https://example.com/fix)'
    )
  })
})
