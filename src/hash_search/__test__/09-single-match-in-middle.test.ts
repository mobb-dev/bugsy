import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Single match in middle of text', () => {
  it('should find pattern in the middle of text', async () => {
    const text =
      'Some prefix text here. The pattern is in the middle of this text.'
    const index = await createIndex(text)

    const searchText = 'The pattern is in the middle o'
    const results = await searchIndex(searchText, index)

    expect(results).toEqual([23])
  })
})
