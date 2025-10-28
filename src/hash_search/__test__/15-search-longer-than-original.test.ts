import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Search text longer than original', () => {
  it('should return empty array when search text is longer than original', async () => {
    const text = 'This text is exactly 30 chars!'
    const index = await createIndex(text)

    const searchText =
      'This is a much longer search text that exceeds the original length'
    const results = await searchIndex(searchText, index)

    expect(results).toEqual([])
  })
})
