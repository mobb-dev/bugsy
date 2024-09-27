export const xss = {
  allowSpecialCharacters: {
    content: ({ source_value }: { source_value: string }) =>
      `Does your code allow encodable HTML characters like '&', '<', '"' etc. in: \`${source_value}\`?`,
    description: () => '',
    guidance: () => '',
  },
  containsHtml: {
    content: ({ prop_value }: { prop_value: string }) =>
      `Does your code allow having HTML tags in: \`${prop_value}\`?`,
    description: () => '',
    guidance: () => '',
  },
  netVersionGreaterOrEqual45: {
    content: () => 'Is your target framework .NET 4.5 or greater?',
    description: () => '',
    guidance: () => '',
  },
  useHTML4NamedEntities: {
    content: () => 'Would you like to use HTML 4.0 Named entities?',
    description: () =>
      'See [examples](https://www.w3schools.com/charsets/ref_html_entities_4.asp) and [full description](https://www.w3.org/TR/WD-html40-970708/sgml/entities.html)',
    guidance: () => '',
  },
}
