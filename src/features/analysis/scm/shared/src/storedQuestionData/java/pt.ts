export const pt = {
  isPathRelativeOnly: {
    content: ({ expression }: { expression: string }) =>
      `Do you expect \`${expression}\` to be a relative path?`,
    description: () =>
      "You most likely want to serve files relative to the web server's static files folder in web applications. If so, your answer should be `yes`. In CLI applications, you probably would like to give the user more flexibility and allow them to specify absolute paths to any location on the disk – your answer should be `no` in such cases.",
    guidance: () => '',
  },
  isFileName: {
    content: ({ expression }: { expression: string }) =>
      `Does \`${expression}\` represent a file name or a file name part?`,
    description: ({ expression }: { expression: string }) =>
      `We replace all illegal file name characters for Unix, Windows, and macOS operation systems, including slashes. Ensure that \`${expression}\` isn't supposed to contain slashes or other illegal file name characters. If  \`${expression}\` is supposed to legitimately include such characters, the answer should be "no".`,
    guidance: () => '',
  },
}
