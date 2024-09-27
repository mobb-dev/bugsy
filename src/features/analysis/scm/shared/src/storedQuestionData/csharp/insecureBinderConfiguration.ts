export const insecureBinderConfiguration = {
  bindAttributeParam: {
    content: ({ func_param_name }: { func_param_name: string }) =>
      `Which properties of the model should be included in model binding for \`${func_param_name}\`?`,
    description: () =>
      'Provide a comma-separated list of valid property names to be included in model binding. See [the official documentation](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding?view=aspnetcore-8.0#bind-attribute) for more details.',
    guidance: () => '',
  },
}
