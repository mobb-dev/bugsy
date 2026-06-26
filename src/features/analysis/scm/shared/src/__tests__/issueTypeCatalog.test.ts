import { beforeEach, describe, expect, it } from 'vitest'

import { getIssueTypeFriendlyString } from '../getIssueType'
import {
  getIssueTypeCatalogEntry,
  hydrateIssueTypeCatalog,
  isIssueTypeCatalogHydrated,
  resetIssueTypeCatalog,
} from '../issueTypeCatalog'

const ENTRIES = [
  {
    value: 'SQL_Injection',
    label: 'SQL Injection',
    issueDescription: 'desc',
    fixInstructions: 'fix',
  },
  { value: 'NO_LIMITS_OR_THROTTLING', label: 'Missing Rate Limiting' },
]

describe('issueTypeCatalog', () => {
  // The catalog is a module-level singleton; reset before each test so cases
  // are order-independent and the unhydrated path is exercised cleanly.
  beforeEach(() => {
    resetIssueTypeCatalog()
  })

  it('is unhydrated by default and helpers fall back', () => {
    expect(isIssueTypeCatalogHydrated()).toBe(false)
    expect(getIssueTypeCatalogEntry('SQL_Injection')).toBeUndefined()
    // Friendly-string falls back to the curated map / derived label.
    expect(getIssueTypeFriendlyString('SQL_Injection')).toBeTruthy()
  })

  it('serves entries after hydration', () => {
    hydrateIssueTypeCatalog(ENTRIES)
    expect(isIssueTypeCatalogHydrated()).toBe(true)
    expect(getIssueTypeCatalogEntry('SQL_Injection')?.label).toBe(
      'SQL Injection'
    )
    // optional fields are absent (not present) for label-only entries
    expect(
      getIssueTypeCatalogEntry('NO_LIMITS_OR_THROTTLING')?.issueDescription
    ).toBeUndefined()
    expect(getIssueTypeCatalogEntry('UNKNOWN')).toBeUndefined()
  })

  it('getIssueTypeFriendlyString prefers the hydrated catalog over map/derived', () => {
    // Distinct label proves the catalog wins over the curated issueTypeMap.
    hydrateIssueTypeCatalog([{ value: 'PT', label: 'Catalog Path Traversal' }])
    expect(getIssueTypeFriendlyString('PT')).toBe('Catalog Path Traversal')
  })
})
