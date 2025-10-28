import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('No match found', () => {
  it('should return empty array when pattern does not exist', async () => {
    const text = 'This is the original text that will be indexed for searching'
    const index = await createIndex(text)

    const searchText = 'Pattern that does not exist!!!'
    const results = await searchIndex(searchText, index)

    expect(results).toEqual([])
  })
})
