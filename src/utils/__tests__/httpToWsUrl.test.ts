import { describe, expect, it } from 'vitest'

import { httpToWsUrl } from '../url'

describe('httpToWsUrl', () => {
  it('converts https:// to wss://', () => {
    expect(httpToWsUrl('https://api.example.com/v1/graphql')).toBe(
      'wss://api.example.com/v1/graphql'
    )
  })

  it('converts http:// to ws://', () => {
    expect(httpToWsUrl('http://localhost:8080/v1/graphql')).toBe(
      'ws://localhost:8080/v1/graphql'
    )
  })

  it('does not mangle hostnames containing "http"', () => {
    expect(httpToWsUrl('https://httpbin.example.com/v1/graphql')).toBe(
      'wss://httpbin.example.com/v1/graphql'
    )
  })

  it('preserves query parameters', () => {
    expect(httpToWsUrl('https://api.example.com/v1/graphql?token=abc')).toBe(
      'wss://api.example.com/v1/graphql?token=abc'
    )
  })

  it('preserves port numbers', () => {
    expect(httpToWsUrl('https://api.example.com:9443/v1/graphql')).toBe(
      'wss://api.example.com:9443/v1/graphql'
    )
  })

  it('throws on invalid URLs', () => {
    expect(() => httpToWsUrl('not a url')).toThrow()
  })
})
