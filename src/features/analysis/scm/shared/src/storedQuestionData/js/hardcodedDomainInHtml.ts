export const hardcodedDomainInHtml = {
  isCDNFixedVersion: {
    content: ({ url }: { url: string }) =>
      `Does the content of \`${url}\` change over time? If it does, we can't offer this fix.`,
    description: () =>
      'You need to make sure the content of the file you are loading from the external source is persistent. To guarantee the integrity hash does not change over time, please make sure you use a proper CDN and version of the script you are loading is pinned.',
    guidance: () => '',
  },
}
