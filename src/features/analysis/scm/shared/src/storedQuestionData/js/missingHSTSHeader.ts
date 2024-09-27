export const headerMaxAge = {
  headerMaxAge: {
    content: () => 'Please provide the maximum age of the header',
    description:
      () => `This is the time, in seconds, that the browser should remember that the site is only to be accessed using \`HTTPS\`.\
    \n&nbsp;\
    \n&nbsp;\
 
    Setting the \`max-age\` to \`0\` (over an https connection) will immediately expire the Strict-Transport-Security header, allowing access via \`HTTP\`.

    \n&nbsp;\
    \n&nbsp;\

    The HTTP Strict-Transport-Security response header (\`HSTS\`) informs browsers that the site 
    should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically 
    be converted to HTTPS.

    \n&nbsp;\
    \n&nbsp;\

    If a website accepts a connection through \`HTTP\` and redirects to \`HTTPS\`, visitors may initially communicate with 
    the non-encrypted version of the site before being redirected, if, for example, the visitor 
    types \`http://www.example.com\` or even just \`example.com\`. This creates an opportunity for a man-in-the-middle attack. 
    The redirect could be exploited to direct visitors to a malicious site instead of the secure version of the original site.\

    \n&nbsp;\
    \n&nbsp;\

    The \`HTTP\` Strict Transport Security header informs the browser that it should never load a site using \`HTTP\` 
    and should automatically convert all attempts to access the site using \`HTTP\` to \`HTTPS\` requests instead.`,
    guidance: () => ``,
  },
}
