export const ssrf = {
  guidance: () =>
    'The server-side validates the domains it has access to, otherwise it throws an error if validation failed. Please make sure you handled the error correctly.',
}
