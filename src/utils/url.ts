/** Convert an HTTP(S) URL to its WebSocket equivalent (ws:// or wss://). */
export function httpToWsUrl(url: string): string {
  const parsed = new URL(url)
  parsed.protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
  return parsed.toString()
}

/**
 * Convert a `file://` URI to an OS filesystem path, with explicit
 * Windows-aware conversion. Returns `undefined` for non-`file://` input
 * or malformed URIs.
 *
 * Node's `fileURLToPath` uses the **host** platform's semantics, so a
 * Linux server processing a Windows URI (`file:///c%3A/Users/x/foo.ts`)
 * would decode it into `/c:/Users/x/foo.ts` — a path that is not a valid
 * fsPath on any platform.
 *
 * This function detects the Windows drive-letter pattern on the decoded
 * pathname and converts manually: strip the leading `/` and convert
 * forward slashes to backslashes. For POSIX URIs the decoded pathname is
 * already the correct fsPath (`/Users/x/foo.ts`).
 *
 * Rejects URIs containing encoded slashes (`%2F` / `%5C`) because those
 * represent literal slash characters *inside a path segment*, not path
 * separators. Converting them into OS separators would silently produce a
 * wrong path. (Node's `fileURLToPath` throws `ERR_INVALID_FILE_URL_PATH`
 * for the same reason.)
 *
 * Uses only browser-safe APIs (`URL` + `decodeURIComponent`) so the file
 * can be bundled by Vite for the frontend app without `node:url` errors.
 */
export function fileUriToFsPath(uri: string): string | undefined {
  if (!uri.startsWith('file://')) {
    return undefined
  }
  try {
    const raw = new URL(uri).pathname
    // Reject encoded slashes — they represent literal characters inside a
    // path segment, not separators. Converting them would silently produce
    // wrong paths. Matches Node's fileURLToPath ERR_INVALID_FILE_URL_PATH.
    if (/%2[Ff]/.test(raw) || /%5[Cc]/.test(raw)) {
      return undefined
    }
    const pathname = decodeURIComponent(raw)
    // Windows drive-letter: pathname starts with /X: (e.g. /C:/Users/...)
    if (/^\/[A-Za-z]:/.test(pathname)) {
      return pathname.slice(1).replace(/\//g, '\\')
    }
    return pathname
  } catch {
    return undefined
  }
}
