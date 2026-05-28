export const unsafeReflection = {
  classAllowlist: {
    content: () => 'Allowed class names for reflection',
    description: () =>
      `Provide a comma-separated list of fully-qualified class names that are permitted to be loaded via reflection (e.g. \`com.example.MyClass\`). Any other class name will be rejected at runtime.`,
    guidance: () => '',
  },
}
