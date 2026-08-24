import { describe, expect, it } from 'vitest'

import { computeUploadTimeoutMs } from '../../src/features/analysis/upload-file'

// Deliberately re-pinned here (not imported) so a constant change in prod
// requires a conscious edit of the expectations.
const MIN_UPLOAD_TIMEOUT_MS = 10_000
const MAX_UPLOAD_TIMEOUT_MS = 10 * 60_000
const PATH_UPLOAD_FLOOR_MS = 60_000
const SLOW_LINK_BYTES_PER_MS = 512

const MIB = 1024 * 1024

describe('computeUploadTimeoutMs', () => {
  it('gives small buffers the floor plus their size allowance', () => {
    expect(computeUploadTimeoutMs(MIB, 'buffer')).toBe(
      MIN_UPLOAD_TIMEOUT_MS + Math.ceil(MIB / SLOW_LINK_BYTES_PER_MS)
    )
  })

  it('never gives a path upload less than its pre-scaling flat 60s', () => {
    // A 1MB report used to get a flat 60s; scaling alone would give ~12s.
    expect(computeUploadTimeoutMs(MIB, 'path')).toBe(PATH_UPLOAD_FLOOR_MS)
  })

  it('scales past the old 60s cap for large uploads (multi-GB FPR/repo)', () => {
    const expected =
      MIN_UPLOAD_TIMEOUT_MS + Math.ceil((64 * MIB) / SLOW_LINK_BYTES_PER_MS)
    expect(expected).toBeGreaterThan(60_000)
    expect(computeUploadTimeoutMs(64 * MIB, 'path')).toBe(expected)
    expect(computeUploadTimeoutMs(64 * MIB, 'buffer')).toBe(expected)
  })

  it('never exceeds the ceiling for pathological sizes', () => {
    const pastCeiling =
      (MAX_UPLOAD_TIMEOUT_MS - MIN_UPLOAD_TIMEOUT_MS) * SLOW_LINK_BYTES_PER_MS +
      1024
    expect(computeUploadTimeoutMs(pastCeiling, 'path')).toBe(
      MAX_UPLOAD_TIMEOUT_MS
    )
    expect(computeUploadTimeoutMs(pastCeiling, 'buffer')).toBe(
      MAX_UPLOAD_TIMEOUT_MS
    )
  })
})
