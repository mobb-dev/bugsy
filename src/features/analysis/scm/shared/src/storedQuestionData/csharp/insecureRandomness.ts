export const insecureRandomness = {
  isRandomNumberGeneratorAvailable: {
    content: () =>
      'We use the `RandomNumberGenerator` class from the `System.Security.Cryptography` package. Does this class exist for the .NET version you use?',
    description: () =>
      'See [the official documentation](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.randomnumbergenerator?view=net-8.0#applies-to) for more details.',
    guidance: () => '',
  },
}
