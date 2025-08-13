export const noNewPrivileges = {
  requireNewPrivileges: {
    content: () => 'Does the container require new privileges?',
    description: () => '',
    guidance: () =>
      `If the container requires new privileges, setting the no-new-privileges option might harm the container functionality.`,
  },
}
