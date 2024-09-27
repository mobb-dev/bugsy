export const xxe = {
  netVersionGreaterOrEqual4: {
    content: () => 'Is your target framework .NET 4.0.0 or greater?',
    description: () => '',
    guidance: ({ userInputValue }: { userInputValue: string }) => {
      switch (userInputValue) {
        case 'yes':
          return 'We set `DtdProcessing` to `DtdProcessing.Prohibit` in order to prevent DTD parsing.'
        default:
          return 'We set `ProhibitDtd` to `true` in order to prevent DTD parsing.'
      }
    },
  },
}
