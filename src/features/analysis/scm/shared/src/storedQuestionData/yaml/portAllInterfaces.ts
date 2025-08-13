export const portAllInterfaces = {
  trustedIP: {
    content: () => 'Enter trusted Network IP',
    description: () => '',
    guidance: () =>
      `Properly set this value to prevent access from untrusted network adapters. Setting this to a wrong value would prevent accessing the container and might break the system.`,
  },
}
