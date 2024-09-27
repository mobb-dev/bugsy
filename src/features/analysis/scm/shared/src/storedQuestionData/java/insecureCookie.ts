export const insecureCookie = {
  insecureCookie: {
    content: () =>
      'Will this cookie be used only in encrypted channels (https)?',
    description:
      () => `When a cookie is marked as "secure" in a web environment, it means that the cookie should only be sent over secure, encrypted connections, like HTTPS.
    In environments like local development or test, setting cookies as secure might have some consequences:\
    
    \n&nbsp;\
    
    - Development Convenience: When developing locally, you might not always have HTTPS set up, as it often involves 
    additional configuration and certificates. If cookies are marked as secure, 
    they won't be sent over HTTP, and this could potentially interfere with the normal 
    functioning of your application during development.\
    
    \n&nbsp;\
    
    - Testing for Secure Environments: If your application relies on secure cookies, you should ensure that your 
    testing environment accurately simulates the production environment's security features. 
    This may involve setting up HTTPS in your local development environment.\
    
    \n&nbsp;\
    
    - Debugging Challenges: Debugging may be more challenging when using secure cookies in a 
    development environment, especially if you need to inspect or manipulate the cookies during 
    development.`,
    guidance: () => '',
  },
  cookieVarName: {
    content: () => 'Please define a variable name',
    description: () => `We need a variable for the new cookie instance`,
    guidance: () => '',
  },
}
