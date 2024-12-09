export * from './dirname'
export * from './keypress'
export * from './spinner'
export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))
export class CliError extends Error {}
export * from './check_node_version'
