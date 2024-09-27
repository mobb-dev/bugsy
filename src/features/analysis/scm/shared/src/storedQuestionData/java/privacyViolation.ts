export const privacyViolation = {
  remediation_option: {
    content: () => 'Preferred fix solution',
    description: () => `
      - Completely Remove the log message
      - Replace the sensitive data with the string [Redacted]
      - SHA 256 Hash the sensitive information in the log message`,
    guidance: () => '',
  },
}
