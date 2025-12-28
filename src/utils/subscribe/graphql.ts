export type GetGraphQlHeadersOptions =
  | { isAdmin: true; isApiKey: false; adminPassword: string }
  | { isAdmin: false; isApiKey: false; accessToken: string }
  | { isAdmin: false; isApiKey: true; apiKey: string }
  | { type: 'apiKey'; apiKey: string }
  | { type: 'token'; token: string }

export function getGraphQlHeaders(options: GetGraphQlHeadersOptions) {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  // Handle new-style auth patterns
  if ('type' in options) {
    if (options.type === 'apiKey') {
      headers['x-mobb-key'] = options.apiKey
    } else if (options.type === 'token') {
      headers['Authorization'] = `Bearer ${options.token}`
    }
    return headers
  }

  // Handle legacy auth patterns
  if ('isAdmin' in options && options.isAdmin) {
    headers['x-hasura-access-key'] = options.adminPassword
  } else if ('isApiKey' in options && options.isApiKey) {
    headers['x-mobb-key'] = options.apiKey
  } else if ('accessToken' in options) {
    headers['Authorization'] = `Bearer ${options.accessToken}`
  }

  return headers
}
