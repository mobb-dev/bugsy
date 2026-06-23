export const pathManipulation = {
  baseDirectory: {
    content: ({ expression }: { expression: string }) =>
      `Which directory must \`${expression}\` stay within? Enter the absolute base directory file access is restricted to.`,
    description: ({ expression }: { expression: string }) =>
      `The fix canonicalizes \`${expression}\` (resolving \`.\`, \`..\`, and symlinks) and verifies the result stays inside this base directory. Provide the **absolute** root the application is allowed to read or write under, for example \`/var/app/data\`. The directory must exist at runtime. A path that resolves outside it is rejected at runtime.`,
    guidance: (_: { expression: string }) =>
      'You **must** set this to an absolute path that exists at runtime and that your application confines file access to. If you leave it unset (or give a relative path), the generated fix is emitted with a placeholder identifier (`MOBB_SET_ALLOWED_BASE_DIR`) that **deliberately does not compile**, so a missing security boundary cannot be overlooked — replace it with your absolute base directory. A relative path would otherwise resolve against the process working directory (moving the boundary). At runtime the guard aborts (C: `exit(EXIT_FAILURE)`) / throws (C++: `std::runtime_error`) on a path that escapes the base. Pick the narrowest directory that still contains every legitimate file the code opens.',
  },
}
