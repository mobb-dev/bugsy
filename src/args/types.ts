import type * as Yargs from 'yargs'

export type AnalyzeOptions = Yargs.ArgumentsCamelCase<BaseAnalyzeOptions>

export type BaseAnalyzeOptions = {
  f: string
  'scan-file'?: string
  r?: string
  repo: string
  p?: string
  srcPath?: string
  ref?: string
  commitHash?: string
  yes?: boolean
  apiKey?: string
  ci: boolean
}

export type ScanOptions = Yargs.ArgumentsCamelCase<BaseScanOptions>

export type BaseScanOptions = {
  r?: string
  repo: string
  ref?: string
  s?: string
  scanner?: string
  y?: boolean
  yes?: boolean
  apiKey?: string
  ci: boolean
  cxProjectName?: string
}
