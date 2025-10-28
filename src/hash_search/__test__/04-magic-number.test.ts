import { describe, expect, it } from 'vitest'

import { createIndex, HashSearchError, searchIndex } from '../index'

describe('Magic number functionality', () => {
  it('should write correct magic number (0x72, 0x83, 0x00, 0x01) at bytes 0-3', async () => {
    const text = 'This text is exactly 30 chars!'
    const index = await createIndex(text)

    expect(index[0]).toBe(0x72)
    expect(index[1]).toBe(0x83)
    expect(index[2]).toBe(0x00)
    expect(index[3]).toBe(0x01)
  })

  it('should throw error when magic number is invalid', async () => {
    const searchText = 'This text is exactly 30 chars!'
    const invalidIndex = Buffer.alloc(32)
    invalidIndex.writeUInt32BE(0xffffffff, 0) // Invalid magic number

    await expect(searchIndex(searchText, invalidIndex)).rejects.toThrow(
      HashSearchError
    )
  })

  it('should succeed when magic number is correct', async () => {
    const text = 'This text is exactly 30 chars!'
    const index = await createIndex(text)

    await expect(searchIndex(text, index)).resolves.toBeDefined()
  })
})
