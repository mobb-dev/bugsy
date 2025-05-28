export const mobbCliCommand = {
  addScmToken: 'add-scm-token',
  scan: 'scan',
  analyze: 'analyze',
  review: 'review',
  convertToSarif: 'convert-to-sarif',
  mcp: 'mcp',
} as const

type MobbCliCommandType = typeof mobbCliCommand
export type MobbCliCommand = MobbCliCommandType[keyof typeof mobbCliCommand]
