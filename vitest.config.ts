/// <reference types="vitest" />
import * as fs from 'fs'
import * as path from 'path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/** Vite plugin: load *.tmpl.js files as plain-text string exports. */
function textLoaderPlugin(): Plugin {
  return {
    name: 'tmpl-js-text-loader',
    transform(_code, id) {
      if (id.endsWith('.tmpl.js')) {
        const content = fs.readFileSync(id, 'utf8')
        return { code: `export default ${JSON.stringify(content)}` }
      }
    },
  }
}

export default defineConfig({
  plugins: [textLoaderPlugin()],
  test: {
    globals: true,
    reporters: ['html', 'default'],
    exclude: ['node_modules', './build', './__e2e__'],
    setupFiles: ['./__tests__/setupTests.ts'],
    testTimeout: 200000,
    hookTimeout: 200000,
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
      exclude: ['node_modules', './build', 'vitest.config.ts'],
      provider: 'v8',
      reporter: ['html', 'text', 'lcov', 'json', 'lcovonly'],
      reportsDirectory: 'coverage',
    },
  },
  resolve: {
    alias: {
      // The generated client barrel re-exports the shared base types from
      // @mobb/commonshared, whose built output isn't present when running these
      // tests. Resolve from source so vitest loads them without a build.
      '@mobb/commonshared/base-types': path.resolve(
        __dirname,
        '../../tscommon/shared/src/gql/base-types.ts'
      ),
      '@mobb/bugsy': path.resolve(__dirname, './src'),
    },
  },
})
