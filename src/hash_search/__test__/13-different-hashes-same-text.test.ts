import { describe, expect, it } from 'vitest'

import { createIndex } from '../index'

describe('Different hashes for same text at different positions', () => {
  it('should use different salts for same text at different positions', async () => {
    const text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    const index = await createIndex(text)

    // Read salt at position 0 (bytes 12-19)
    const salt0 = index.subarray(12, 20)

    // Read salt at position 1 (bytes 36-43)
    const salt1 = index.subarray(36, 44)

    // Salts should be different due to randomness
    expect(Buffer.compare(salt0, salt1)).not.toBe(0)
  })

  it('should generate random salts for repeated patterns', async () => {
    const text = 'repeat'.repeat(10) // 60 characters
    const index = await createIndex(text)

    const salts = []
    // Collect first 5 salts
    for (let i = 0; i < 5; i++) {
      const saltOffset = 12 + i * 24
      const salt = index.subarray(saltOffset, saltOffset + 8)
      salts.push(salt)
    }

    // All salts should be unique
    for (let i = 0; i < salts.length; i++) {
      for (let j = i + 1; j < salts.length; j++) {
        expect(Buffer.compare(salts[i]!, salts[j]!)).not.toBe(0)
      }
    }
  })
})
