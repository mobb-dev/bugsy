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
    watch: !isProd,
    target: 'es2020',
    entry: ['src/index.ts', 'src/args/commands/upload_ai_blame.ts', 'src/hash_search/index.ts'],
    tsconfig: './tsconfig.json',
    dts: true,
    esbuildPlugins: [textLoaderPlugin('daemon-check-shim.tmpl.js')],
    define: {
      __DD_RUM_TOKEN__: JSON.stringify(process.env.DD_RUM_TOKEN ?? ''),
      __CLI_VERSION__: JSON.stringify(process.env.npm_package_version ?? 'unknown'),
    },
  }
})
