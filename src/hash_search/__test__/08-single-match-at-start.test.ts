import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Single match at start (position 0)', () => {
  it('should find pattern at the beginning of text', async () => {
    const text = 'The quick brown fox jumps over the lazy dog and runs away'
    const index = await createIndex(text)

    const searchText = 'The quick brown fox jumps over'
    const results = await searchIndex(searchText, index)

    expect(results).toEqual([0])
  })
})
