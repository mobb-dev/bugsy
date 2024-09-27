export const ssrf = {
  domainsAllowlist: {
    content: () => 'Allowed URL prefixes',
    description:
      () => `The security risk of this issue is the ability of an attacker to provide input that shoots HTTP requests from your server to arbitrary URLs, including internal ones, like \`https://admin.mycompany.com\`\
    \n&nbsp;\
    \n&nbsp;\
    To eliminate the risk and fix the issue, check out your app logic and make a whitelist of URLs this API should be allowed to call.`,
    guidance: () => '',
  },
}
