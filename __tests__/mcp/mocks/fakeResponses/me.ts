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
      message: 'Failed to connect to the API. Please check your MOBB_API_KEY',
      extensions: {
        code: 'NETWORK_ERROR',
      },
    },
  ],
}

export const mockMeFetchError = () => {
  const error = new Error(
    'FetchError: Failed to connect to the API. Please check your MOBB_API_KEY'
  )
  error.name = 'FetchError'
  return error
}

export const mockMeAccessDenied = {
  errors: [
    {
      message: 'Authentication hook unauthorized',
      extensions: {
        code: 'access-denied',
      },
    },
  ],
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
