export const mobbCliCommand = {
  addScmToken: 'add-scm-token',
  scan: 'scan',
  analyze: 'analyze',
  review: 'review',
  convertToSarif: 'convert-to-sarif',
  mcp: 'mcp',
  uploadAiBlame: 'upload-ai-blame',
} as const

type MobbCliCommandType = typeof mobbCliCommand
export type MobbCliCommand = MobbCliCommandType[keyof typeof mobbCliCommand]

export const ScanContext = {
  FULL_SCAN: 'FULL_SCAN',
  BACKGROUND_PERIODIC: 'BACKGROUND_PERIODIC',
  BACKGROUND_INITIAL: 'BACKGROUND_INITIAL',
  USER_REQUEST: 'USER_REQUEST',
  BUGSY: 'BUGSY',
} as const

type ScanContextType = typeof ScanContext
export type ScanContext = ScanContextType[keyof typeof ScanContext]
