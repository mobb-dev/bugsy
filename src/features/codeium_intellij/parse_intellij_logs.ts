import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

type CodeiumInstance = {
  ide: string
  csrf: string
  port: number
}

type ParseResult = {
  csrf: string
  port: number
}

// Log paths per platform:
// macOS:   ~/Library/Logs/JetBrains/<IDE>/idea.N.log
// Windows: %LOCALAPPDATA%/JetBrains/<IDE>/log/idea.N.log
// Linux:   ~/.cache/JetBrains/<IDE>/log/idea.N.log
function getLogsDir(): string {
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library/Logs/JetBrains')
  } else if (process.platform === 'win32') {
    return path.join(
      process.env['LOCALAPPDATA'] || path.join(os.homedir(), 'AppData/Local'),
      'JetBrains'
    )
  } else {
    return path.join(os.homedir(), '.cache/JetBrains')
  }
}

function parseIdeLogDir(ideLogDir: string): ParseResult | null {
  // Include both idea.N.log and idea.log
  // Sort by modification time (oldest first, newest last)
  const logFiles = fs
    .readdirSync(ideLogDir)
    .filter((f) => /^idea(\.\d+)?\.log$/.test(f))
    .map((f) => ({
      name: f,
      mtime: fs.statSync(path.join(ideLogDir, f)).mtimeMs,
    }))
    .sort((a, b) => a.mtime - b.mtime)
    .map((f) => f.name)

  // Collect all csrf/port pairs, keeping only the most recent one
  let latestCsrf: string | null = null
  let latestPort: number | null = null

  for (const logFile of logFiles) {
    const lines = fs
      .readFileSync(path.join(ideLogDir, logFile), 'utf-8')
      .split('\n')

    for (const line of lines) {
      if (
        !line.includes(
          'com.codeium.intellij.language_server.LanguageServerProcessHandler'
        )
      ) {
        continue
      }

      // Check for csrf token - each new csrf indicates a new server session
      const csrfMatch = line.match(/--csrf_token\s+([a-f0-9-]{36})/)
      if (csrfMatch?.[1]) {
        latestCsrf = csrfMatch[1]
        latestPort = null // Reset port when we see a new session
      }

      // Check for port
      const portMatch = line.match(/listening on random port at (\d+)/)
      if (portMatch?.[1]) {
        latestPort = parseInt(portMatch[1])
      }
    }
  }

  if (latestCsrf && latestPort) {
    return { csrf: latestCsrf, port: latestPort }
  }

  return null
}

export function findRunningCodeiumLanguageServers(): CodeiumInstance[] {
  const results: CodeiumInstance[] = []
  const logsDir = getLogsDir()

  if (!fs.existsSync(logsDir)) return results

  for (const ide of fs.readdirSync(logsDir)) {
    let ideLogDir = path.join(logsDir, ide)
    if (process.platform !== 'darwin') {
      ideLogDir = path.join(ideLogDir, 'log')
    }
    if (!fs.existsSync(ideLogDir) || !fs.statSync(ideLogDir).isDirectory()) {
      continue
    }

    const result = parseIdeLogDir(ideLogDir)
    if (result) {
      results.push({ ide, ...result })
    }
  }

  return results
}
