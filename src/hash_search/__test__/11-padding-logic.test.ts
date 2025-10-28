import { describe, expect, it } from 'vitest'

import { createIndex } from '../index'

describe('Padding logic', () => {
  it('should handle text length 31 (requires 29 padding bytes to reach 60)', async () => {
    const text = 'a'.repeat(31)
    const index = await createIndex(text)

    const paddedLength = 60 // 31 + 29 = 60
    const numChunks = paddedLength - 29 // 31 chunks
    expect(index.length).toBe(12 + numChunks * 24)
  })

  it('should handle text length 59 (requires 1 padding byte to reach 60)', async () => {
    const text = 'b'.repeat(59)
    const index = await createIndex(text)

    const paddedLength = 60 // 59 + 1 = 60
    const numChunks = paddedLength - 29 // 31 chunks
    expect(index.length).toBe(12 + numChunks * 24)
  })

  it('should handle text length 60 (requires 0 padding bytes)', async () => {
    const text = 'c'.repeat(60)
    const index = await createIndex(text)

    const paddedLength = 60 // 60 + 0 = 60
    const numChunks = paddedLength - 29 // 31 chunks
    expect(index.length).toBe(12 + numChunks * 24)
  })
})
