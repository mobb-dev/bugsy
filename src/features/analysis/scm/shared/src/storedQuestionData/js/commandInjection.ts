export const commandInjection = {
  isCommandExecutable: {
    content: () =>
      'Commands can be intrinsically unsafe if they call out to other executables or run arbitary code',
    description:
      () => `Does the command fall into one of the following categories:

1. An executable name:
  - \`exec(input);\`
  - \`exec("/bin/bash " + input);\`
  - \`exec("/bin/sh -c" + input + " param");\`
  - \`exec("/bin/bash -c cat file.txt | " + input);\`
  - \`exec("/usr/bin/git --upload-pack " + input);\`
2. A part of non-unix or cross platform shell command:
  - \`exec("cmd.exe /c ping " + input);\`
3. A part of programming language code:
  - \`exec("php -r echo '" + input + "';");\`
  - \`exec("perl -e print '" + input + "'");\``,
    guidance: () => '',
  },
}
