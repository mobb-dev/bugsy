export const ssrf = {
  domainsAllowlist: {
    content: () => 'List of allowed domain names',
    description:
      () => `The security risk of this issue is the ability of an attacker to provide input that shoots HTTP requests from your server to arbitrary domains.
    \n&nbsp;\
    \n&nbsp;\
    To eliminate the risk and fix the issue, check out your app logic and make a whitelist of domains the server should be allowed to call.`,
    guidance: () => '',
  },
}
