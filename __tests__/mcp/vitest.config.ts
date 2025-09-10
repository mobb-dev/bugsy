import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

// eslint-disable-next-line import/no-default-export
// Default export is required by Vitest configuration standard
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 20000, // Further reduced timeout for faster feedback
    hookTimeout: 20000, // Match test timeout
    teardownTimeout: 10000, // Reduced teardown timeout
    poolOptions: {
      threads: {
        // Enable parallel execution for better performance
        maxThreads: 4,
        minThreads: 1,
      },
      forks: {
        // Add fork options to better handle process cleanup
        isolate: true,
        execArgv: ['--max-old-space-size=4096'], // Increase memory limit
      },
    },
    retry: 1, // Retry tests once if they fail
    isolate: true, // Isolate tests
    logHeapUsage: true, // Log heap usage to help debug memory issues
    silent: false,
    reporters: ['default', 'html', 'verbose'],

    onConsoleLog(log) {
      // Log everything with timestamps for better debugging
      console.log(`[${new Date().toISOString()}] ${log}`)
      return false // don't filter out any logs
    },
  },
  resolve: {
    alias: {
      // Map other modules if needed
      '@mobb/bugsy': resolve(__dirname, '../../src'),
    },
  },
})
