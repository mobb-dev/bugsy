export const writableFilesystemService = {
  requireWriteAccess: {
    content: () => 'Does the container require writable filesystem access?',
    description: () => '',
    guidance: () =>
      `If the container requires writable filesystem access, setting the filesystem as readonly might harm the container functionality.`,
  },
}
