export function log(...args: unknown[]) {
  if (process.env['VERBOSE']) {
    console.log(...args)
  }
}
