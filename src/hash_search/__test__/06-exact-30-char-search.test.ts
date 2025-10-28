import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Exact 30-character search', () => {
  it('should find exact 30-character text at position 0', async () => {
    const text = 'This text is exactly 30 chars!'
    const index = await createIndex(text)

    const results = await searchIndex(text, index)
    expect(results).toEqual([0])
  })
})
