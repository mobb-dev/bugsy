export const xss = {
  isHtmlOrSafeAttribute: {
    content: ({ tainted_variable }: { tainted_variable: string }) =>
      `Where is \`${tainted_variable}\` written to?`,
    description: () => `Answer examples:

- a text in an HTML tag or a value of a safe HTML attribute:
    - \`<li><%= name %></li>\`
    - \`<div>Name: <%= name %></div>\`
    - \`<input value="<%= name %>" name="name"/>\`
    - \`<div data-name="<%= name %>"></div>\`
- a JavaScript code block:
    - \`<script>const name = "<%= name %>";</script>\`
- an event attribute of an HTML tag:
    - \`<a onclick="alert('<%= name %>')">click me</a>\`
    - \`<img onmouseover="alert('<%= name %>')"/>\`
- a src-like attribute of an HTML tag:
    - \`<a href="/user/<%= name %>">me</a>\`
    - \`<img src="/img/<%= name %>"/>\`
    - \`<form action="<%= name %>"></form>\`
    - \`<iframe srcdoc="<%= name %>"/>\`
- a part of an HTML tag attributes list:
    - \`<a <%= name %>>text</a>\`

See more details about safe and unsafe HTML attributes:
- [PortSwigger cheat-sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- [DOMPurify attributes filter implementation](https://github.com/cure53/DOMPurify/blob/c29aa900a1c286b82ee4f48a7ffab96cab3e84fa/src/attrs.js)
`,
    guidance: () => '',
  },
  isHtmlEncoded: {
    content: () => 'Is the user input already encoded as HTML text?',
    description: () =>
      'If you are unsure, we will decode the user input and encode it again to ensure it is safe and the data is kept the same.',
    guidance: () => '',
  },
  htmlEscapingLib: {
    content: () => 'Which HTML escaping library would you like to use?',
    description: () => `
  - If you use the Spring framework, you likely already have \`org.springframework.web.util.HtmlUtils\`
  - Another \`option is org.apache.commons.text.StringEscapeUtils\``,
    guidance: () => '',
  },
}
