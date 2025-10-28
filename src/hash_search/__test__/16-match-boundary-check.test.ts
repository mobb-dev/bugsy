import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Match boundary check', () => {
  it('should not return matches that extend beyond original text length', async () => {
    const searchText = 'that is exactly 50 chars long!12345678901234567890'
    const text = `Some text here ${searchText}!!!`
    const index = await createIndex(text)

    const results = await searchIndex(searchText, index)

    // Verify all matches are within bounds
    expect(results).toHaveLength(1)
    results.forEach((position) => {
      expect(position + searchText.length).toBeLessThanOrEqual(text.length)
    })
  })

  it('should find matches at the end of text within original length', async () => {
    const text = 'a'.repeat(50)
    const index = await createIndex(text)

    const searchText = 'a'.repeat(30)
    const results = await searchIndex(searchText, index)

    // Should find matches, including ones near the end
    expect(results.length).toBeGreaterThan(0)

    // All matches should be valid
    results.forEach((position) => {
      expect(position + searchText.length).toBeLessThanOrEqual(text.length)
    })
  })
})
