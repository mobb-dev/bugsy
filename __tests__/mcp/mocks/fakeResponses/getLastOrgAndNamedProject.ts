export const mockGetLastOrgAndNamedProject = {
  data: {
    user: [
      {
        id: 'test-user-id',
        userOrganizationsAndUserOrganizationRoles: [
          {
            id: 'test-user-org-role-id',
            organization: {
              id: 'test-org-id',
              projects: [
                {
                  id: 'test-project-id-1',
                  name: 'MCP Scans',
                },
              ],
            },
          },
        ],
      },
    ],
  },
}

export const mockGetLastOrgAndNamedProjectError = (message: string) => ({
  errors: [
    {
      message: message || 'Project Error',
    },
  ],
})

export const mockGetLastOrgAndNamedProjectProjectNotFound = {
  data: {
    user: [
      {
        id: 'test-user-id',
        userOrganizationsAndUserOrganizationRoles: [
          {
            id: 'test-user-org-role-id',
            organization: {
              id: 'test-org-id',
              projects: [],
            },
          },
        ],
      },
    ],
  },
}
