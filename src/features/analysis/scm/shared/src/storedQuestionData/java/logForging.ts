export const logForging = {
  isHtmlDisplay: {
    content: () =>
      'Is the text written to the log going to be displayed as HTML?',
    description: () => '',
    guidance: () => '',
  },
  htmlEscapingLib: {
    content: () => 'Which HTML escaping library would you like to use?',
    description: () => `
  - If you use the Spring framework, you likely already have \`org.springframework.web.util.HtmlUtils\`
  - Another \`option is org.apache.commons.text.StringEscapeUtils\``,
    guidance: () => '',
  },
}
