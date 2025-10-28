export const xss = {
  containsHtml: {
    content: () => 'Does the element or variable contain HTML formatting',
    description: () => '',
    guidance: () => '',
  },
  isParamTypeString: {
    content: () => 'Is the parameter passed to the $() function a string',
    description: () => '',
    guidance: () => '',
  },
  isSanitized: {
    content: ({ expression }: { expression: string }) =>
      `Is the expression \`${expression}\` supposed to be not sanitized in this context?`,
    description: () =>
      'You are using unsafe string substitution in the template. This means that if the expression can contain maliciously crafted data, it may lead to XSS injection. To apply the fix, you have to make sure the expression is not sanitized on the backend already, and it does not represent an HTML code block.',
    guidance: () => '',
  },
  isServerSideCode: {
    content: () =>
      'Is this code running on the server side (a NodeJS application)',
    description: () =>
      'The fix to this vulnerability is different is the code runs in the client (browser) or the server side (NodeJs)',
    guidance: () => '',
  },
}
