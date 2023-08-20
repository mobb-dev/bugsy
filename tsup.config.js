import { defineConfig } from 'tsup'

export default defineConfig(({ env }) => {
  const isProd = env.NODE_ENV === 'production'
  return {
    sourcemap: !isProd, // source map is only available in prod
    clean: true, // clean dist before build
    format: ['esm'],
    minify: false,
    bundle: true,
    watch: !isProd,
    target: 'es2020',
    entry: ['src/index.ts'],
    tsconfig: './tsconfig.json',
  }
})
