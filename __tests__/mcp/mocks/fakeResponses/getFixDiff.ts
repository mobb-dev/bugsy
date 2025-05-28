export const mockGetFixDiff = {
  data: {
    fixData: {
      __typename: 'FixData' as const,
      patch: 'mock-patch-content',
      patchOriginalEncodingBase64: 'bW9jay1wYXRjaC1jb250ZW50',
      extraContext: {
        __typename: 'FixExtraContextResponse' as const,
        fixDescription: 'Mock fix description',
        isFalsePositive: false,
        extraContext: [],
        manifestActionsRequired: [],
      },
      questions: [],
    },
  },
}
