export const relativePathCommand = {
  executableLocationPath: {
    content: () =>
      'What is the absolute path of the directory containing the executable?',
    description: () =>
      'We need the absolute path to the executable to protect your application from command injection and ensure malicious actors cannot execute arbitrary commands on your system.',
    guidance: () => '',
  },
}
