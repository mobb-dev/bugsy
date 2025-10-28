import { describe, expect, it } from 'vitest'

import { HashSearchError, searchIndex } from '../index'

describe('searchIndex - input validation', () => {
  const validIndex = Buffer.alloc(36) // 12 header + 24 for one chunk
  validIndex.writeUInt32BE(0x72830001, 0) // Magic number
  validIndex.writeUInt32BE(30, 4) // Original length
  validIndex.writeUInt32BE(30, 8) // Window size

  it('should throw HashSearchError for empty search string', async () => {
    await expect(searchIndex('', validIndex)).rejects.toThrow(HashSearchError)
  })

  it('should throw HashSearchError for search string < 30 characters', async () => {
    await expect(searchIndex('short', validIndex)).rejects.toThrow(
      HashSearchError
    )
    await expect(
      searchIndex('29 characters text here!!!', validIndex)
    ).rejects.toThrow(HashSearchError)
  })

  it('should succeed for search string with exactly 30 characters', async () => {
    const searchText = 'This text is exactly 30 chars!'
    expect(searchText.length).toBe(30)
    await expect(searchIndex(searchText, validIndex)).resolves.toBeDefined()
  })

  it('should throw HashSearchError for buffer < 12 bytes', async () => {
    const searchText = 'This text is exactly 30 chars!'
    await expect(searchIndex(searchText, Buffer.alloc(11))).rejects.toThrow(
      HashSearchError
    )
  })

  it('should throw HashSearchError when (length - 12) not multiple of 24', async () => {
    const searchText = 'This text is exactly 30 chars!'
    await expect(searchIndex(searchText, Buffer.alloc(14))).rejects.toThrow(
      HashSearchError
    )
    await expect(searchIndex(searchText, Buffer.alloc(35))).rejects.toThrow(
      HashSearchError
    )
  })
})
