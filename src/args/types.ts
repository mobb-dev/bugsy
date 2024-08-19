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
  organizationId?: string
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
  p: string
  srcPath?: string
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
  organizationId?: string
}

export type AddScmTokenOptions =
  Yargs.ArgumentsCamelCase<BaseAddScmTokenOptions>

export type BaseAddScmTokenOptions = {
  scmType?: string
  url: string
  token: string
  organization?: string
  refreshToken?: string
  apiKey?: string
}
