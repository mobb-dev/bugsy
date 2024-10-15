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
