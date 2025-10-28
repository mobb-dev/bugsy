import { Buffer } from 'node:buffer'
import { randomBytes } from 'node:crypto'

import { blake3 } from 'hash-wasm'

import { HashSearchError } from './errors'

export { HashSearchError }

const MIN_WINDOW_SIZE = 8
const DEFAULT_WINDOW_SIZE = 30

export async function createIndex(
  originalText: string,
  windowSize: number = DEFAULT_WINDOW_SIZE
): Promise<Buffer> {
  // Validate originalText
  if (!originalText || typeof originalText !== 'string') {
    throw new HashSearchError('Original text must be a non-empty string')
  }

  // Validate window size
  if (windowSize < MIN_WINDOW_SIZE) {
    throw new HashSearchError(`Window size must be at least ${MIN_WINDOW_SIZE}`)
  }

  // Validate text length
  if (originalText.length < windowSize) {
    throw new HashSearchError(
      `Text length must be at least ${windowSize} characters (window size)`
    )
  }

  const originalLength = originalText.length

  // Calculate padding needed to make length a multiple of windowSize
  const paddingNeeded =
    (windowSize - (originalLength % windowSize)) % windowSize
  const paddedText = originalText + '\0'.repeat(paddingNeeded)

  // Calculate number of chunks
  const numChunks = paddedText.length - windowSize + 1

  // Allocate buffer: 12 bytes header + (numChunks × 24 bytes)
  const bufferSize = 12 + numChunks * 24
  const buffer = Buffer.alloc(bufferSize)

  // Write magic number (bytes 0-3)
  buffer.writeUInt8(0x72, 0)
  buffer.writeUInt8(0x83, 1)
  buffer.writeUInt8(0x00, 2)
  buffer.writeUInt8(0x01, 3)

  // Write original text length (bytes 4-7, big-endian)
  buffer.writeUInt32BE(originalLength, 4)

  // Write window size (bytes 8-11, big-endian)
  buffer.writeUInt32BE(windowSize, 8)

  // Generate salt-hash pairs for each chunk
  for (let i = 0; i < numChunks; i++) {
    // Extract chunk
    const chunk = paddedText.slice(i, i + windowSize)

    // Generate random 8-byte salt
    const salt = randomBytes(8)

    // Compute BLAKE3(salt || chunk)
    const dataToHash = Buffer.concat([salt, Buffer.from(chunk, 'utf-8')])
    const hashHex = await blake3(dataToHash, 128) // 128 bits = 16 bytes
    const hash = Buffer.from(hashHex, 'hex')

    // Write salt-hash pair to buffer
    const offset = 12 + i * 24
    salt.copy(buffer, offset) // Write 8-byte salt
    hash.copy(buffer, offset + 8) // Write 16-byte hash
  }

  return buffer
}

export async function searchIndex(
  searchText: string,
  index: Buffer
): Promise<number[]> {
  // Validate searchText
  if (!searchText || typeof searchText !== 'string') {
    throw new HashSearchError('Search text must be a non-empty string')
  }

  // Validate index buffer
  if (!Buffer.isBuffer(index)) {
    throw new HashSearchError('Index must be a Buffer')
  }

  // Validate minimum buffer size (12-byte header)
  if (index.length < 12) {
    throw new HashSearchError('Invalid index buffer: too small')
  }

  // Validate buffer structure: (length - 12) must be multiple of 24
  if ((index.length - 12) % 24 !== 0) {
    throw new HashSearchError('Invalid index buffer: incorrect structure')
  }

  // Verify magic number (bytes 0-3)
  if (
    index.readUInt8(0) !== 0x72 ||
    index.readUInt8(1) !== 0x83 ||
    index.readUInt8(2) !== 0x00 ||
    index.readUInt8(3) !== 0x01
  ) {
    throw new HashSearchError('Invalid magic number in index buffer')
  }

  // Read window size from index
  const windowSize = index.readUInt32BE(8)

  // Validate search text length
  if (searchText.length < windowSize) {
    throw new HashSearchError(
      `Search text must be at least ${windowSize} characters (window size)`
    )
  }

  // Read original text length from index
  const originalTextLength = index.readUInt32BE(4)

  // Calculate padding needed for search text
  const searchLength = searchText.length
  const paddingNeeded = (windowSize - (searchLength % windowSize)) % windowSize
  const paddedSearch = searchText + '\0'.repeat(paddingNeeded)

  // Calculate number of index positions and search chunks
  const numPositions = (index.length - 12) / 24
  const searchChunks = searchLength - windowSize + 1

  const results: number[] = []

  // Search for pattern at each possible starting position
  for (let startPos = 0; startPos <= numPositions - searchChunks; startPos++) {
    let match = true

    // Check if all consecutive chunks match
    for (let j = 0; j < searchChunks; j++) {
      const searchChunk = paddedSearch.slice(j, j + windowSize)

      // Read salt from index
      const saltOffset = 12 + (startPos + j) * 24
      const salt = index.subarray(saltOffset, saltOffset + 8)

      // Compute expected hash
      const dataToHash = Buffer.concat([
        salt,
        Buffer.from(searchChunk, 'utf-8'),
      ])
      const expectedHashHex = await blake3(dataToHash, 128)
      const expectedHash = Buffer.from(expectedHashHex, 'hex')

      // Read actual hash from index
      const hashOffset = saltOffset + 8
      const actualHash = index.subarray(hashOffset, hashOffset + 16)

      // Compare hashes
      if (!expectedHash.equals(actualHash)) {
        match = false
        break // Early termination
      }
    }

    // If all hashes match, verify position is within original text length
    if (match && startPos + searchLength <= originalTextLength) {
      results.push(startPos)
    }
  }

  return results
}
