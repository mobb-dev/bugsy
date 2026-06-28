import { describe, expect, it } from 'vitest'

import { getIssueTypeFriendlyString } from '../getIssueType'

describe('getIssueType', () => {
  it('should handle undefined/null input', () => {
    expect(getIssueTypeFriendlyString(undefined)).toBe('Other')
    expect(getIssueTypeFriendlyString(null)).toBe('Other')
  })

  it('should replace underscores with spaces for non-catalog string inputs', () => {
    expect(getIssueTypeFriendlyString('Custom_Issue_Type')).toBe(
      'Custom Issue Type'
    )
  })

  it('should return the input as-is for non-catalog string inputs without underscores', () => {
    expect(getIssueTypeFriendlyString('CustomIssueType')).toBe(
      'CustomIssueType'
    )
  })
})
