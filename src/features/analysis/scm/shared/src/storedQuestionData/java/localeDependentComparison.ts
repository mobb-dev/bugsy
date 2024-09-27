export const localeDependentComparison = {
  localeType: {
    content: ({ variable }: { variable: string }) =>
      `Is ${variable} locale dependent?`,
    description:
      () => `Select "locale insensitive" for string comparisons that are not dependent on the locale.\n
    Select "default locale" for string comparisons that uses the default locale.\n
    Select "custom locale" for string comparisons that are dependent on a specific locale language.`,
    guidance: () => '',
  },
  customLocaleLanguage: {
    content: () => 'What is your locale language?',
    description: () =>
      'A list of locales can be found [here](https://www.oracle.com/java/technologies/javase/jdk8-jre8-suported-locales.html)',
    guidance: () => '',
  },
  customLocaleCountry: {
    content: () => 'What is your locale country?',
    description: () =>
      'A list of locales can be found [here](https://www.oracle.com/java/technologies/javase/jdk8-jre8-suported-locales.html)',
    guidance: () => '',
  },
}
