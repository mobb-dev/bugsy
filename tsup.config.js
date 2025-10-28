import { defineConfig } from 'tsup'

export default defineConfig(({ env }) => {
  const isProd = env.NODE_ENV === 'production'
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
  }
})
