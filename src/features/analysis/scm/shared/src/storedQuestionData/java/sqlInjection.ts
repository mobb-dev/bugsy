function capitalizeFirstLetter(item: string) {
  return item.charAt(0).toUpperCase() + item.slice(1)
}

const typeToSetMethod = {
  integer: 'setInt',
  date: 'setDate',
  string: 'setString',
} as const

type UserInputValue = 'integer' | 'date' | 'string'

export const sqlInjection = {
  parameterType: {
    content: ({ tainted_term }: { tainted_term: string }) =>
      `What is the SQL Data Type of the \`${tainted_term}\` parameter?`,
    description: () =>
      'In order to make sure the statement is built correctly, we must ensure we use the same type that is defined for this parameter in the SQL table. If you are unsure of this type, please consult with your team.',
    guidance: ({
      tainted_term,
      taint_var_type_guidance_required,
      userInputValue,
    }: {
      tainted_term: string
      taint_var_type_guidance_required: { [key: string]: string }
      userInputValue: UserInputValue
    }) => {
      if (!taint_var_type_guidance_required || !userInputValue) {
        return ''
      }
      if (!taint_var_type_guidance_required[userInputValue]) {
        return ''
      }
      return `Make sure to convert \`${tainted_term}\` to \`${capitalizeFirstLetter(
        userInputValue
      )}\` which is the type expected by the new setter method: \`${
        typeToSetMethod[userInputValue]
      }\``
    },
  },
  varName: {
    content: () => 'Name the new PreparedStatement variable',
    description: () =>
      'We needed to create a new variable for this fix. We actually like the name we picked, but maybe you follow different naming conventions, so you can change it here.',
    guidance: () => '',
  },
  taintIndex: {
    content: ({ tainted_term }: { tainted_term: string }) =>
      `What is the index of \`\`\`${tainted_term}\`\`\` in the query?`,
    description: () =>
      'When constructing a query, we need to know exactly where to insert this parameter. If the query has more than one parameter, the index gives us this information. Leave the value as 1 if there is only one parameter.',
    guidance: () => '',
  },
  statementAfterQuery: {
    content: ({ var_name }: { var_name: string }) =>
      `Is the \`Statement\` variable \`${var_name}\` declared after constructing the query string?`,
    description: () =>
      "When creating the `PreparedStatement` parameter, we need to give it the constructed query. Currently, Mobb doesn't support the case where the query string is defined after the statement in your code.",
    guidance: ({ userInputValue }: { userInputValue: string }) =>
      userInputValue === 'no'
        ? 'You should move the code creating the query so it is executed before being used by the prepared statement'
        : '',
  },
  statementBeforeQuery: {
    content: ({ var_name }: { var_name: string }) =>
      `Is the query string variable declared after the \`Statement\` variable \`${var_name}\`?`,
    description: ({ enquote_func_name }: { enquote_func_name: string }) =>
      `We need to have the \`Statement\` object defined before using the \`${enquote_func_name}()\` method. Currently, Mobb doesn't support the case where the query string is defined before the statement in your code.`,
    guidance: ({
      userInputValue,
      enquote_func_name,
    }: {
      userInputValue: string
      enquote_func_name: string
    }) =>
      userInputValue === 'no'
        ? `You should move the code creating the query so it is executed after creating the \`Statement\` object as we need to have the \`Statement\` object defined before using the \`${enquote_func_name}()\` method.`
        : '',
  },
  containsControlCharacters: {
    content: ({ tainted_term }: { tainted_term: string }) =>
      `Does \`\`\`${tainted_term}\`\`\` represent a single SQL parameter value?`,
    description:
      () => `This should be 'no' only in the rare cases where the input variable itself does not represent a single SQL parameter value but rather other parts of a SQL query such as a table name, a column name, a list of values, a complete or partial inner SQL statement, etc.
      \nIt may be confusing a bit, so here are some examples:
      \n* A SQL identifier \`\`\`(SELECT * FROM \${tableName})\`\`\`
      \n* A SQL statement \`\`\`(SELECT * FROM users ORDER BY id \${order})\`\`\``,
    guidance: () => '',
  },
  javaVersionGreaterOrEqual19: {
    content: ({ enquote_func_name }: { enquote_func_name: string }) =>
      `Is \`java.sql.Statement.${enquote_func_name}\` method available in your runtime?`,
    description: ({ enquote_func_name }: { enquote_func_name: string }) =>
      `\`java.sql.Statement.${enquote_func_name}\` is supported in Java 1.9 or greater.`,
    guidance: () => '',
  },
  queryParameterName: {
    content: () => 'What should be the name of the query parameter?',
    description: () => '',
    guidance: () => '',
  },
}
