import { describe, expect, it } from 'vitest'

import { SafeIssueTypeStringZ } from '../getIssueType'
import { languages as fixDataLanguages } from '../storedFixData'
import { languages as questionDataLanguages } from '../storedQuestionData'

// E-2015 removed the closed `IssueType_Enum` allowlist: issue types are now
// opaque, analyzer-served strings, so there is no committed TS list to validate
// these keys against at build time. Semantic validity ("is this a real issue
// type?") is enforced at runtime by the hydrated catalog (a key with no catalog
// entry simply serves no stored copy — handled by the lookup returning
// undefined). What this suite still guards is well-formedness: every key must
// satisfy the same `SafeIssueTypeStringZ` bound production applies to issue-type
// strings, so a stray empty/whitespace/metacharacter key (a copy-paste slip in a
// per-language `index.ts`) fails here instead of producing a key that can never
// match a canonical catalog value.
describe('stored data issue-type keys', () => {
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

  const malformed = (keys: string[]): string[] =>
    keys.filter((key) => !SafeIssueTypeStringZ.safeParse(key).success)

  it('every storedFixData key is a well-formed issue-type value', () => {
    expect(malformed(collectIssueTypeKeys(fixDataLanguages))).toEqual([])
  })

  it('every storedQuestionData key is a well-formed issue-type value', () => {
    expect(malformed(collectIssueTypeKeys(questionDataLanguages))).toEqual([])
  })
})
