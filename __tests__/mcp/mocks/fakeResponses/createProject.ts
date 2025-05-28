export const mockCreateProject = {
  data: {
    createProject: {
      projectId: 'test-new-project-id',
    },
  },
}

export const mockCreateProjectError = (message: string) => ({
  errors: [
    {
      message: message || 'Create Project Error',
    },
  ],
})
