import { Argv } from 'yargs'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { processAndUploadHookData } from '../../features/codeium_intellij/data_collector'
import { installWindsurfHooks } from '../../features/codeium_intellij/install_hook'

export const windsurfIntellijInstallHookBuilder = (yargs: Argv) => {
  return yargs
    .option('save-env', {
      type: 'boolean',
      description:
        'Save WEB_APP_URL, and API_URL environment variables to hooks config',
      default: false,
    })
    .example(
      '$0 windsurf-intellij-install-hook',
      'Install Windsurf IntelliJ hooks for data collection'
    )
    .example(
      '$0 windsurf-intellij-install-hook --save-env',
      'Install hooks and save environment variables to config'
    )
    .strict()
}

export const windsurfIntellijProcessHookBuilder = (yargs: Argv) => {
  return yargs
    .example(
      '$0 windsurf-intellij-process-hook',
      'Process Windsurf IntelliJ hook data and upload to backend'
    )
    .strict()
}

/**
 * Handler for the windsurf-intellij-install-hook command - installs hooks in Codeium hooks.json
 */
export const windsurfIntellijInstallHookHandler = async (argv: {
  'save-env': boolean
}) => {
  try {
    // Authenticate user using existing CLI auth flow
    await getAuthenticatedGQLClient({ isSkipPrompts: false })

    // Install the hooks
    await installWindsurfHooks({ saveEnv: argv['save-env'] })

    process.exit(0)
  } catch (error) {
    console.error('Failed to install Windsurf IntelliJ hooks:', error)
    process.exit(1)
  }
}

/**
 * Handler for the windsurf-intellij-process-hook command - processes stdin hook data and uploads traces
 */
export const windsurfIntellijProcessHookHandler = async () => {
  try {
    // Process hook data and upload to backend
    await processAndUploadHookData()

    process.exit(0)
  } catch (error) {
    console.error('Failed to process Windsurf IntelliJ hook data:', error)
    process.exit(1)
  }
}
