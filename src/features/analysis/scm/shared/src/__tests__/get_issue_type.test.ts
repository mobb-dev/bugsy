import { describe, expect, it } from 'vitest'

import { IssueType_Enum } from '../../../generates/client_generates'
import { getIssueTypeFriendlyString, issueTypeMap } from '../getIssueType'

describe('getIssueType', () => {
  it('should handle undefined/null input', () => {
    expect(getIssueTypeFriendlyString(undefined)).toBe('Other')
    expect(getIssueTypeFriendlyString(null)).toBe('Other')
  })

  it('should replace underscores with spaces for non-enum string inputs', () => {
    expect(getIssueTypeFriendlyString('Custom_Issue_Type')).toBe(
      'Custom Issue Type'
    )
  })

  it('should return the input as-is for non-enum string inputs without underscores', () => {
    // todo: should it? would it be better to have the same out as with underscores?
    expect(getIssueTypeFriendlyString('CustomIssueType')).toBe(
      'CustomIssueType'
    )
  })

  it('should cover all enum values in the issueTypeMap', () => {
    Object.values(IssueType_Enum).forEach((enumValue) => {
      expect(getIssueTypeFriendlyString(enumValue)).toBe(
        issueTypeMap[enumValue]
      )
    })
  })
})
