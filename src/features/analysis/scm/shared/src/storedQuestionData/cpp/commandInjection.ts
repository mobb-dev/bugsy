export const commandInjection = {
  isUnixShellCommandPart: {
    content: () =>
      'Is the input data interpolated into a shell command (not the program name or shell structure)?',
    description:
      () => `\`system()\` / \`popen()\` hand the whole string to \`/bin/sh -c\`. Answer **yes** when the input is *data* placed into a fixed command, for example:

- \`sprintf(cmd, "grep %s file.txt", input); system(cmd);\`
- \`sprintf(cmd, "ping -c 5 %s", input); system(cmd);\`

Answer **no** (the input is not plain data) when the input is:

1. The program/executable itself:
  - \`system(input);\`
  - \`sprintf(cmd, "%s -x", input);\`
2. A command after a pipe or redirect:
  - \`sprintf(cmd, "cat file.txt | %s", input);\`
3. A part of a non-Unix or cross-platform shell command.
4. A part of embedded code in another language:
  - \`sprintf(cmd, "php -r \\"echo '%s';\\"", input);\`
  - \`sprintf(cmd, "awk '%s' file", input);\`
5. A flag/option that controls a tool's behaviour:
  - \`sprintf(cmd, "git --upload-pack %s", input);\``,
    guidance: () =>
      'If yes and the command can run without a shell, it is rewritten to a no-shell argument-vector call (`posix_spawn`); if it needs the shell, the tainted argument is escaped in place so the shell keeps working. If the answer is no (the input controls the program or shell structure), there is no safe automatic rewrite, so the fix is withheld and the sink is left for manual review.',
  },
  executableLocationPath: {
    content: () =>
      'What is the absolute path of the directory containing the executable?',
    description:
      () => `When \`system()\` is rewritten to an \`execv()\` argument-vector call, the program is run by its path with **no \`$PATH\` search**, so a relative program name (e.g. \`tail\`) cannot be resolved and a poisoned \`PATH\` cannot be used to run a look-alike binary.

Provide the absolute directory that contains the executable (e.g. \`/usr/bin\`); the fix prepends it to the bare program name to form an absolute path.`,
    guidance: () =>
      'Only asked when the program name in the command has no `/`. A program that is already an absolute or relative path (contains `/`) is used as written.',
  },
}
