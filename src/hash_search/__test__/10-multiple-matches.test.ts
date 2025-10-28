import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Multiple matches', () => {
  it('should return all positions where pattern is found', async () => {
    const pattern = 'The quick brown fox jumps over'
    const text = `${pattern} the lazy dog. ${pattern} the fence. ${pattern} everything.`
    const index = await createIndex(text)

    const searchText = pattern
    const results = await searchIndex(searchText, index)

    expect(results).toContain(0)
    expect(results).toContain(45)
    expect(results).toContain(87)
    expect(results.length).toBe(3)
  })

  it('should return positions in ascending order', async () => {
    const pattern = 'This is a repeating 30 char pa'
    const text = `Start ${pattern} middle ${pattern} end ${pattern} finish`
    const index = await createIndex(text)

    const searchText = pattern
    const results = await searchIndex(searchText, index)

    expect(results.length).toBeGreaterThan(0)
    for (let i = 1; i < results.length; i++) {
      expect(results[i]!).toBeGreaterThan(results[i - 1]!)
    }
  })
})
