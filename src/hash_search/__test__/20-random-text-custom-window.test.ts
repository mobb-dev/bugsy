import { describe, expect, it } from 'vitest'

import { createIndex, searchIndex } from '../index'

describe('Random text with custom window size', () => {
  it('should search 37-char substring in 256-char random text with 10-char window', async () => {
    // Generate 256 random characters from a-zA-Z_-0-9
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
    let randomText = ''

    for (let i = 0; i < 256; i++) {
      randomText += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Repeat it twice
    randomText += randomText

    // Verify text length
    expect(randomText.length).toBe(512)

    // Create index with 10-character window size
    const windowSize = 10
    const index = await createIndex(randomText, windowSize)

    // Verify window size is stored correctly
    const storedWindowSize = index.readUInt32BE(8)
    expect(storedWindowSize).toBe(10)

    const startPos = 29
    const searchLength = 37
    const searchText = randomText.slice(startPos, startPos + searchLength)
    expect(searchText.length).toBe(searchLength)

    // Search for the substring
    const results = await searchIndex(searchText, index)

    expect(results).toHaveLength(2)
    expect(results[0]).toBe(startPos)
    expect(results[1]).toBe(startPos + 256)

    // Verify all matches are valid
    results.forEach((position) => {
      const foundText = randomText.slice(position, position + searchLength)
      expect(foundText).toBe(searchText)
    })
  })

  it('should find full text and suffix with custom 41-char window in 373-char random text', async () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
    let randomText = ''

    for (let i = 0; i < 373; i++) {
      randomText += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const index = await createIndex(randomText, 41)

    const results0 = await searchIndex(randomText, index)
    expect(results0[0]).toBe(0)

    const results1 = await searchIndex(randomText.slice(100, -1), index)
    expect(results1[0]).toBe(100)
  })
})
