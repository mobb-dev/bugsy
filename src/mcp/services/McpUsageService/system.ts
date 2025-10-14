import { spawn } from 'child_process'
import os from 'os'

import { MCP_SYSTEM_FIND_TIMEOUT_MS } from '../../core/configs'
import { logWarn } from '../../Logger'

export const findSystemMCPConfigs = async (): Promise<string[]> => {
  try {
    const platform = os.platform()
    let command: string
    let args: string[]

    if (platform === 'win32') {
      // 🪟 Windows — PowerShell search
      command = 'powershell'
      args = [
        '-NoProfile',
        '-Command',
        'Get-ChildItem -Path $env:USERPROFILE -Recurse -Include *mcp*.json,*claude*.json -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName }',
      ]
    } else {
      // 🐧 All other OS — use `find`
      const home = os.homedir()
      command = 'find'
      args = [
        home,
        '-type',
        'f',
        '(',
        '-iname',
        '*mcp*.json',
        '-o',
        '-iname',
        '*claude*.json',
        ')',
      ]
    }

    return await new Promise<string[]>((resolve) => {
      const child = spawn(command, args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: platform === 'win32', // needed for PowerShell
      })

      let output = ''
      let errorOutput = ''

      const timer = setTimeout(() => {
        child.kill('SIGTERM')
        logWarn(
          `MCP config search timed out after ${MCP_SYSTEM_FIND_TIMEOUT_MS / 1000}s`
        )
        resolve([]) // timeout should not crash anything
      }, MCP_SYSTEM_FIND_TIMEOUT_MS)

      child.stdout.on('data', (data) => {
        output += data.toString()
      })

      child.stderr.on('data', (data) => {
        const msg = data.toString()
        // Ignore common permission errors
        if (
          !msg.includes('Operation not permitted') &&
          !msg.includes('Permission denied') &&
          !msg.includes('Access is denied')
        ) {
          errorOutput += msg
        }
      })

      child.on('error', (err) => {
        clearTimeout(timer)
        logWarn('MCP config search failed to start', { err })
        resolve([])
      })

      child.on('close', (code) => {
        clearTimeout(timer)
        if (code === 0 || output.trim().length > 0) {
          const files = output
            .split(/\r?\n/)
            .map((f) => f.trim())
            .filter(Boolean)
          resolve(files)
        } else {
          if (errorOutput.trim().length > 0) {
            logWarn('MCP config search finished with warnings', { errorOutput })
          }
          resolve([])
        }
      })
    })
  } catch (err) {
    logWarn('MCP config search unexpected error', { err })
    return []
  }
}
