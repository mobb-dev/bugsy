declare module 'ignore' {
  export type Ignore = {
    ignores(path: string): boolean
    add(pattern: string | string[]): Ignore
  }

  function ignore(): Ignore
  export default ignore
}
