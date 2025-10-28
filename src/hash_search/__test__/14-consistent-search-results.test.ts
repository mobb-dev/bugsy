import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Consistent search results', () => {
  it('should return same results when searching multiple times', async () => {
    const searchText = 'The quick brown fox jumps over'
    const text = `${searchText} the lazy dog. ${searchText} the fence.`
    const index = await createIndex(text)

    const results1 = await searchIndex(searchText, index)
    const results2 = await searchIndex(searchText, index)
    const results3 = await searchIndex(searchText, index)

    expect(results1).toEqual(results2)
    expect(results2).toEqual(results3)
  })
})
