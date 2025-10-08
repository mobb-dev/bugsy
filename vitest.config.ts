/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    reporters: ['html', 'default'],
    exclude: ['node_modules', './build', './__e2e__'],
    setupFiles: ['./__tests__/setupTests.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    // Enable parallel execution for faster test runs
    poolOptions: {
      threads: {
        maxThreads: 6, // Use more threads on 8-core runner
        minThreads: 2,
      },
      forks: {
        isolate: true,
        execArgv: ['--max-old-space-size=4096'],
      },
    },
    coverage: {
      exclude: ['node_modules', './build'],
      provider: 'istanbul',
      reportsDirectory: 'html/coverage',
    },
  },
  resolve: {
    alias: {
      '@mobb/bugsy': path.resolve(__dirname, './src'),
    },
  },
})
