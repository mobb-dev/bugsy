export const openRedirect = {
  isExternal: {
    content: () => 'Does the redirect go to an external site?',
    description: () => '',
    guidance: () => '',
  },
  domainAllowlist: {
    content: () => 'Allowed domains names',
    description: () =>
      'please provide a coma separated list of allowed domains names (example.com, example.org, etc.)',
    guidance: () => '',
  },
  pathAllowlist: {
    content: () => 'Allowed paths (URIs)',
    description: () =>
      'please provide a coma separated list of allowed path (/health, /api/v1/health, etc.)',
    guidance: () => '',
  },
  includeProtocolValidation: {
    content: () => 'Should HTTP or HTTPS protocol be enforced?',
    description: () => 'please indicate if the protocol should be enforced',
    guidance: () => '',
  },
}
