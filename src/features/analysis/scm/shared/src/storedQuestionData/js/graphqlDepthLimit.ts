export const graphqlDepthLimit = {
  depthLimit: {
    content: () => 'Please define a maximum query depth',
    description:
      () => `Setting this number to a reasonable value will prevent the attack.
Make sure to pick a value large enough to allowed the nessecary amount of nested queries.`,
    guidance: () => {
      return 'We use `graphql-depth-limit` npm package to limit the depth of nested queries. Please make sure you install the package using `npm install graphql-depth-limit`.'
    },
  },
}
