/**
 * True when running inside a Node.js single-executable application (SEA).
 * Used to gate binary-only fallbacks (e.g. downloading Snyk's standalone
 * binary when node_modules is absent).
 *
 * Uses process.getBuiltinModule so tsup/esbuild cannot rewrite `node:sea`
 * into the non-resolvable bare `sea` id.
 */
export function isStandaloneBinary(): boolean {
  try {
    const getBuiltin = (
      process as NodeJS.Process & {
        getBuiltinModule?: (id: string) => { isSea: () => boolean } | undefined
      }
    ).getBuiltinModule
    return Boolean(getBuiltin?.('node:sea')?.isSea())
  } catch {
    return false
  }
}
