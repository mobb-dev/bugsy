import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Custom window size', () => {
  it('should create index with custom window size 10', async () => {
    const text = 'abcdefghij'.repeat(5) // 50 characters
    const windowSize = 10
    const index = await createIndex(text, windowSize)

    // Verify window size is stored at bytes 8-11
    const storedWindowSize = index.readUInt32BE(8)
    expect(storedWindowSize).toBe(10)
  })

  it('should create index with custom window size 15', async () => {
    const text = 'a'.repeat(45) // 45 characters
    const windowSize = 15
    const index = await createIndex(text, windowSize)

    // Verify window size is stored correctly
    const storedWindowSize = index.readUInt32BE(8)
    expect(storedWindowSize).toBe(15)
  })

  it('should search correctly with custom window size', async () => {
    const windowSize = 10
    const pattern = 'abcdefghij' // Exactly 10 characters
    const text = `xxxxx${pattern}yyyyy${pattern}zzzzz`
    const index = await createIndex(text, windowSize)

    const results = await searchIndex(pattern, index)

    // Should find pattern at positions 5 and 20
    expect(results).toContain(5)
    expect(results).toContain(20)
  })

  it('should work with window size 20', async () => {
    const windowSize = 20
    const text = 'a'.repeat(100)
    const index = await createIndex(text, windowSize)

    const searchText = 'a'.repeat(20)
    const results = await searchIndex(searchText, index)

    // Should find many matches
    expect(results.length).toBeGreaterThan(0)
    expect(results).toContain(0) // Should match at start
  })

  it('should use default window size 30 when not specified', async () => {
    const text = 'a'.repeat(60)
    const index = await createIndex(text) // No window size specified

    // Verify default window size 30 is stored
    const storedWindowSize = index.readUInt32BE(8)
    expect(storedWindowSize).toBe(30)
  })
})
