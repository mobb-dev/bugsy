import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import chalk from 'chalk'

import { getDaemonCheckScriptPath, getMobbdevDir } from './daemon_pid_file'
import daemonCheckShimTemplate from './daemon-check-shim.tmpl.js'
import { HEARTBEAT_STALE_MS } from './data_collector_constants'

type ClaudeCodeHook = {
  type: 'command'
  command: string
  async?: boolean
}

type ClaudeCodeHookMatcher = {
  matcher: string
  hooks: ClaudeCodeHook[]
}

type ClaudeCodeHooks = {
  PostToolUse?: ClaudeCodeHookMatcher[]
}

type ClaudeCodeSettings = {
  hooks?: ClaudeCodeHooks
  [key: string]: unknown
}

const CLAUDE_SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json')

/**
 * The current recommended matcher for the hook.
 * With the daemon architecture the hook is a lightweight shim (~100ms)
 * that only checks daemon liveness, so matching all tools is acceptable.
 */
export const RECOMMENDED_MATCHER = '*'

export async function claudeSettingsExists(): Promise<boolean> {
  try {
    await fsPromises.access(CLAUDE_SETTINGS_PATH)
    return true
  } catch {
    return false
  }
}

export async function readClaudeSettings(): Promise<ClaudeCodeSettings> {
  const settingsContent = await fsPromises.readFile(
    CLAUDE_SETTINGS_PATH,
    'utf-8'
  )
  return JSON.parse(settingsContent) as ClaudeCodeSettings
}

export async function writeClaudeSettings(
  settings: ClaudeCodeSettings
): Promise<void> {
  await fsPromises.writeFile(
    CLAUDE_SETTINGS_PATH,
    JSON.stringify(settings, null, 2),
    'utf-8'
  )
}

/** Returns true if a hook command looks like a Mobb hook (old or new format). */
function isMobbHookCommand(command: string | undefined): boolean {
  if (!command) return false
  return (
    command.includes('mobbdev@latest') ||
    command.includes('/.mobbdev/') ||
    command.includes('\\.mobbdev\\')
  )
}

/** The daemon-check.js shim script (CommonJS for max Node compat). */
function getDaemonCheckScript(): string {
  return daemonCheckShimTemplate.replace(
    '__HEARTBEAT_STALE_MS__',
    String(HEARTBEAT_STALE_MS)
  )
}

/**
 * Writes the daemon-check.js shim script to ~/.mobbdev/.
 * Creates the directory if it doesn't exist.
 */
export function writeDaemonCheckScript(): void {
  fs.mkdirSync(getMobbdevDir(), { recursive: true })
  fs.writeFileSync(getDaemonCheckScriptPath(), getDaemonCheckScript(), 'utf8')
}

/** Build the hook command string pointing to the daemon-check shim. */
function buildHookCommand(envPrefix?: string): string {
  // Use absolute node path to avoid PATH issues with nvm/fnm/volta.
  // Fall back to bare `node` if execPath is unavailable.
  const nodeBin = process.execPath || 'node'
  const base = `${nodeBin} ${getDaemonCheckScriptPath()}`
  return envPrefix ? `${envPrefix} ${base}` : base
}

/**
 * Auto-upgrade stale hook matchers during normal hook execution.
 * Runs silently — never throws, never logs to stdout.
 * Returns true if an upgrade was performed.
 */
export async function autoUpgradeMatcherIfStale(): Promise<boolean> {
  try {
    if (!(await claudeSettingsExists())) return false

    const settings = await readClaudeSettings()
    const hooks = settings.hooks?.PostToolUse
    if (!hooks) return false

    let upgraded = false
    for (const hook of hooks) {
      const isMobbHook = hook.hooks.some((h) => isMobbHookCommand(h.command))
      if (!isMobbHook) continue

      if (hook.matcher !== RECOMMENDED_MATCHER) {
        hook.matcher = RECOMMENDED_MATCHER
        upgraded = true
      }

      // Upgrade command to new daemon-check shim
      for (const h of hook.hooks) {
        if (h.command && !h.command.includes('daemon-check.js')) {
          // Preserve any env var prefix (e.g. WEB_APP_URL="..." API_URL="...")
          const envMatch = h.command.match(/^((?:\w+="[^"]*"\s*)+)/)
          const envPrefix = envMatch?.[1]?.trim()
          h.command = buildHookCommand(envPrefix)
          upgraded = true
        }
        if (!h.async) {
          h.async = true
          upgraded = true
        }
      }
    }

    if (upgraded) {
      writeDaemonCheckScript()
      await writeClaudeSettings(settings)
    }
    return upgraded
  } catch {
    // Silent — auto-upgrade is best-effort
    return false
  }
}

export async function installMobbHooks(
  options: { saveEnv?: boolean } = {}
): Promise<void> {
  console.log(chalk.blue('Installing Mobb hooks in Claude Code settings...'))

  if (!(await claudeSettingsExists())) {
    console.log(chalk.red('❌ Claude Code settings file not found'))
    console.log(chalk.yellow(`Expected location: ${CLAUDE_SETTINGS_PATH}`))
    console.log(chalk.yellow('Is Claude Code installed on your system?'))
    console.log(chalk.yellow('Please install Claude Code and try again.'))
    throw new Error(
      'Claude Code settings file not found. Is Claude Code installed?'
    )
  }

  // Write the daemon-check shim to disk
  writeDaemonCheckScript()

  const settings = await readClaudeSettings()

  if (!settings.hooks) {
    settings.hooks = {}
  }

  if (!settings.hooks.PostToolUse) {
    settings.hooks.PostToolUse = []
  }

  // Build command with environment variables if saveEnv is enabled
  let envPrefix: string | undefined
  if (options.saveEnv) {
    const envVars: string[] = []

    if (process.env['WEB_APP_URL']) {
      envVars.push(`WEB_APP_URL="${process.env['WEB_APP_URL']}"`)
    }

    if (process.env['API_URL']) {
      envVars.push(`API_URL="${process.env['API_URL']}"`)
    }

    if (envVars.length > 0) {
      envPrefix = envVars.join(' ')
      console.log(
        chalk.blue(
          `Adding environment variables to hook command: ${envVars.join(', ')}`
        )
      )
    }
  }

  const command = buildHookCommand(envPrefix)

  const mobbHookConfig: ClaudeCodeHookMatcher = {
    matcher: RECOMMENDED_MATCHER,
    hooks: [
      {
        type: 'command',
        command,
        async: true,
      },
    ],
  }

  // Detect both old (npx mobbdev) and new (daemon-check.js) hooks for upgrade/update
  const existingHookIndex = settings.hooks.PostToolUse.findIndex((hook) =>
    hook.hooks.some((h) => isMobbHookCommand(h.command))
  )

  if (existingHookIndex >= 0) {
    console.log(chalk.yellow('Mobb hook already exists, updating...'))
    settings.hooks.PostToolUse[existingHookIndex] = mobbHookConfig
  } else {
    console.log(chalk.green('Adding new Mobb hook...'))
    settings.hooks.PostToolUse.push(mobbHookConfig)
  }

  await writeClaudeSettings(settings)

  console.log(
    chalk.green(
      `✅ Mobb hooks ${options.saveEnv ? 'and environment variables ' : ''}installed successfully in ${CLAUDE_SETTINGS_PATH}`
    )
  )
}
