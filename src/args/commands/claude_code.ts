import { Argv } from 'yargs'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { processAndUploadTranscriptEntries } from '../../features/claude_code/data_collector'
import {
  flushDdLogs,
  flushLogs,
  hookLog,
} from '../../features/claude_code/hook_logger'
import { installMobbHooks } from '../../features/claude_code/install_hook'

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
      'Process Claude Code hook data and upload to backend'
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
 * Handler for the claude-code-process-hook command - processes stdin hook data and uploads traces
 */
export const claudeCodeProcessHookHandler = async () => {
  async function flushAndExit(code: number): Promise<never> {
    try {
      flushLogs()
      await flushDdLogs()
    } catch {
      // Best-effort flush — ensure we always exit
    } finally {
      process.exit(code)
    }
  }

  // Global safety net for any uncaught errors/rejections in the hook process
  process.on('uncaughtException', (error) => {
    hookLog.error('Uncaught exception in hook', {
      error: String(error),
      stack: error.stack,
    })
    void flushAndExit(1)
  })
  process.on('unhandledRejection', (reason) => {
    hookLog.error('Unhandled rejection in hook', {
      error: String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    })
    void flushAndExit(1)
  })

  let exitCode = 0
  try {
    const result = await processAndUploadTranscriptEntries()
    hookLog.info('Claude Code upload complete', {
      entriesUploaded: result.entriesUploaded,
      entriesSkipped: result.entriesSkipped,
      errors: result.errors,
    })
  } catch (error) {
    exitCode = 1
    hookLog.error('Failed to process Claude Code hook', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }

  await flushAndExit(exitCode)
}
