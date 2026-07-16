import { Agent as HttpAgent } from 'node:http'
import { Agent as HttpsAgent } from 'node:https'

import fetchOrig from 'cross-fetch'
import Debug from 'debug'
import { HttpsProxyAgent } from 'https-proxy-agent'

const debug = Debug('mobbdev:proxy')

/**
 * Upper bound on keep-alive sockets in the upload pool. Uploads are currently
 * serialized process-wide (UPLOAD_CONCURRENCY = 1 in context_file_uploader.ts),
 * so only one socket is in flight in practice; this is deliberate headroom so
 * the pool need not be resized if that concurrency is ever raised. The keep-alive
 * pool (not the size) is the real win: it reuses connections instead of opening
 * a fresh TCP/TLS (or proxy CONNECT) socket per POST, which under load exhausts
 * local ephemeral ports (EADDRNOTAVAIL) and trips proxies into resets (ECONNRESET).
 */
const UPLOAD_MAX_SOCKETS = 8

let uploadHttpAgent: HttpAgent | undefined
let uploadHttpsAgent: HttpsAgent | undefined
const uploadProxyAgents = new Map<string, HttpsProxyAgent<string>>()

// Read proxy env vars directly instead of importing from constants.ts to avoid
// pulling in heavy deps (chalk, dotenv, zod) that break Jest-based E2E tests.
function getHttpProxy() {
  return process.env['HTTPS_PROXY'] || process.env['HTTP_PROXY'] || ''
}

function getHttpProxyOnly() {
  return process.env['HTTP_PROXY'] || ''
}

type ProxyResolution = { proxy: string; isHttp: boolean; isHttps: boolean }

/**
 * Single source of truth for proxy selection: localhost/loopback bypass,
 * NO_PROXY (exact host or `*`) bypass, and the protocol-specific proxy env var
 * (HTTPS falls back to HTTP_PROXY). Returns `proxy: ''` when the request should
 * connect directly. Both {@link getProxyAgent} and {@link getUploadAgent} consume
 * this so the bypass rules can never drift between the two paths.
 *
 * NOTE: NO_PROXY matching is exact-host / `*` only (no domain-suffix or CIDR) —
 * a pre-existing limitation kept here for behavioral compatibility.
 */
function resolveProxyForUrl(url: string): ProxyResolution {
  const parsedUrl = new URL(url)
  const hostname = parsedUrl.hostname.toLowerCase()
  const isHttp = parsedUrl.protocol === 'http:'
  const isHttps = parsedUrl.protocol === 'https:'

  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]'

  const noProxy = process.env['NO_PROXY'] || process.env['no_proxy']
  const noProxyMatch =
    noProxy
      ?.split(',')
      .map((h) => h.trim().toLowerCase())
      .some((h) => h === hostname || h === '*') ?? false

  if (isLocal || noProxyMatch) {
    return { proxy: '', isHttp, isHttps }
  }
  const proxy = isHttps ? getHttpProxy() : isHttp ? getHttpProxyOnly() : ''
  return { proxy, isHttp, isHttps }
}

export function getProxyAgent(url: string) {
  try {
    const { proxy } = resolveProxyForUrl(url)
    if (proxy) {
      debug('Using proxy %s for %s', proxy, url)
      // IMPORTANT:
      // Use HttpsProxyAgent for both HTTP and HTTPS targets.
      // HttpProxyAgent does not tunnel via CONNECT, which breaks WebSocket upgrades
      // through HTTP proxies. HttpsProxyAgent forces CONNECT tunneling, which is
      // required for websocket connections even for non-encrypted (ws://) URLs.
      return new HttpsProxyAgent(proxy)
    }
  } catch (err) {
    debug(`Skipping proxy for ${url}. Reason: ${(err as Error).message}`)
  }
  return undefined
}

/**
 * Return a pooled, keep-alive agent for S3 uploads. Uses the same
 * {@link resolveProxyForUrl} decision as {@link getProxyAgent}, but returns
 * cached agents with `keepAlive: true` and a bounded `maxSockets` so bursts of
 * uploads reuse a small connection pool instead of opening (and leaking) a
 * socket per request. Cached per proxy string and per protocol so the pool
 * persists across calls for the daemon's lifetime.
 */
export function getUploadAgent(
  url: string
): HttpAgent | HttpsAgent | undefined {
  try {
    const { proxy, isHttp, isHttps } = resolveProxyForUrl(url)

    if (proxy) {
      let agent = uploadProxyAgents.get(proxy)
      if (!agent) {
        agent = new HttpsProxyAgent(proxy, {
          keepAlive: true,
          maxSockets: UPLOAD_MAX_SOCKETS,
        })
        uploadProxyAgents.set(proxy, agent)
      }
      return agent
    }

    if (isHttps) {
      uploadHttpsAgent ??= new HttpsAgent({
        keepAlive: true,
        maxSockets: UPLOAD_MAX_SOCKETS,
      })
      return uploadHttpsAgent
    }
    if (isHttp) {
      uploadHttpAgent ??= new HttpAgent({
        keepAlive: true,
        maxSockets: UPLOAD_MAX_SOCKETS,
      })
      return uploadHttpAgent
    }
  } catch (err) {
    debug(`No upload agent for ${url}. Reason: ${(err as Error).message}`)
  }
  return undefined
}

// Re-export httpToWsUrl for backward compatibility
export { httpToWsUrl } from './url'

// Custom fetch with proxy support
export const fetchWithProxy: typeof fetchOrig = (url, options = {}) => {
  try {
    const agent = getProxyAgent(url.toString())

    if (agent) {
      return fetchOrig(url, {
        ...options,
        // @ts-expect-error Node-fetch doesn't type 'agent', but it's valid
        agent,
      })
    }
  } catch (err) {
    debug(`Skipping proxy for ${url}. Reason: ${(err as Error).message}`)
  }

  return fetchOrig(url, options)
}
