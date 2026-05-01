export const j2eeGetConnection = {
  guidance:
    () => `This fix replaces direct \`DriverManager.getConnection(...)\` calls with a container-managed JNDI \`DataSource\` lookup. \
The new code expects the app server (Tomcat / WildFly / WebSphere / etc.) to expose a configured connection pool under the JNDI name you specified.

\n&nbsp;

***Make sure the resource pool exists before merging.*** The patched code will throw a \`NamingException\` at runtime if the JNDI name does not resolve. Configure it in your container's resource definition:

- **Tomcat**: declare a \`<Resource>\` element in \`context.xml\` (or per-app \`META-INF/context.xml\`) with the same JNDI name, plus \`url\`, \`username\`, \`password\`, \`driverClassName\`, and any pool sizing.
- **Spring Boot (embedded Tomcat)**: configure via \`spring.datasource.jndi-name\` and matching \`<Resource>\`, or use \`@ConfigurationProperties\` to bind a \`DataSource\` bean.
- **WildFly / JBoss EAP**: declare a \`<datasource>\` in the standalone/domain XML and reference its JNDI binding.
- **WebSphere / WebLogic**: define the JDBC provider and data source through the admin console; bind it to the JNDI name.

\n&nbsp;

Also add a matching \`<resource-ref>\` (or \`<data-source>\`) in your \`WEB-INF/web.xml\` if you use one. The original connection details (URL, user, password) move from the call site into the resource definition — remove them from any constants / properties files where they were duplicated.

\n&nbsp;

This fix is mandated by the J2EE / Jakarta EE specification (CWE-245) — direct driver management bypasses the container's pooling, retry, and failover policies.`,
}
