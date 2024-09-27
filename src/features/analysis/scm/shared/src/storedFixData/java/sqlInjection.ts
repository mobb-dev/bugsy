export const sqlInjection = {
  guidance: ({
    hasQuestionMarksAfterTaintVar,
  }: {
    hasQuestionMarksAfterTaintVar?: boolean
  }) => {
    if (hasQuestionMarksAfterTaintVar) {
      return 'Please make sure to correct the following indices of the setInt()/setString() calls after the new parameter is added.'
    }
    return ''
  },
}
