import { describe, expect, it } from 'vitest'

import { createIndex } from '../index'

describe('Buffer structure', () => {
  it('should have correct buffer size: 12 + (numChunks × 24) bytes', async () => {
    const text30 = 'This text is exactly 30 chars!'
    const index30 = await createIndex(text30)
    const numChunks30 = 30 - 29 // 1 chunk
    expect(index30.length).toBe(12 + numChunks30 * 24)

    const text60 =
      'This is exactly 60 characters long text for testing purpose!'
    const index60 = await createIndex(text60)
    const numChunks60 = 60 - 29 // 31 chunks
    expect(index60.length).toBe(12 + numChunks60 * 24)
  })

  it('should store original text length at bytes 4-7 (big-endian)', async () => {
    const text = 'This text is exactly 30 chars!'
    const index = await createIndex(text)

    const storedLength = index.readUInt32BE(4)
    expect(storedLength).toBe(30)
  })

  it('should correctly store and read back original text length', async () => {
    const text100 = 'a'.repeat(100)
    const index = await createIndex(text100)

    const storedLength = index.readUInt32BE(4)
    expect(storedLength).toBe(100)
  })
})
