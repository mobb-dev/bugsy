import { describe, expect, it } from 'vitest'

import { HashSearchError } from '../index'

describe('HashSearchError', () => {
  it('should be instance of Error', () => {
    const error = new HashSearchError('test message')
    expect(error).toBeInstanceOf(Error)
  })

  it('should preserve error message', () => {
    const message = 'test error message'
    const error = new HashSearchError(message)
    expect(error.message).toBe(message)
  })

  it('should have name "HashSearchError"', () => {
    const error = new HashSearchError('test')
    expect(error.name).toBe('HashSearchError')
  })
})
