export const mockGetOrgAndProjectId = {
  data: {
    organization_to_organization_role: [
      {
        organization: {
          id: 'test-org-id',
          projects: [
            {
              id: 'test-project-id-1',
              name: 'MCP Scans',
            },
            {
              id: 'test-project-id-2',
              name: 'Other Project',
            },
          ],
        },
      },
    ],
  },
}

export const mockGetOrgAndProjectIdError = (message: string) => ({
  errors: [
    {
      message: message || 'Project Error',
    },
  ],
})

export const mockGetOrgAndProjectIdProjectNotFound = {
  data: {
    organization_to_organization_role: [
      {
        organization: {
          id: 'test-org-id',
          projects: [], // Empty projects array to simulate project not found
        },
      },
    ],
  },
}
