/** Convert an HTTP(S) URL to its WebSocket equivalent (ws:// or wss://). */
export function httpToWsUrl(url: string): string {
  const parsed = new URL(url)
  parsed.protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
  return parsed.toString()
}
