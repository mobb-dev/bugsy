import { createHash } from 'node:crypto'
import os from 'node:os'

function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16)
}

export function getPlainHostname(): string {
  try {
    return `${os.userInfo().username}@${os.hostname()}`
  } catch {
    return `unknown@${os.hostname()}`
  }
}

export function getHashedHostname(): string {
  try {
    return `${hashString(os.userInfo().username)}@${hashString(os.hostname())}`
  } catch {
    return `unknown@${hashString(os.hostname())}`
  }
}
