export const cspHeaderValue = {
  cspHeaderValue: {
    content: () =>
      'Please provide the value for the Content-Security-Policy header',
    description:
      () => `The Content-Security-Policy (CSP) header is a critical security measure that helps protect websites from various attacks, particularly Cross-Site Scripting (XSS) and other code injection attacks. Here's a concise explanation:\

    \n&nbsp;\
    \n&nbsp;\

    **What it does**:\

    \n&nbsp;\
    \n&nbsp;\

    CSP lets you specify which content sources the browser should consider valid, essentially creating a whitelist of trusted content. It controls things like:\

    \n&nbsp;\
    \n&nbsp;\

    - Which scripts can execute.\
    \n&nbsp;\
    - Where images can be loaded from.\
    \n&nbsp;\
    - Which styles can be applied.\
    \n&nbsp;\
    - Which forms can be submitted to.\
    \n&nbsp;\
    - What domains can be connected to.\
    \n&nbsp;\
    \n&nbsp;\
    Default value explanation:\
    \n&nbsp;\
    \n&nbsp;\
    - default-src 'self: Only allows resources from the same origin by default.\
    \n&nbsp;\
    - script-src 'self': Only allows scripts to be loaded from the same origin.\
    \n&nbsp;\
    - style-src 'self': Only allows styles from the same origin.\
    \n&nbsp;\
    - object-src 'none': Disallows <object>, <embed>, and <applet> elements.\
    \n&nbsp;\
    - base-uri 'self': Restricts where the <base> tag can point to.\
    \n&nbsp;\
    - frame-ancestors 'self': Ensures that only the same origin can embed the page using an iframe.
    \n&nbsp;\
    \n&nbsp;\
    **This kind of \`CSP\` is more secure but may require adjustments for your specific application, especially if you need to load resources from external domains or use inline scripts/styles.**`,
    guidance: () => ``,
  },
}
