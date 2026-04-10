import { spawn } from 'node:child_process'

import { Argv } from 'yargs'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { startDaemon } from '../../features/claude_code/daemon'
import { DaemonPidFile } from '../../features/claude_code/daemon_pid_file'
import { flushDdLogs, hookLog } from '../../features/claude_code/hook_logger'
import {
  autoUpgradeMatcherIfStale,
  installMobbHooks,
  writeDaemonCheckScript,
} from '../../features/claude_code/install_hook'

export const claudeCodeInstallHookBuilder = (yargs: Argv) => {
  return yargs
    .option('save-env', {
      type: 'boolean',
      description:
        'Save WEB_APP_URL, and API_URL environment variables to hooks config',
      default: false,
    })
    .example(
      '$0 claude-code-install-hook',
      'Install Claude Code hooks for data collection'
    )
    .example(
      '$0 claude-code-install-hook --save-env',
      'Install hooks and save environment variables to config'
    )
    .strict()
}

export const claudeCodeProcessHookBuilder = (yargs: Argv) => {
  return yargs
    .example(
      '$0 claude-code-process-hook',
      'Process Claude Code hook data (legacy — spawns daemon)'
    )
    .strict()
}

export const claudeCodeDaemonBuilder = (yargs: Argv) => {
  return yargs
    .example(
      '$0 claude-code-daemon',
      'Run the background daemon that processes Claude Code transcripts'
    )
    .strict()
}

/**
 * Handler for the claude-code-install-hook command - installs hooks in Claude Code settings
 */
export const claudeCodeInstallHookHandler = async (argv: {
  'save-env': boolean
}) => {
  try {
    // Authenticate user using existing CLI auth flow
    await getAuthenticatedGQLClient({ isSkipPrompts: false })

    // Install the hooks
    await installMobbHooks({ saveEnv: argv['save-env'] })

    process.exit(0)
  } catch (error) {
    console.error('Failed to install Claude Code hooks:', error)
    process.exit(1)
  }
}

/**
 * Handler for the claude-code-process-hook command.
 * Now a lightweight shim: auto-upgrades hook config, ensures daemon is running, exits.
 * No stdin reading, no transcript processing.
 */
export const claudeCodeProcessHookHandler = async () => {
  try {
    // Auto-upgrade hook config to new daemon-check shim format
    await autoUpgradeMatcherIfStale()

    // Ensure daemon-check.js shim exists on disk
    writeDaemonCheckScript()

    // Check if daemon is alive; if not, spawn it
    const pidFile = new DaemonPidFile()
    pidFile.read()
    if (!pidFile.isAlive()) {
      hookLog.info('Daemon not alive — spawning')
      const localCli = process.env['MOBBDEV_LOCAL_CLI']
      const child = localCli
        ? spawn('node', [localCli, 'claude-code-daemon'], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true,
          })
        : spawn('npx', ['--yes', 'mobbdev@latest', 'claude-code-daemon'], {
            detached: true,
            stdio: 'ignore',
            shell: true,
            windowsHide: true,
          })
      child.unref()
    }
  } catch (err) {
    hookLog.error({ err }, 'Error in process-hook shim')
  }

  try {
    await flushDdLogs()
  } catch {
    // Best-effort flush
  }
  process.exit(0)
}

/**
 * Handler for the claude-code-daemon command — starts the persistent daemon.
 */
export const claudeCodeDaemonHandler = async () => {
  try {
    await startDaemon()
  } catch (err) {
    hookLog.error({ err }, 'Daemon crashed')
    await flushDdLogs()
    process.exit(1)
  }
}
