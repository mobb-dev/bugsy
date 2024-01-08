export const mobbCliCommand = {
  scan: 'scan',
  analyze: 'analyze',
  review: 'review',
} as const

type MobbCliCommandType = typeof mobbCliCommand
export type MobbCliCommand = MobbCliCommandType[keyof typeof mobbCliCommand]
