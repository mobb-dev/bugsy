export const websocketMissingOriginCheck = {
  minTlsVersion: {
    content: () =>
      'Please provide a comma-separated list of valid hosts. This list will serve as an allow list to check the connection `Origin` header.',
    description: () => '',
    guidance: () => '',
  },
}
