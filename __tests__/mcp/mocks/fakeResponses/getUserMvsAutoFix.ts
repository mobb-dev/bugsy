// Mock responses for GetUserMvsAutoFix GraphQL query

export const mockGetUserMvsAutoFixEnabled = {
  data: {
    user_email_notification_settings: [
      {
        mvs_auto_fix: true,
      },
    ],
  },
}

export const mockGetUserMvsAutoFixDisabled = {
  data: {
    user_email_notification_settings: [
      {
        mvs_auto_fix: false,
      },
    ],
  },
}

export const mockGetUserMvsAutoFixNoSettings = {
  data: {
    user_email_notification_settings: [],
  },
}

export const mockGetUserMvsAutoFixError = {
  errors: [
    {
      message: 'Failed to fetch user mvs_auto_fix setting',
      extensions: {
        code: 'INTERNAL_ERROR',
      },
    },
  ],
}
