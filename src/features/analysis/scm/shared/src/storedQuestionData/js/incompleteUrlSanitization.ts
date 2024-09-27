export const incompleteUrlSanitization = {
  allowedRootDomain: {
    content: () => 'The root domain of your application',
    description: () =>
      'We needed to strengthen the security check by ensuring that the url is under the root domain of your application.',
    guidance: () => '',
  },
}
