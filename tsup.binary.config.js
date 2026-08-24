import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { defineConfig } from 'tsup'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** esbuild plugin: import files matching a suffix as plain-text strings. */
function textLoaderPlugin(suffix) {
  return {
    name: 'text-loader',
    setup(build) {
      build.onLoad({ filter: new RegExp(suffix.replace('.', '\\.') + '$') }, (args) => ({
        contents: `export default ${JSON.stringify(fs.readFileSync(args.path, 'utf8'))}`,
        loader: 'js',
      }))
    },
  }
}

// Fully-bundled CJS build consumed by `pnpm run build:binary` (Node SEA).
// Unlike tsup.config.js, dependencies are bundled in: the standalone binary
// has no node_modules at runtime.
// KEEP IN SYNC with tsup.config.js: the dotenv cascade, define block, and
// text-loader plugin are duplicated there — a token/asset added to one build
// must be added to both.
export default defineConfig(() => {
  dotenv.config()
  dotenv.config({ path: path.resolve(__dirname, '../tracer_ext/.env'), override: false })
  dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: false })

  return {
    sourcemap: false,
    clean: true,
    format: ['cjs'],
    minify: false,
    bundle: true,
    splitting: false,
    shims: true,
    target: 'node20',
    platform: 'node',
    entry: { cli: 'src/binary_main.ts' },
    outDir: 'dist-binary',
    tsconfig: './tsconfig.json',
    dts: false,
    noExternal: [/.*/],
    // optional peer deps required inside try/catch by ws; absent at runtime is fine
    external: ['bufferutil', 'utf-8-validate'],
    esbuildPlugins: [textLoaderPlugin('daemon-check-shim.tmpl.js')],
    esbuildOptions(options) {
      // bitbucket.ts reads `.default` off a namespace import with a runtime
      // fallback; undefined here is expected. The ESM build keeps this check.
      options.logOverride = { 'import-is-undefined': 'silent' }
      // Resolve the shared GraphQL base types to source so the bundle doesn't
      // depend on `@mobb/commonshared` being built first (this binary build runs
      // without building workspace deps). Inlined via noExternal above.
      options.alias = {
        ...(options.alias ?? {}),
        '@mobb/commonshared/base-types': path.resolve(
          __dirname,
          '../../tscommon/shared/src/gql/base-types.ts'
        ),
      }
    },
    define: {
      __DD_RUM_TOKEN__: JSON.stringify(process.env.DD_RUM_TOKEN ?? ''),
      __CLI_VERSION__: JSON.stringify(process.env.npm_package_version ?? 'unknown'),
    },
  }
})
