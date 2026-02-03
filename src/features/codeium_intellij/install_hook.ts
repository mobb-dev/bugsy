import fsPromises from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import chalk from 'chalk'

type WindsurfHook = {
  command: string
  show_output?: boolean
}

type WindsurfHooks = {
  post_write_code?: WindsurfHook[]
}

type WindsurfHooksConfig = {
  hooks?: WindsurfHooks
}

function getCodeiumHooksPath(): string {
  return path.join(os.homedir(), '.codeium', 'hooks.json')
}

export async function codeiumHooksExists(): Promise<boolean> {
  try {
    await fsPromises.access(getCodeiumHooksPath())
    return true
  } catch {
    return false
  }
}

export async function readCodeiumHooks(): Promise<WindsurfHooksConfig> {
  const hooksPath = getCodeiumHooksPath()
  try {
    const content = await fsPromises.readFile(hooksPath, 'utf-8')
    return JSON.parse(content) as WindsurfHooksConfig
  } catch {
    return {}
  }
}

export async function writeCodeiumHooks(
  config: WindsurfHooksConfig
): Promise<void> {
  const hooksPath = getCodeiumHooksPath()
  const dir = path.dirname(hooksPath)

  // Ensure directory exists
  await fsPromises.mkdir(dir, { recursive: true })

  await fsPromises.writeFile(
    hooksPath,
    JSON.stringify(config, null, 2),
    'utf-8'
  )
}

export async function installWindsurfHooks(
  options: { saveEnv?: boolean } = {}
): Promise<void> {
  const hooksPath = getCodeiumHooksPath()
  console.log(chalk.blue('Installing Mobb hooks in Windsurf IntelliJ...'))

  const config = await readCodeiumHooks()

  if (!config.hooks) {
    config.hooks = {}
  }

  if (!config.hooks.post_write_code) {
    config.hooks.post_write_code = []
  }

  // Build command with environment variables if saveEnv is enabled
  let command = 'npx --yes mobbdev@latest windsurf-intellij-process-hook'

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

  const mobbHook: WindsurfHook = {
    command,
    show_output: true,
  }

  const existingHookIndex = config.hooks.post_write_code.findIndex((hook) =>
    hook.command?.includes('mobbdev@latest windsurf-intellij-process-hook')
  )

  if (existingHookIndex >= 0) {
    console.log(chalk.yellow('Mobb hook already exists, updating...'))
    config.hooks.post_write_code[existingHookIndex] = mobbHook
  } else {
    console.log(chalk.green('Adding new Mobb hook...'))
    config.hooks.post_write_code.push(mobbHook)
  }

  await writeCodeiumHooks(config)

  console.log(
    chalk.green(
      `✅ Mobb hooks ${options.saveEnv ? 'and environment variables ' : ''}installed successfully in ${hooksPath}`
    )
  )
}
