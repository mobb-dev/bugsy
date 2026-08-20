export * from './dirname'
export * from './keypress'
export * from './spinner'
export * from './standalone_binary'
export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))
export class CliError extends Error {
  /**
   * The process exit code index.ts maps this error to. Defaults to 1 (plain
   * operational error) so every existing throw keeps its behavior; 2 means the
   * gate policy blocked the run (MOBB-3810), so CI can tell "your code is
   * gated" from "the tool broke".
   */
  readonly exitCode: number

  constructor(message?: string, options: { exitCode?: number } = {}) {
    super(message)
    this.exitCode = options.exitCode ?? 1
  }
}
export * from './check_node_version'
export * from './gitUtils'
