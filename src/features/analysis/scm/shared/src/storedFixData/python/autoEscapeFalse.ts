export const autoEscapeFalse = {
  guidance:
    () => `This fix enables automatic escaping for HTML. When that's enabled, everything is escaped by default except for values explicitly marked as safe. Variables and expressions can be marked as safe either in:\n
a. The context dictionary by the application with \`markupsafe.Markup\`\n
b. The template, with the \`|safe\` filter.
\n&nbsp;
\n
See more information [here](https://jinja.palletsprojects.com/en/3.1.x/templates/#working-with-automatic-escaping) and [here](https://pypi.org/project/MarkupSafe/).
\n&nbsp;
\n
***Note: make sure that none of the data you're marking as safe is coming from user input, as this can lead to XSS vulnerabilities!***`,
}
