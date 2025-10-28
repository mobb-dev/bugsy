import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Longer search with multiple chunks', () => {
  it('should find 60-character pattern using consecutive hash comparisons', async () => {
    const pattern =
      'This is a 60-character pattern that spans multiple chunks!!!'
    const text = `Start of text. ${pattern} End of text.`
    const index = await createIndex(text)

    const results = await searchIndex(pattern, index)

    expect(results).toContain(15)
  })

  it('should handle search text longer than 30 characters', async () => {
    const searchText = '0123456789'.repeat(6) // 60 chars - unique pattern
    const text = `prefix ${searchText} middle ${searchText} suffix`
    const index = await createIndex(text)

    const results = await searchIndex(searchText, index)

    expect(results.length).toBeGreaterThan(0)
    expect(results).toContain(7)
  })
})
