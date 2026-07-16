import type Configstore from 'configstore'
import { describe, expect, it } from 'vitest'

import { ConfigstoreUploadLedger } from '../../src/features/analysis/context_upload_ledger'

/** Minimal in-memory stand-in for Configstore (get/set only). */
function memStore(): Configstore {
  const data = new Map<string, unknown>()
  return {
    get: (key: string) => data.get(key),
    set: (key: string, value: unknown) => data.set(key, value),
  } as unknown as Configstore
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

describe('ConfigstoreUploadLedger — dedup', () => {
  it('reports a blob as uploaded only after onSuccess, until the TTL expires', () => {
    const store = memStore()
    const ledger = new ConfigstoreUploadLedger(store)
    const t0 = 1_000_000

    expect(ledger.isUploaded('md5-a', t0)).toBe(false)
    ledger.onSuccess('md5-a', t0)
    expect(ledger.isUploaded('md5-a', t0)).toBe(true)
    // Still fresh a week later, expired past the 14-day TTL.
    expect(ledger.isUploaded('md5-a', t0 + 7 * DAY)).toBe(true)
    expect(ledger.isUploaded('md5-a', t0 + 15 * DAY)).toBe(false)
  })

  it('survives a simulated daemon restart via the persisted store', () => {
    const store = memStore()
    const t0 = 2_000_000

    const first = new ConfigstoreUploadLedger(store)
    first.onSuccess('md5-b', t0)
    first.flush()

    // New instance = new daemon process reading the same on-disk ledger.
    const second = new ConfigstoreUploadLedger(store)
    expect(second.isUploaded('md5-b', t0 + HOUR)).toBe(true)
  })
})

describe('ConfigstoreUploadLedger — backoff + log-once', () => {
  it('backs off a failing md5 and grows the window exponentially', () => {
    const ledger = new ConfigstoreUploadLedger(memStore())
    const t0 = 3_000_000

    ledger.onFailure('md5-c', t0)
    // Within the 1-min base window it must not be re-attempted.
    expect(ledger.isBackedOff('md5-c', t0 + 30_000)).toBe(true)
    // After the base window it's eligible again.
    expect(ledger.isBackedOff('md5-c', t0 + 61_000)).toBe(false)

    // Second consecutive failure doubles the window to ~2 min.
    ledger.onFailure('md5-c', t0 + 61_000)
    expect(ledger.isBackedOff('md5-c', t0 + 61_000 + 90_000)).toBe(true)
  })

  it('logs a failure once per window, then suppresses repeats', () => {
    const ledger = new ConfigstoreUploadLedger(memStore())
    const t0 = 4_000_000

    expect(ledger.onFailure('md5-d', t0)).toBe(true) // first → log
    expect(ledger.onFailure('md5-d', t0 + 1000)).toBe(false) // within window → suppress
    // After the 30-min log window, log again.
    expect(ledger.onFailure('md5-d', t0 + 31 * 60 * 1000)).toBe(true)
  })

  it('clears backoff on a subsequent success', () => {
    const ledger = new ConfigstoreUploadLedger(memStore())
    const t0 = 5_000_000

    ledger.onFailure('md5-e', t0)
    expect(ledger.isBackedOff('md5-e', t0 + 1000)).toBe(true)
    ledger.onSuccess('md5-e', t0 + 2000)
    expect(ledger.isBackedOff('md5-e', t0 + 3000)).toBe(false)
    expect(ledger.isUploaded('md5-e', t0 + 3000)).toBe(true)
  })
})

describe('ConfigstoreUploadLedger — circuit breaker', () => {
  it('opens after enough consecutive failures and a success resets it', () => {
    const ledger = new ConfigstoreUploadLedger(memStore())
    const t0 = 6_000_000

    expect(ledger.isBreakerOpen(t0)).toBe(false)
    // 8 consecutive failures trip the breaker.
    for (let i = 0; i < 8; i++) {
      ledger.onFailure(`md5-f-${i}`, t0)
    }
    expect(ledger.isBreakerOpen(t0)).toBe(true)

    // A success closes it immediately.
    ledger.onSuccess('md5-g', t0 + 1000)
    expect(ledger.isBreakerOpen(t0 + 1000)).toBe(false)
  })

  it('reopens with a longer cooldown after the window elapses and it fails again', () => {
    const ledger = new ConfigstoreUploadLedger(memStore())
    const t0 = 7_000_000

    for (let i = 0; i < 8; i++) ledger.onFailure(`a-${i}`, t0)
    expect(ledger.isBreakerOpen(t0)).toBe(true)
    // First cooldown is 30s; after it lapses the breaker is closed again.
    expect(ledger.isBreakerOpen(t0 + 31_000)).toBe(false)

    // A fresh failure after the cooldown reopens it with a doubled (60s) window.
    ledger.onFailure('a-again', t0 + 31_000)
    expect(ledger.isBreakerOpen(t0 + 31_000 + 59_000)).toBe(true)
    expect(ledger.isBreakerOpen(t0 + 31_000 + 61_000)).toBe(false)
  })

  it('does NOT trip for isolated failures spread beyond the decay window', () => {
    const ledger = new ConfigstoreUploadLedger(memStore())
    let t = 8_000_000
    // 12 failures each 6 min apart (> 5-min decay window) → streak never builds.
    for (let i = 0; i < 12; i++) {
      ledger.onFailure(`k-${i}`, t)
      t += 6 * 60 * 1000
    }
    expect(ledger.isBreakerOpen(t)).toBe(false)
  })
})

describe('ConfigstoreUploadLedger — persistence hardening', () => {
  it('persists a read-only touchedAt refresh (dirty-on-touch)', () => {
    const store = memStore()
    const led = new ConfigstoreUploadLedger(store)
    led.onSuccess('m', 1000)
    led.flush()
    led.isUploaded('m', 5000) // read-only touch
    led.flush()
    const persisted = (
      store.get('entries') as Record<string, { touchedAt: number }>
    )['m']
    expect(persisted?.touchedAt).toBe(5000)
  })

  it('coerces/drops non-finite persisted numeric fields', () => {
    const store = memStore()
    store.set('entries', {
      good: { uploadedAt: 1000, touchedAt: 1000 },
      bad: { uploadedAt: 'oops', touchedAt: null },
    })
    const led = new ConfigstoreUploadLedger(store)
    expect(led.isUploaded('good', 2000)).toBe(true)
    // bad.uploadedAt coerced to undefined → not considered uploaded.
    expect(led.isUploaded('bad', 2000)).toBe(false)
  })
})
