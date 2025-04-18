export const logForging = {
  isHtmlDisplay: {
    content: () =>
      'Is the text written to the log going to be displayed as HTML?',
    description: () => '',
    guidance: ({ userInputValue }: { userInputValue: string }) => {
      switch (userInputValue) {
        case 'yes':
          return 'We use `html.escape` to decode the HTML'
        default:
          return ''
      }
    },
  },
}
