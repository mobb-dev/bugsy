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

// KEEP IN SYNC with tsup.binary.config.js (standalone binary build): the
// dotenv cascade, define block, and text-loader plugin are duplicated there.
export default defineConfig(({ env }) => {
  const isProd = env.NODE_ENV === 'production'

  // Load .env so build-time secrets (e.g. DD_RUM_TOKEN) are available.
  // In CI/prepack, `dotenv-vault pull production .env` runs first.
  // Fallbacks (override: false → first value wins):
  //   1. cli/.env (from dotenv-vault pull)
  //   2. tracer_ext/.env (shares the same DD_RUM_TOKEN)
  //   3. repo root .env
  dotenv.config()
  dotenv.config({ path: path.resolve(__dirname, '../tracer_ext/.env'), override: false })
  dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: false })

  return {
    sourcemap: !isProd, // source map is only available in prod
    clean: true, // clean dist before build
    format: ['esm'],
    minify: false,
    bundle: true,
    splitting: false,
    // @mobb/commonshared is a workspace-only dev dependency (the shared GraphQL
    // base types). It is NOT published to npm, so it must be inlined into the
    // bundle rather than left as an external import.
    noExternal: ['@mobb/commonshared'],
    watch: !isProd,
    target: 'es2020',
    entry: ['src/index.ts', 'src/args/commands/upload_ai_blame.ts', 'src/hash_search/index.ts'],
    tsconfig: './tsconfig.json',
    dts: true,
    esbuildPlugins: [textLoaderPlugin('daemon-check-shim.tmpl.js')],
    esbuildOptions(options) {
      // Resolve the shared GraphQL base types to source so the bundle doesn't
      // depend on `@mobb/commonshared` being built first. Inlined via noExternal.
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
