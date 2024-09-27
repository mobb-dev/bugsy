export const pt = {
  taintedTermType: {
    content: ({ expression }: { expression: string }) =>
      `Does \`${expression}\` represent a file name, a relative path or an absolute path?`,
    description: ({ expression }: { expression: string }) =>
      `We replace all illegal file name characters for Unix, Windows, and macOS operation systems, including slashes. Ensure that \`${expression}\` isn't supposed to contain slashes or other illegal file name characters.`,
    guidance: () => '',
  },
}
