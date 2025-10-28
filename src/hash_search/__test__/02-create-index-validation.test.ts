import { describe, expect, it } from 'vitest'

import { createIndex, HashSearchError } from '../index'

describe('createIndex - input validation', () => {
  it('should throw HashSearchError for empty string', async () => {
    await expect(createIndex('')).rejects.toThrow(HashSearchError)
  })

  it('should throw HashSearchError for string with < 30 characters', async () => {
    await expect(createIndex('short text')).rejects.toThrow(HashSearchError)
    await expect(createIndex('29 characters text here!!!')).rejects.toThrow(
      HashSearchError
    )
  })

  it('should succeed for string with exactly 30 characters', async () => {
    const text = 'This text is exactly 30 chars!'
    expect(text.length).toBe(30)
    await expect(createIndex(text)).resolves.toBeDefined()
  })

  it('should throw error for null/undefined', async () => {
    // @ts-expect-error - Testing invalid input type
    await expect(createIndex(null)).rejects.toThrow()
    // @ts-expect-error - Testing invalid input type
    await expect(createIndex(undefined)).rejects.toThrow()
  })
})
