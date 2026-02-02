import { Argv } from 'yargs'

import { startMonitoring } from '../../features/codeium_intellij/data_collector_monitor'

export const windsurfIntellijMonitorBuilder = (yargs: Argv) => {
  return yargs
    .example(
      '$0 windsurf-intellij-monitor',
      'Start monitoring Windsurf IntelliJ for AI inference data'
    )
    .strict()
}

/**
 * Handler for the windsurf-intellij-monitor command - starts monitoring Windsurf IntelliJ
 * for AI inference data and uploads traces to the backend
 */
export const windsurfIntellijMonitorHandler = async () => {
  try {
    console.log('Starting Windsurf IntelliJ monitor...')
    console.log('Polling for AI inference data from running IDE instances.')
    console.log('Press Ctrl+C to stop.\n')

    await startMonitoring()
  } catch (error) {
    console.error('Windsurf IntelliJ monitor failed:', error)
    process.exit(1)
  }
}
