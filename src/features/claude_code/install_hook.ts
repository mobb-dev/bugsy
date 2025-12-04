import fsPromises from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import chalk from 'chalk'

type ClaudeCodeHook = {
  type: 'command'
  command: string
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

  const settings = await readClaudeSettings()

  if (!settings.hooks) {
    settings.hooks = {}
  }

  if (!settings.hooks.PostToolUse) {
    settings.hooks.PostToolUse = []
  }

  // Build command with environment variables if saveEnv is enabled
  let command = 'npx --yes mobbdev@latest claude-code-process-hook'

  if (options.saveEnv) {
    const envVars = []

    if (process.env['WEB_APP_URL']) {
      envVars.push(`WEB_APP_URL="${process.env['WEB_APP_URL']}"`)
    }

    if (process.env['API_URL']) {
      envVars.push(`API_URL="${process.env['API_URL']}"`)
    }

    if (envVars.length > 0) {
      command = `${envVars.join(' ')} ${command}`
      console.log(
        chalk.blue(
          `Adding environment variables to hook command: ${envVars.join(', ')}`
        )
      )
    }
  }

  const mobbHookConfig: ClaudeCodeHookMatcher = {
    matcher: 'Edit|Write',
    hooks: [
      {
        type: 'command',
        command,
      },
    ],
  }

  const existingHookIndex = settings.hooks.PostToolUse.findIndex(
    (hook) =>
      hook.matcher === 'Edit|Write' &&
      hook.hooks.some((h) =>
        h.command?.includes('mobbdev@latest claude-code-process-hook')
      )
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
