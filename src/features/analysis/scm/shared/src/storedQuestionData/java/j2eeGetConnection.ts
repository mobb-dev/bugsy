export const j2eeGetConnection = {
  jndiResourceName: {
    content: () =>
      'What JNDI name is the database connection pool registered under?',
    description: () =>
      'We need the JNDI name your app server uses to expose its container-managed `DataSource`. The fix performs `new InitialContext().lookup(<jndi-name>)` to retrieve the pool, so this value must exactly match the resource definition (e.g. `<Resource name="...">` in Tomcat `context.xml`, or the binding declared in WildFly / WebSphere / WebLogic). The default `java:comp/env/jdbc/myDataSource` is the canonical Tomcat / Spring convention; replace it with whatever your environment uses.',
    guidance: () => '',
  },
}
