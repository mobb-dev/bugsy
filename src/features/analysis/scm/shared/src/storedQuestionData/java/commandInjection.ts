export const commandInjection = {
  isUnixShellCommandPart: {
    content: () => 'Is the input part of Unix shell command?',
    description: () => `For example:

- \`Runtime.getRuntime().exec(new String[] {"/bin/sh", "-c", "ping -t 5 -c 5 " + input});\`
- \`Runtime.getRuntime().exec(new String[] {"/bin/bash", "-c", "curl " + input + " > file.txt"});\`

Make sure the input is not:

1. An executable name:
  - \`Runtime.getRuntime().exec(input);\`
  - \`Runtime.getRuntime().exec(new String[] {"/bin/bash", input});\`
  - \`Runtime.getRuntime().exec(new String[] {"/bin/sh", "-c", input + " param"});\`
  - \`Runtime.getRuntime().exec(new String[] {"/bin/bash", "-c", "cat file.txt | " + input});\`
  - \`Runtime.getRuntime().exec(new String[] {"/usr/bin/git", "--upload-pack", input});\`
2. A part of non-unix or cross platform shell command:
  - \`Runtime.getRuntime().exec(new String[] {"cmd.exe", "/c", "ping " + input});\`
3. A part of programming language code:
  - \`Runtime.getRuntime().exec(new String[] {"php", "-r", "echo '" + input + "';"});\`
  - \`Runtime.getRuntime().exec(new String[] {"perl", "-e", "print '" + input + "'"});\``,
    guidance: () => '',
  },
  installApacheCommonsText: {
    content: () =>
      'Is the Apache Commons library (org.apache.commons) included in your project, if not, can you add it?',
    description: () =>
      'Apache Commons Text is a library focused on algorithms working on strings.',
    guidance: ({ userInputValue }: { userInputValue: string }) =>
      userInputValue === 'yes'
        ? 'To add the library, modify your pom.xml or build.gradle to include the library. You can find the latest version here https://mvnrepository.com/artifact/org.apache.commons/commons-text'
        : '',
  },
  cmdAllowlist: {
    content: () => 'Allowed Commands',
    description: () =>
      'Make sure that the list of commands is separated by commas.',
    guidance: () => '',
  },
}
