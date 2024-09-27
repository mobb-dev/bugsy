export const systemInformationLeak = {
  guidance: ({
    clientMightBeAffected,
  }: {
    clientMightBeAffected?: boolean
  }) => {
    if (clientMightBeAffected) {
      return 'You should never expose error details to the client. We removed the error details from the response. Ensure the client application code does not rely on the removed information.'
    }
    return ''
  },
}
