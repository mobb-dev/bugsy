import type { CreateCommunityUserMutation } from '../../../../src/features/analysis/scm/generates/client_generates'

export const mockCreateCommunityUser: { data: CreateCommunityUserMutation } = {
  data: {
    __typename: 'mutation_root',
    initOrganizationAndProject: {
      __typename: 'InitOrganizationAndProjectGoodResponse',
      projectId: 'project_123',
      userId: 'user_123',
      organizationId: 'org_123',
    },
  },
}

export const mockCreateCommunityUserError = (message: string) => ({
  data: null,
  errors: [
    {
      message,
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
  ],
})
