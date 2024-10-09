export const httpOnlyCookie = {
  httpOnlyCookie: {
    content: () =>
      'Is the cookie value supposed to be exposed to client-side scripting code?',
    description: () => httpOnlyMessage,
    guidance: () => '',
  },
  cookieVarName: {
    content: () => 'Please define a variable name',
    description: () => `We need a variable for the new cookie instance`,
    guidance: () => '',
  },
}

const httpOnlyMessage = `\`HttpOnly\` is a security feature for cookies that can be set by a web server 
      when sending a Set-Cookie header in an HTTP response. When the HTTP Only flag is set for a cookie, it means that the cookie can only 
      be accessed and modified by the server, and client-side scripts (like JavaScript) running in the browser are not allowed to access the cookie.\
      
      \n&nbsp;
    
      \n***If your client-site application needs to access the value of this cookie, making this change might break the application logic.***  
      \n&nbsp;\n\n`