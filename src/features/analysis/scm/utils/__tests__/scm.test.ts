import { describe, expect, it } from 'vitest'

import { safeBody } from '../scm'

describe('safeBody', () => {
  const truncationNotice = '\n\n... Message was cut here because it is too long'

  it('should return the original body if it is shorter than the max length', () => {
    const body = 'Short message'
    const maxLength = 100
    expect(safeBody(body, maxLength)).toBe(body)
  })

  it('should return the original body if it is exactly the max length', () => {
    const body = 'a'.repeat(100)
    const maxLength = 100
    expect(safeBody(body, maxLength)).toBe(body)
  })

  it('should truncate the body and append the truncation notice if it exceeds the max length', () => {
    const body = 'a'.repeat(200)
    const maxLength = 100
    const expected =
      'a'.repeat(100 - truncationNotice.length) + truncationNotice

    expect(safeBody(body, maxLength)).toBe(expected)
  })

  it('should handle empty body', () => {
    const body = ''
    const maxLength = 50
    expect(safeBody(body, maxLength)).toBe('')
  })

  it('should handle empty body with very small max length', () => {
    const body = ''
    const maxLength = 5
    expect(safeBody(body, maxLength)).toBe('')
  })
})
