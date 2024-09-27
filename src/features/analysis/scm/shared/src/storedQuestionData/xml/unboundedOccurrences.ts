export const unboundedOccurrences = {
  maxOccursLimit: {
    content: () => 'The number of allowed repetitions of the element.',
    description: () => '',
    guidance:
      () => `Setting this number to a reasonable value will prevent the attack. 
A value too low will prevent valid XMLs from being processed. 
A value too high will cause performance issues up to and including denial of service.`,
  },
}
