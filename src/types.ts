export const mobbCliCommand = {
  scan: 'scan',
  analyze: 'analyze',
  review: 'review',
} as const

export type MobbCliCommand =
  (typeof mobbCliCommand)[keyof typeof mobbCliCommand]
