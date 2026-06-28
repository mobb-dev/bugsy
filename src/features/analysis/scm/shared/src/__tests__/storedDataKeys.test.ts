import { describe, expect, it } from 'vitest'

import { IssueType_Enum } from '../../../generates/client_generates'
import { languages as fixDataLanguages } from '../storedFixData'
import { languages as questionDataLanguages } from '../storedQuestionData'

// After E-2015 re-keyed storedFixData/storedQuestionData from `IssueType_Enum.X`
// to string-literal DB values, the compiler no longer guards those keys. These
// tests restore that guard: every issue-type key must be a canonical value
// (the generated enum is still the source of truth until the DB enum is dropped
// in PR4). A typo'd or renamed key fails here instead of silently serving no
// guidance/question copy at runtime.
describe('stored data issue-type keys', () => {
  const validIssueTypeValues = new Set<string>(Object.values(IssueType_Enum))

  const collectIssueTypeKeys = (
    languagesMap: Record<string, Record<string, unknown>>
  ): string[] => {
    const keys = new Set<string>()
    for (const perLanguage of Object.values(languagesMap)) {
      for (const issueTypeKey of Object.keys(perLanguage)) {
        keys.add(issueTypeKey)
      }
    }
    return [...keys]
  }

  it('every storedFixData key is a canonical issue-type value', () => {
    const unknownKeys = collectIssueTypeKeys(fixDataLanguages).filter(
      (key) => !validIssueTypeValues.has(key)
    )
    expect(unknownKeys).toEqual([])
  })

  it('every storedQuestionData key is a canonical issue-type value', () => {
    const unknownKeys = collectIssueTypeKeys(questionDataLanguages).filter(
      (key) => !validIssueTypeValues.has(key)
    )
    expect(unknownKeys).toEqual([])
  })
})
