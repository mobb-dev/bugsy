import { describe, expect, it } from 'vitest'

import { calculateRanges } from '../utils'

describe('utils', () => {
  it('calculateRanges', () => {
    const inputArray = [1, 2, 3, 6, 8, 10, 11, 12, 15]
    expect(calculateRanges(inputArray)).toEqual([
      [1, 3],
      [6, 6],
      [8, 8],
      [10, 12],
      [15, 15],
    ])
  })
})
