export const mockMe = {
  data: {
    me: {
      id: 'test-user-id',
      email: 'test@example.com',
      userOrganizationsAndUserOrganizationRoles: [
        {
          organization: {
            brokerHosts: [],
          },
        },
      ],
      scmConfigs: [
        {
          id: 'test-scm-config-id',
          orgId: null,
          refreshToken: null,
          scmType: 'GitHub',
          scmUrl: 'https://github.com',
          scmUsername: null,
          token: 'test-token',
          tokenLastUpdate: null,
          userId: 'test-user-id',
          scmOrg: null,
          isTokenAvailable: true,
        },
      ],
    },
  },
}

export const mockMeConnectionError = {
  errors: [
    {
      message: 'Network error',
      extensions: {
        code: 'NETWORK_ERROR',
      },
    },
  ],
}

export const mockMeFetchError = () => {
  const error = new Error(
    'FetchError: request to http://localhost:3001/graphql failed'
  )
  error.name = 'FetchError'
  return error
}

export const mockMeError = (message: string) => ({
  errors: [
    {
      message,
      extensions: {
        code: 'INTERNAL_ERROR',
      },
    },
  ],
})
