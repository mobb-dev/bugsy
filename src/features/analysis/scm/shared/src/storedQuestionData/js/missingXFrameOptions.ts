export const xFrameOptionsValue = {
  xFrameOptionsValue: {
    content: () => 'Please provide the value for the X-Frame-Options header',
    description:
      () => `The \`X-Frame-Options\` HTTP response header tells the browser whether the page is allowed to be rendered inside a \`<frame>\`, \`<iframe>\`, \`<embed>\` or \`<object>\`. Without it, attackers can embed your application in an invisible iframe and trick users into clicking on it — a class of attacks known as clickjacking (UI redressing).\
    \n&nbsp;\
    \n&nbsp;\
    **Allowed values:**\
    \n&nbsp;\
    - \`DENY\` — the page cannot be framed by any site, including your own. Recommended default for any page that does not need to be embedded.\
    \n&nbsp;\
    - \`SAMEORIGIN\` — the page can only be framed by pages served from the same origin. Use this only if your own application legitimately embeds this page in an iframe.`,
    guidance: () => ``,
  },
}
