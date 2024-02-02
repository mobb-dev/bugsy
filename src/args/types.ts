import type * as Yargs from 'yargs'

import { Scanner } from '../constants'

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
  githubToken?: string
  mobbProjectName?: string
}

export type ReviewOptions = Yargs.ArgumentsCamelCase<BaseReviewOptions>

export type BaseReviewOptions = {
  f: string
  scanFile?: string
  scanner: Scanner
  r: string
  repo: string
  ref: string
  ['api-key']: string
  apiKey?: string
  ch: string
  commitHash?: string
  mobbProjectName?: string
  'github-token': string
  githubToken?: string
  pullRequest?: number
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
  mobbProjectName?: string
  cxProjectName?: string
}

export type AddScmTokenOptions =
  Yargs.ArgumentsCamelCase<BaseAddScmTokenOptions>

export type BaseAddScmTokenOptions = {
  scm: string
  token: string
  organization?: string
  username?: string
  refreshToken?: string
  apiKey?: string
}
