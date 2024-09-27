export const openRedirect = {
  isExternal: {
    content: () => 'Does the redirect go to an external site',
    description: () => '',
    guidance: () => '',
  },
  allowlist: {
    content: () => 'Allowed domains/paths',
    description: () =>
      'If external, provide a coma separated list of allowed domains. If internal, provide a coma seperated list of allowed paths',
    guidance: () => '',
  },
}
