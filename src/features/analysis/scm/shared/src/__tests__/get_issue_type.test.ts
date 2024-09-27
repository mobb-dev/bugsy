import { describe, expect, it } from 'vitest'

import { IssueType_Enum } from '../../../generates/client_generates'
import { getIssueType, issueTypeMap } from '../getIssueType'

describe('getIssueType', () => {
  it('should handle undefined/null input', () => {
    expect(getIssueType(undefined)).toBe('Other')
    expect(getIssueType(null)).toBe('Other')
  })

  it('should replace underscores with spaces for non-enum string inputs', () => {
    expect(getIssueType('Custom_Issue_Type')).toBe('Custom Issue Type')
  })

  it('should return the input as-is for non-enum string inputs without underscores', () => {
    // todo: should it? would it be better to have the same out as with underscores?
    expect(getIssueType('CustomIssueType')).toBe('CustomIssueType')
  })

  it('should cover all enum values in the issueTypeMap', () => {
    Object.values(IssueType_Enum).forEach((enumValue) => {
      expect(getIssueType(enumValue)).toBe(issueTypeMap[enumValue])
    })
  })
})
