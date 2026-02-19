import fetchOrig from 'cross-fetch'
import Debug from 'debug'
import { HttpsProxyAgent } from 'https-proxy-agent'

const debug = Debug('mobbdev:proxy')

// Read proxy env vars directly instead of importing from constants.ts to avoid
// pulling in heavy deps (chalk, dotenv, zod) that break Jest-based E2E tests.
function getHttpProxy() {
  return process.env['HTTPS_PROXY'] || process.env['HTTP_PROXY'] || ''
}

function getHttpProxyOnly() {
  return process.env['HTTP_PROXY'] || ''
}

export function getProxyAgent(url: string) {
  try {
    const parsedUrl = new URL(url)

    // CRITICAL: Never use proxy for localhost connections
    // This prevents the common issue where HTTP_PROXY blocks local mock servers in tests
    const hostname = parsedUrl.hostname.toLowerCase()
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      debug('Skipping proxy for localhost URL: %s', url)
      return undefined
    }

    // Check NO_PROXY environment variable (standard proxy bypass list)
    const noProxy = process.env['NO_PROXY'] || process.env['no_proxy']
    if (noProxy) {
      const noProxyList = noProxy.split(',').map((h) => h.trim().toLowerCase())
      if (noProxyList.includes(hostname) || noProxyList.includes('*')) {
        debug('Skipping proxy due to NO_PROXY for: %s', url)
        return undefined
      }
    }

    const isHttp = parsedUrl.protocol === 'http:'
    const isHttps = parsedUrl.protocol === 'https:'

    // Prefer protocol-specific proxy vars, but allow HTTPS to fall back to HTTP_PROXY
    // (common in local/dev environments).
    const proxy = isHttps ? getHttpProxy() : isHttp ? getHttpProxyOnly() : null

    if (proxy) {
      debug('Using proxy %s', proxy)
      debug('Proxy agent %o', proxy)
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
