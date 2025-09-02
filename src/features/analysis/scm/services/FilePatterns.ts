// Exclusion patterns for files that have supported extensions but should still be excluded
// All patterns with unsupported extensions are automatically filtered out by SUPPORTED_EXTENSIONS
export const EXCLUDED_FILE_PATTERNS = [
  // Minified and bundled files (have supported extensions but should be excluded)
  '.min.js',
  '.min.html',
  '.bundle.js',
  '.chunk.js',

  // Test files (have supported extensions but should be excluded)
  '.test.js',
  '.test.ts',
  '.test.jsx',
  '.test.tsx',
  '.spec.js',
  '.spec.ts',
  '.spec.jsx',
  '.spec.tsx',

  // TypeScript declaration files
  '.d.ts',

  // Runtime version files that have supported extensions
  '.pnpmfile.cjs',

  // Language-specific files with supported extensions that should be excluded
  'go.sum',
  'project.clj',
  'setup.py',
  'setup.cfg',
  'manifest.in',

  // Build tool configuration files (have supported extensions but should be excluded)
  'gulpfile.js',
  'gruntfile.js',
  'webpack.config.js',
  'webpack.config.ts',
  'rollup.config.js',
  'vite.config.js',
  'vite.config.ts',
  'next.config.js',
  'nuxt.config.js',
  'tailwind.config.js',
  'postcss.config.js',

  // Linter and formatter config files (with supported extensions)
  '.babelrc.js',
  '.eslintrc.js',
  '.prettierrc.js',
  '.stylelintrc.js',

  // Test framework config files (with supported extensions)
  'jest.config.js',
  'jest.config.ts',
  'vitest.config.js',
  'karma.conf.js',
  'protractor.conf.js',
  'cypress.config.js',
  'playwright.config.js',
]

// Supported file extensions from language analysis engines
// sourece: https://github.com/semgrep/semgrep-interfaces/blob/main/generate.py
export const SUPPORTED_EXTENSIONS = [
  // Apex
  '.cls',
  // Bash
  '.bash',
  '.sh',
  // C
  '.c',
  '.h',
  // Cairo
  '.cairo',
  // Circom
  '.circom',
  // Clojure
  '.clj',
  '.cljs',
  '.cljc',
  '.edn',
  // C++
  '.cc',
  '.cpp',
  '.cxx',
  '.c++',
  '.pcc',
  '.tpp',
  '.C',
  '.hh',
  '.hpp',
  '.hxx',
  '.inl',
  '.ipp',
  // C#
  '.cs',
  // Dart
  '.dart',
  // Dockerfile
  '.dockerfile',
  '.Dockerfile',
  'Dockerfile',
  'dockerfile',
  // Elixir
  '.ex',
  '.exs',
  // Go
  '.go',
  // Hack
  '.hack',
  '.hck',
  '.hh',
  // HTML
  '.htm',
  '.html',
  // Java
  '.java',
  // JavaScript
  '.cjs',
  '.js',
  '.jsx',
  '.mjs',
  // JSON
  '.json',
  '.ipynb',
  // Jsonnet
  '.jsonnet',
  '.libsonnet',
  // Julia
  '.jl',
  // Kotlin
  '.kt',
  '.kts',
  '.ktm',
  // Lisp
  '.lisp',
  '.cl',
  '.el',
  // Lua
  '.lua',
  // Move (both Sui and Aptos)
  '.move',
  // OCaml
  '.ml',
  '.mli',
  // PHP
  '.php',
  '.tpl',
  '.phtml',
  // PromQL
  '.promql',
  // Protocol Buffers
  '.proto',
  // Python
  '.py',
  '.pyi',
  // QL
  '.ql',
  '.qll',
  // R
  '.r',
  '.R',
  // Ruby
  '.rb',
  // Rust
  '.rs',
  // Scala
  '.scala',
  // Scheme
  '.scm',
  '.ss',
  // Solidity
  '.sol',
  // Swift
  '.swift',
  // Terraform
  '.tf',
  '.hcl',
  '.tfvars',
  // TypeScript
  '.ts',
  '.tsx',
  // Vue
  '.vue',
  // XML
  '.xml',
  '.plist',
  // YAML
  '.yml',
  '.yaml',
]

export const IMPORTANT_PROJECT_FILES = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'pom.xml',
]
