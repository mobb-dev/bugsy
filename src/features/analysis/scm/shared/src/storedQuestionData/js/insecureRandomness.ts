export const insecureRandomness = {
  isGetRandomValuesSupported: {
    content: () =>
      'Is getRandomValues() function supported by your JavaScript engine?',
    description: () =>
      '[getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) is supported by [more than 97% of browsers](https://caniuse.com/?search=getRandomValues) and [Node.js >= 15.0.0](https://nodejs.org/api/webcrypto.html#cryptogetrandomvaluestypedarray).',
    guidance: () => '',
  },
}
