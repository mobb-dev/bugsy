import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Search text padding', () => {
  it('should find pattern that extends to padded region', async () => {
    const text = 'Start of text. End pattern here at the very end'
    const index = await createIndex(text)

    const searchText = 'End pattern here at the very e'
    const results = await searchIndex(searchText, index)

    expect(results).toContain(15)
  })

  it('should handle search text that requires padding', async () => {
    // Test that padding works correctly by using 35-char search (not multiple of 30)
    const searchText = '12345678901234567890123456789012345' // 35 chars
    const text = searchText // Exact match at position 0
    const index = await createIndex(text)

    const results = await searchIndex(searchText, index)

    // Should find the match at position 0
    expect(results).toContain(0)
  })
})
