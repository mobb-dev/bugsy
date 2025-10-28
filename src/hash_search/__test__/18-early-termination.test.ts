import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Early termination optimization', () => {
  it('should quickly return when pattern does not exist', async () => {
    const text = '0123456789'.repeat(100) // Large text (1000 chars)
    const index = await createIndex(text)

    const searchText = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzz!' // Pattern that definitely won't match

    const startTime = Date.now()
    const results = await searchIndex(searchText, index)
    const endTime = Date.now()

    expect(results).toEqual([])

    // This is a behavior test - function should complete quickly
    // Early termination means it should not take long even for large text
    const duration = endTime - startTime
    expect(duration).toBeLessThan(1000) // Should complete in less than 1 second
  })

  it('should handle large texts efficiently with no matches', async () => {
    const text = '0123456789abcdef'.repeat(312) // ~5000 chars
    const index = await createIndex(text)

    const searchText = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'

    const results = await searchIndex(searchText, index)
    expect(results).toEqual([])
  })
})
