import { promises as fsPromises } from 'node:fs'

// Import AdmZip for real ZIP operations in tests
import AdmZip from 'adm-zip'
import fs from 'fs'
import { isBinary } from 'istextorbinary'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FileUtils } from '../../src/features/analysis/scm/services/FileUtils'
import { FileOperations } from '../../src/mcp/services/FileOperations'
import { EmptyGitRepo, MockRepo, NonGitRepo } from './helpers/MockRepo'

// Mock istextorbinary before the rest of the imports
vi.mock('istextorbinary', () => ({
  isBinary: vi.fn(),
}))

describe('FileUtils', () => {
  let mockRepo: MockRepo

  beforeEach(() => {
    mockRepo = new EmptyGitRepo()
    vi.clearAllMocks()
  })

  afterEach(() => {
    mockRepo.cleanupAll()
  })

  describe('isExcludedFileType', () => {
    it('should exclude .env files', () => {
      expect(FileUtils.isExcludedFileType('.env')).toBe(true)
      expect(FileUtils.isExcludedFileType('.env.local')).toBe(true)
      expect(FileUtils.isExcludedFileType('.env.development')).toBe(true)
    })

    it('should exclude files with unsupported extensions', () => {
      expect(FileUtils.isExcludedFileType('readme.md')).toBe(true)
      expect(FileUtils.isExcludedFileType('image.png')).toBe(true)
      expect(FileUtils.isExcludedFileType('data.txt')).toBe(true)
      expect(FileUtils.isExcludedFileType('archive.zip')).toBe(true)
    })

    it('should allow supported source file extensions', () => {
      expect(FileUtils.isExcludedFileType('app.js')).toBe(false)
      expect(FileUtils.isExcludedFileType('main.py')).toBe(false)
      expect(FileUtils.isExcludedFileType('index.ts')).toBe(false)
      expect(FileUtils.isExcludedFileType('component.tsx')).toBe(false)
      expect(FileUtils.isExcludedFileType('main.go')).toBe(false)
      expect(FileUtils.isExcludedFileType('service.java')).toBe(false)
      expect(FileUtils.isExcludedFileType('script.rb')).toBe(false)
      expect(FileUtils.isExcludedFileType('config.json')).toBe(false) // Now allowed as supported extension
    })

    it('should allow important project configuration files', () => {
      expect(FileUtils.isExcludedFileType('package.json')).toBe(false)
      expect(FileUtils.isExcludedFileType('package-lock.json')).toBe(false)
      expect(FileUtils.isExcludedFileType('pnpm-lock.yaml')).toBe(false)
      expect(FileUtils.isExcludedFileType('yarn.lock')).toBe(false)
      expect(FileUtils.isExcludedFileType('pom.xml')).toBe(false)
    })

    it('should allow supported extensions like json/xml/yaml but exclude specific patterns', () => {
      // These are now allowed as they have supported extensions
      expect(FileUtils.isExcludedFileType('config.json')).toBe(false)
      expect(FileUtils.isExcludedFileType('data.xml')).toBe(false)
      expect(FileUtils.isExcludedFileType('settings.yaml')).toBe(false)

      // But these should still be excluded by pattern matching
      expect(FileUtils.isExcludedFileType('bundle.min.js')).toBe(true) // matches .min.js pattern
      expect(FileUtils.isExcludedFileType('test.test.js')).toBe(true) // matches .test.js pattern
      expect(FileUtils.isExcludedFileType('types.d.ts')).toBe(true) // matches .d.ts pattern
    })

    it('should allow all supported language extensions', () => {
      // Test ALL supported extensions from SUPPORTED_EXTENSIONS
      const supportedFiles = [
        // Apex
        'Main.cls',
        // Bash
        'deploy.bash',
        'script.sh',
        // C
        'main.c',
        'header.h',
        // Cairo
        'contract.cairo',
        // Circom
        'circuit.circom',
        // Clojure
        'core.clj',
        'frontend.cljs',
        'common.cljc',
        'config.edn',
        // C++
        'app.cc',
        'main.cpp',
        'util.cxx',
        'core.c++',
        'perf.pcc',
        'template.tpp',
        'Main.C',
        'header.hh',
        'interface.hpp',
        'util.hxx',
        'inline.inl',
        'impl.ipp',
        // C#
        'Service.cs',
        // Dart
        'widget.dart',
        // Dockerfile
        'build.dockerfile',
        'Deploy.Dockerfile',
        'Dockerfile',
        'dockerfile',
        // Elixir
        'server.ex',
        'config.exs',
        // Go
        'main.go',
        // Hack
        'service.hack',
        'util.hck',
        'header.hh',
        // HTML
        'page.htm',
        'index.html',
        // Java
        'App.java',
        // JavaScript
        'common.cjs',
        'app.js',
        'component.jsx',
        'module.mjs',
        // JSON
        'config.json',
        'notebook.ipynb',
        // Jsonnet
        'config.jsonnet',
        'lib.libsonnet',
        // Julia
        'data.jl',
        // Kotlin
        'app.kt',
        'script.kts',
        'module.ktm',
        // Lisp
        'core.lisp',
        'common.cl',
        'emacs.el',
        // Lua
        'script.lua',
        // Move
        'contract.move',
        // OCaml
        'main.ml',
        'interface.mli',
        // PHP
        'app.php',
        'template.tpl',
        'page.phtml',
        // PromQL
        'query.promql',
        // Protocol Buffers
        'schema.proto',
        // Python
        'main.py',
        'types.pyi',
        // QL
        'query.ql',
        'library.qll',
        // R
        'analysis.r',
        'script.R',
        // Ruby
        'lib.rb',
        // Rust
        'main.rs',
        // Scala
        'App.scala',
        // Scheme
        'core.scm',
        'util.ss',
        // Solidity
        'contract.sol',
        // Swift
        'App.swift',
        // Terraform
        'main.tf',
        'config.hcl',
        'vars.tfvars',
        // TypeScript
        'app.ts',
        'component.tsx',
        // Vue
        'Component.vue',
        // XML
        'config.xml',
        'info.plist',
        // YAML
        'deploy.yml',
        'config.yaml',
      ]

      for (const file of supportedFiles) {
        expect(FileUtils.isExcludedFileType(file)).toBe(false)
      }
    })

    it('should comprehensively test all EXCLUDED_FILE_PATTERNS', () => {
      // Test ALL patterns from EXCLUDED_FILE_PATTERNS
      const excludedFiles = [
        // Snapshot and environment files
        'test.snap',
        'secrets.env.vault',
        '.env',
        // Configuration formats not supported for analysis
        'config.toml',
        'app.ini',
        'server.conf',
        'settings.config',
        // Documentation files
        'README.md',
        'notes.txt',
        'guide.rst',
        'manual.adoc',
        // Lock files (except important project ones handled separately)
        'some.lock', // Note: yarn.lock, package-lock.json etc. are IMPORTANT_PROJECT_FILES
        // Image and media files
        'logo.png',
        'photo.jpg',
        'image.jpeg',
        'animation.gif',
        'favicon.ico',
        'banner.webp',
        'texture.bmp',
        'print.tiff',
        // Font files
        'font.ttf',
        'typeface.otf',
        'web.woff',
        'modern.woff2',
        'legacy.eot',
        // Archive files
        'backup.zip',
        'archive.tar',
        'compressed.gz',
        'files.rar',
        'data.7z',
        // Log and database files
        'app.log',
        'data.db',
        'cache.sqlite',
        'schema.sql',
        // Certificate and key files
        'cert.pem',
        'ssl.crt',
        'private.key',
        'identity.p12',
        'cert.pfx',
        // Editor and system files
        '.editorconfig',
        'project.sublime-project',
        'workspace.sublime-workspace',
        '.DS_Store',
        'Thumbs.db',
        // Coverage and build artifacts
        'coverage.lcov',
        'app.exe',
        'library.dll',
        'libmath.so',
        'framework.dylib',
        'Main.class',
        'module.pyc',
        'cache.pyo',
        'object.o',
        'binary.obj',
        // Minified and bundled files (even with supported extensions)
        'jquery.min.js',
        'bootstrap.min.css',
        'index.min.html',
        'app.bundle.js',
        'vendor.chunk.js',
        // Test files (even with supported extensions)
        'utils.test.js',
        'component.test.ts',
        'helpers.test.jsx',
        'widget.test.tsx',
        'service.spec.js',
        'model.spec.ts',
        'form.spec.jsx',
        'page.spec.tsx',
        // TypeScript declaration files
        'types.d.ts',
        // Build and CI files
        'jenkinsfile',
        'go.sum',
        // Version control files
        '.gitignore',
        '.gitattributes',
        '.gitmodules',
        '.gitkeep',
        '.keep',
        '.hgignore',
        // Runtime version files
        '.nvmrc',
        '.node-version',
        '.npmrc',
        '.yarnrc',
        '.pnpmfile.cjs',
        '.ruby-version',
        '.python-version',
        '.rvmrc',
        '.rbenv-version',
        '.gvmrc',
        // Build tool configuration
        'makefile',
        'rakefile',
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
        // Linter and formatter config
        '.babelrc',
        '.babelrc.js',
        '.swcrc',
        '.browserslistrc',
        '.eslintrc',
        '.eslintrc.js',
        '.prettierrc',
        '.prettierrc.js',
        '.stylelintrc',
        '.stylelintrc.js',
        // Test framework config
        'jest.config.js',
        'jest.config.ts',
        'vitest.config.js',
        'karma.conf.js',
        'protractor.conf.js',
        'cypress.config.js',
        'playwright.config.js',
        '.nycrc',
        '.c8rc',
        // Language-specific files
        'pipfile',
        'gemfile',
        'go.mod',
        'project.clj',
        'setup.py',
        'setup.cfg',
        'manifest.in',
        '.pythonrc',
        // Documentation files (case variations)
        'readme',
        'changelog',
        'authors',
        'contributors',
        'license',
        'notice',
        'copyright',
        // Web server config
        '.htaccess',
      ]

      for (const file of excludedFiles) {
        expect(FileUtils.isExcludedFileType(file)).toBe(true)
      }
    })

    it('should handle compound extensions correctly', () => {
      // Test edge cases with compound extensions
      const testCases = [
        // Minified files with supported base extensions should be excluded
        { file: 'app.min.js', expected: true },
        { file: 'styles.min.css', expected: true },
        { file: 'index.min.html', expected: true },
        // Bundled files should be excluded
        { file: 'vendor.bundle.js', expected: true },
        { file: 'main.chunk.js', expected: true },
        // Test files should be excluded
        { file: 'utils.test.js', expected: true },
        { file: 'component.spec.tsx', expected: true },
        // TypeScript declaration files should be excluded
        { file: 'types.d.ts', expected: true },
        { file: 'global.d.ts', expected: true },
        // Regular files with supported extensions should be included
        { file: 'app.js', expected: false },
        { file: 'component.tsx', expected: false },
        { file: 'styles.css', expected: true }, // CSS not in supported list
        // Files ending with patterns but having unsupported base extension
        { file: 'readme.min.txt', expected: true }, // .txt not supported
        { file: 'data.test.csv', expected: true }, // .csv not supported
      ]

      for (const { file, expected: isExpected } of testCases) {
        expect(FileUtils.isExcludedFileType(file)).toBe(isExpected)
      }
    })

    it('should handle case sensitivity properly', () => {
      // Test case variations for supported extensions
      const caseTests = [
        // C++ extensions (case sensitive)
        { file: 'main.C', expected: false }, // Uppercase C is supported
        { file: 'main.c', expected: false }, // Lowercase c is supported
        // R extensions (case sensitive)
        { file: 'script.R', expected: false },
        { file: 'script.r', expected: false },
        // Dockerfile variations
        { file: 'Dockerfile', expected: false },
        { file: 'dockerfile', expected: false },
        { file: 'build.Dockerfile', expected: false },
        { file: 'deploy.dockerfile', expected: false },
        // System files (case insensitive due to toLowerCase)
        { file: '.DS_Store', expected: true },
        { file: '.ds_store', expected: true },
        { file: 'THUMBS.DB', expected: true },
        { file: 'thumbs.db', expected: true },
      ]

      for (const { file, expected: isExpected } of caseTests) {
        expect(FileUtils.isExcludedFileType(file)).toBe(isExpected)
      }
    })

    it('should prioritize IMPORTANT_PROJECT_FILES over exclusion patterns', () => {
      // Important project files should NEVER be excluded, even if they match exclusion patterns
      const importantFiles = [
        'package.json',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        'pom.xml',
      ]

      for (const file of importantFiles) {
        expect(FileUtils.isExcludedFileType(file)).toBe(false)
      }

      // Test that yarn.lock specifically is included despite .lock being in exclusion patterns
      expect(FileUtils.isExcludedFileType('yarn.lock')).toBe(false)
      expect(FileUtils.isExcludedFileType('other.lock')).toBe(true) // Other .lock files should be excluded
    })

    it('should handle files with no extension', () => {
      // Files without extensions should be handled correctly
      const noExtensionTests = [
        // Important project files without extensions (using basename matching)
        { file: 'Dockerfile', expected: false }, // Supported via basename
        { file: 'dockerfile', expected: false }, // Supported via basename
        // Build files
        { file: 'makefile', expected: true },
        { file: 'rakefile', expected: true },
        { file: 'jenkinsfile', expected: true },
        // Documentation files
        { file: 'readme', expected: true },
        { file: 'license', expected: true },
        { file: 'changelog', expected: true },
        // Random files without extensions (not in any list)
        { file: 'randomfile', expected: true }, // No extension, not supported
        { file: 'script', expected: true }, // No extension, not supported
      ]

      for (const { file, expected: isExpected } of noExtensionTests) {
        expect(FileUtils.isExcludedFileType(file)).toBe(isExpected)
      }
    })

    it('should handle edge cases and boundary conditions', () => {
      const edgeCases = [
        // Empty string
        { file: '', expected: true },
        // Just extension
        { file: '.js', expected: false }, // Valid JS file name
        { file: '.env', expected: true }, // Special case for .env
        // Multiple dots
        { file: 'file.name.with.dots.js', expected: false },
        { file: 'config.local.env', expected: true }, // .env override
        { file: 'test.spec.test.js', expected: true }, // Multiple patterns
        // Path components (should only consider basename)
        { file: 'src/components/Button.tsx', expected: false },
        { file: 'node_modules/package/index.js', expected: false }, // Only basename matters for file filtering
        // Special characters
        { file: 'file-name.js', expected: false },
        { file: 'file_name.py', expected: false },
        { file: 'file@name.ts', expected: false },
        // Very long extensions
        { file: 'file.verylongextension', expected: true },
      ]

      for (const { file, expected: isExpected } of edgeCases) {
        expect(FileUtils.isExcludedFileType(file)).toBe(isExpected)
      }
    })

    it('should now allow previously excluded extensions that are in whitelist', () => {
      // These were previously in EXCLUDED_FILE_PATTERNS but are now supported
      const previouslyExcludedButNowAllowed = [
        'data.json', // JSON is now supported
        'config.yaml', // YAML is now supported
        'settings.yml', // YML is now supported
        'manifest.xml', // XML is now supported
        'Dockerfile', // Dockerfile is now supported
        'user.html', // HTML is now supported
      ]

      for (const file of previouslyExcludedButNowAllowed) {
        expect(FileUtils.isExcludedFileType(file)).toBe(false)
      }
    })
  })

  describe('shouldPackFile', () => {
    it('should not pack excluded file types', () => {
      // Setup
      const filepath = 'config.json'
      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(true)

      // Test
      expect(FileUtils.shouldPackFile(filepath)).toBe(false)
      expect(FileUtils.isExcludedFileType).toHaveBeenCalledWith(filepath)
    })

    it('should not pack files larger than maxFileSize', () => {
      // Create a large file in the mock repo
      const repoPath = mockRepo.getRepoPath()
      const filepath = 'large-file.js'
      const fullPath = path.join(repoPath, filepath)

      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      // Mock stat to return large file size
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValueOnce(false)

      expect(FileUtils.shouldPackFile(fullPath)).toBe(false)
    })

    it('should not pack binary files', () => {
      // Create a file in the mock repo
      const filepath = 'binary-file.bin'
      const fullPath = mockRepo.addFile(filepath, 'binary content')

      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      // Mock isBinary to return true
      vi.mocked(isBinary).mockReturnValueOnce(true)

      expect(FileUtils.shouldPackFile(fullPath)).toBe(false)
    })

    it('should pack valid text files', () => {
      // Create a file in the mock repo
      const filepath = 'valid-file.js'
      const fullPath = mockRepo.addFile(filepath, 'console.log("Hello");')

      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      // Mock isBinary to return false
      vi.mocked(isBinary).mockReturnValueOnce(false)

      expect(FileUtils.shouldPackFile(fullPath)).toBe(true)
    })

    it('should return false when file access fails', () => {
      const filepath = 'non-existent-file.js'
      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      expect(FileUtils.shouldPackFile(filepath)).toBe(false)
    })
  })

  describe('getLastChangedFiles', () => {
    // Add a custom method to create a repo with specific gitignore content
    async function createRepoWithGitignore(
      gitignoreContent: string
    ): Promise<string> {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      repo.addFile('.gitignore', gitignoreContent)
      return repoPath
    }

    // Extend MockRepo to create a more complex repository structure
    async function createComplexRepo(): Promise<string> {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!

      // Create files of various types
      const files = [
        {
          fileName: 'src/index.js',
          fileContent: 'console.log("Hello");',
          isCommited: true,
        },
        {
          fileName: 'src/components/Button.jsx',
          fileContent: 'export const Button = () => {};',
          isCommited: true,
        },
        {
          fileName: 'src/utils.ts',
          fileContent: 'export function add(a, b) { return a + b; }',
          isCommited: true,
        },
        {
          fileName: 'test/utils.test.js',
          fileContent: 'test("add", () => {});',
          isCommited: true,
        },
        {
          fileName: 'config.json',
          fileContent: '{"name": "test"}',
          isCommited: true,
        },
        {
          fileName: 'README.md',
          fileContent: '# Test Project',
          isCommited: true,
        },
        {
          fileName: 'node_modules/lib/index.js',
          fileContent: 'module.exports = {};',
          isCommited: true,
        },
        {
          fileName: 'dist/bundle.min.js',
          fileContent: 'console.log("minified");',
          isCommited: true,
        },
        {
          fileName: 'vendor/library.js',
          fileContent: 'third-party code',
          isCommited: true,
        },
      ]

      await repo.addFiles(files)

      return repoPath
    }

    it('should return empty array when directory does not exist', async () => {
      const nonExistentPath = '/path/does/not/exist'

      const result = await FileUtils.getLastChangedFiles({
        dir: nonExistentPath,
        maxFileSize: 1024 * 1024,
      })

      expect(result).toEqual([])
    })

    it('should return empty array when path is not a directory', async () => {
      const filePath = mockRepo.addFile('file.txt', 'content')

      // Create a spy to simulate non-directory
      vi.spyOn(FileUtils, 'getLastChangedFiles').mockResolvedValueOnce([])

      const result = await FileUtils.getLastChangedFiles({
        dir: filePath,
        maxFileSize: 1024 * 1024,
      })

      expect(result).toEqual([])
    })

    it('should get exclusion patterns from gitignore when available', async () => {
      const repoPath = await createRepoWithGitignore(`
# Example gitignore
node_modules/
dist/
*.log
**/*.min.js
`)

      // Ensure FileUtils runs without throwing when .gitignore exists
      await expect(
        FileUtils.getLastChangedFiles({
          dir: repoPath,
          maxFileSize: 1024 * 1024,
        })
      ).resolves.not.toThrow()
    })

    it('should apply exclusion patterns and file filters correctly', async () => {
      // Create a complex repository with a real .gitignore file
      const repoPath = await createComplexRepo()

      // Create a real .gitignore file
      await mockRepo.addFile(
        '.gitignore',
        `
# Example gitignore
node_modules/
dist/
*.log
**/*.min.js
vendor/
`
      )

      // Mock shouldPackFile to include only source files
      vi.spyOn(FileUtils, 'shouldPackFile').mockImplementation((filepath) => {
        const ext = path.extname(filepath).toLowerCase()
        // Only pack JavaScript/TypeScript files, exclude JSON, MD, etc.
        return ['.js', '.jsx', '.ts', '.tsx'].includes(ext)
      })

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true, // Get all files, not just most recent
      })

      // We expect only source files in non-excluded directories
      expect(result).not.toContain('node_modules/lib/index.js')
      expect(result).not.toContain('dist/bundle.min.js')
      expect(result).not.toContain('vendor/library.js')
      expect(result).not.toContain('config.json')
      expect(result).not.toContain('README.md')

      // We expect these files to be included
      expect(result).toContain('src/index.js')
      expect(result).toContain('src/components/Button.jsx')
      expect(result).toContain('src/utils.ts')
      expect(result).toContain('test/utils.test.js')
    })

    it('should limit the number of files when isAllFilesScan is false', async () => {
      const repoPath = await createComplexRepo()

      // Mock shouldPackFile to always return true for testing the limit
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)

      // No need to mock nested pattern exclusion; it is handled by ignore matcher

      const maxFiles = 2

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        maxFiles,
        isAllFilesScan: false, // Limit to maxFiles
      })

      expect(result.length).toBeLessThanOrEqual(maxFiles)
    })

    it('should return all files when isAllFilesScan is true', async () => {
      const repoPath = await createComplexRepo()

      // Mock shouldPackFile to always return true for this test
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)

      // No need to mock nested pattern exclusion

      // Create a custom gitignore file with no exclusions for this test
      await mockRepo.addFile('.gitignore', '# Empty gitignore')

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        maxFiles: 1, // Try to limit to 1 file
        isAllFilesScan: true, // Should ignore maxFiles and return all files
      })

      // Should return more than 1 file despite maxFiles being set to 1
      expect(result.length).toBeGreaterThan(1)
    })

    it('should handle errors gracefully during directory processing', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!

      // Mock access to fail for specific directories
      vi.spyOn(fsPromises, 'access').mockImplementation(async (pathParam) => {
        if (pathParam.toString().includes('problematic')) {
          throw new Error('Access denied')
        }
        return undefined
      })

      // Create a directory that will fail access
      await repo.addFile('problematic/file.txt', 'content')

      // This should not throw despite the access error
      await expect(
        FileUtils.getLastChangedFiles({
          dir: repoPath,
          maxFileSize: 1024 * 1024,
        })
      ).resolves.not.toThrow()
    })

    it('should exclude files matching all patterns in the sample .gitignore via gitignore filtering', async () => {
      // Prepare a fresh repo and copy the sample .gitignore
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!

      // Copy sample .gitignore content into the repo
      const sampleGitignoreContent = await fsPromises.readFile(
        path.join(__dirname, 'mocks', 'sample.gitignore'),
        'utf8'
      )
      await repo.addFile('.gitignore', sampleGitignoreContent)

      // Files & directories that correspond to every pattern line in sample.gitignore
      const sampleFiles = [
        // Matches "filename   " (trailing spaces trimmed to 'filename')
        {
          fileName: 'filename/dummy.js',
          isCommited: false,
        },
        // Matches "\\!important!.py"
        {
          fileName: '!important!.py/dummy.js',
          isCommited: false,
        },
        // Matches "/root_level_only.py"
        {
          fileName: 'root_level_only.py/dummy.js',
          isCommited: false,
        },
        // Matches "docs/generated/"
        {
          fileName: 'docs/generated/index.js',
          isCommited: false,
        },
        // Matches "logs/"
        {
          fileName: 'logs/log.txt',
          isCommited: false,
        },
        // Matches "dist" (root-level dir)
        {
          fileName: 'dist/file.txt',
          isCommited: false,
        },
        // Matches "TODO.js"
        {
          fileName: 'TODO.js',
          isCommited: false,
        },
        // Matches "*.java"
        {
          fileName: 'Example.java',
          isCommited: false,
        },
        // Matches "file?.js"
        {
          fileName: 'file1.js',
          isCommited: false,
        },
        // Matches "[a-z]est.js"
        {
          fileName: 'test.js',
          isCommited: false,
        },
        // Matches "**/node_modules"
        {
          fileName: 'src/node_modules/module.js',
          isCommited: false,
        },
        // Matches "generated/**"
        {
          fileName: 'generated/script.js',
          isCommited: false,
        },
        // Matches "doc/**/temp"
        {
          fileName: 'doc/inner/temp/file.txt',
          isCommited: false,
        },
        // Matches "dist/**/node_modules/*." – create a file ending with a dot
        {
          fileName: 'dist/foo/node_modules/bar.',
          isCommited: false,
        },
      ]

      await repo.addFiles(sampleFiles)

      // Ensure shouldPackFile always returns true so filtering happens via gitignore rules
      const shouldPackFileSpy = vi
        .spyOn(FileUtils, 'shouldPackFile')
        .mockReturnValue(true)

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true,
      })

      // Ensure none of the sample files appear in the result
      for (const { fileName } of sampleFiles) {
        expect(result).not.toContain(fileName)
      }
      // Verify shouldPackFile was invoked (and therefore not the cause of exclusion)
      expect(shouldPackFileSpy).toHaveBeenCalled()
    })

    it('should fall back to EXCLUDED_DIRS when .gitignore is absent in a git repo', async () => {
      // Create an empty git repo and remove the default .gitignore
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      // Remove .gitignore created by helper
      const gitignorePath = path.join(repoPath, '.gitignore')
      if (fs.existsSync(gitignorePath)) fs.unlinkSync(gitignorePath)

      // Add files under an excluded root directory (node_modules) and a normal directory
      await repo.addFiles([
        {
          fileName: 'node_modules/pkg/index.js',
          fileContent: 'console.log(0)',
          isCommited: false,
        },
        {
          fileName: 'src/app.js',
          fileContent: 'console.log(1)',
          isCommited: false,
        },
      ])

      const files = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true,
      })

      expect(files).not.toContain('node_modules/pkg/index.js')
      expect(files).toContain('src/app.js')
    })

    it('should fall back to EXCLUDED_DIRS for a non-git repository', async () => {
      const repo = new NonGitRepo()
      const repoPath = repo.getRepoPath()!

      // Remove .gitignore created by helper
      const gitignorePath = path.join(repoPath, '.gitignore')
      if (fs.existsSync(gitignorePath)) fs.unlinkSync(gitignorePath)

      await repo.addFiles([
        {
          fileName: 'dist/output.js',
          fileContent: 'console.log(2)',
          isCommited: false,
        },
        {
          fileName: 'src/index.js',
          fileContent: 'console.log(3)',
          isCommited: false,
        },
      ])

      const files = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true,
      })

      expect(files).not.toContain('dist/output.js')
      expect(files).toContain('src/index.js')
    })
  })

  describe('FileOperations - Folder Structure Preservation', () => {
    it('should maintain folder structure relative to project root when packing files', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const fileOperations = new FileOperations()

      // Create a nested folder structure with files and their expected content
      const testFiles = [
        {
          path: 'src/components/Button.tsx',
          content: 'export const Button = () => <button>Click me</button>;',
        },
        {
          path: 'src/utils/helpers.ts',
          content: 'export function helper() { return "help"; }',
        },
        {
          path: 'tests/unit/button.test.ts',
          content: 'import { Button } from "../../src/components/Button";',
        },
        {
          path: 'docs/api/endpoints.md',
          content: '# API Endpoints\n\n## GET /api/users',
        },
        {
          path: 'config/settings.json',
          content: '{"theme": "dark", "version": "1.0"}',
        },
      ]

      // Add the files to the mock repository
      for (const file of testFiles) {
        await repo.addFile(file.path, file.content)
      }

      // Mock shouldPackFile to return true for all files
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)

      // Mock isBinary to return false for all files
      vi.mocked(isBinary).mockReturnValue(false)

      // Create the archive
      const result = await fileOperations.createSourceCodeArchive(
        testFiles.map((f) => f.path),
        repoPath,
        1024 * 1024 // 1MB max file size
      )

      // Verify the archive was created
      expect(result.packedFilesCount).toBe(testFiles.length)
      expect(result.archive).toBeInstanceOf(Buffer)
      expect(result.totalSize).toBeGreaterThan(0)

      // Extract the ZIP and verify folder structure
      const extractedZip = new AdmZip(result.archive)
      const zipEntries = extractedZip.getEntries()

      // Verify all files are present with correct paths
      expect(zipEntries).toHaveLength(testFiles.length)

      for (const file of testFiles) {
        // Find the entry with the expected path
        const entry = zipEntries.find((e) => e.entryName === file.path)
        expect(entry).toBeDefined()
        expect(entry!.entryName).toBe(file.path)

        // Verify the content matches
        const extractedContent = entry!.getData().toString('utf8')
        expect(extractedContent).toBe(file.content)
      }

      // Verify specific folder structure examples
      const srcButtonEntry = zipEntries.find(
        (e) => e.entryName === 'src/components/Button.tsx'
      )
      expect(srcButtonEntry).toBeDefined()
      expect(srcButtonEntry!.entryName).toBe('src/components/Button.tsx')

      const testEntry = zipEntries.find(
        (e) => e.entryName === 'tests/unit/button.test.ts'
      )
      expect(testEntry).toBeDefined()
      expect(testEntry!.entryName).toBe('tests/unit/button.test.ts')

      const configEntry = zipEntries.find(
        (e) => e.entryName === 'config/settings.json'
      )
      expect(configEntry).toBeDefined()
      expect(configEntry!.entryName).toBe('config/settings.json')
    })

    it('should preserve deep nested folder structures', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const fileOperations = new FileOperations()

      // Create deeply nested structure with specific content
      const deepFiles = [
        {
          path: 'a/b/c/d/e/f/deep-file.js',
          content: 'console.log("deep nesting test");',
        },
        {
          path: 'project/src/modules/auth/components/LoginForm.tsx',
          content: 'export const LoginForm = () => <form></form>;',
        },
        {
          path: 'assets/images/icons/social/facebook.svg',
          content: '<svg><circle r="10" /></svg>',
        },
      ]

      for (const file of deepFiles) {
        await repo.addFile(file.path, file.content)
      }

      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)
      vi.mocked(isBinary).mockReturnValue(false)

      const result = await fileOperations.createSourceCodeArchive(
        deepFiles.map((f) => f.path),
        repoPath,
        1024 * 1024
      )

      // Extract and verify the ZIP content
      const extractedZip = new AdmZip(result.archive)
      const zipEntries = extractedZip.getEntries()

      expect(zipEntries).toHaveLength(deepFiles.length)

      // Verify deep paths are preserved exactly with correct content
      for (const file of deepFiles) {
        const entry = zipEntries.find((e) => e.entryName === file.path)
        expect(entry).toBeDefined()
        expect(entry!.entryName).toBe(file.path)

        const extractedContent = entry!.getData().toString('utf8')
        expect(extractedContent).toBe(file.content)
      }

      // Verify specific deep nested paths
      const deepJsEntry = zipEntries.find(
        (e) => e.entryName === 'a/b/c/d/e/f/deep-file.js'
      )
      expect(deepJsEntry).toBeDefined()
      expect(deepJsEntry!.getData().toString('utf8')).toBe(
        'console.log("deep nesting test");'
      )

      const authComponentEntry = zipEntries.find(
        (e) =>
          e.entryName === 'project/src/modules/auth/components/LoginForm.tsx'
      )
      expect(authComponentEntry).toBeDefined()
      expect(authComponentEntry!.getData().toString('utf8')).toBe(
        'export const LoginForm = () => <form></form>;'
      )

      const svgEntry = zipEntries.find(
        (e) => e.entryName === 'assets/images/icons/social/facebook.svg'
      )
      expect(svgEntry).toBeDefined()
      expect(svgEntry!.getData().toString('utf8')).toBe(
        '<svg><circle r="10" /></svg>'
      )
    })

    it('should handle mixed file types while preserving structure', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const fileOperations = new FileOperations()

      // Create files with different extensions at various depths
      const mixedFiles = [
        { path: 'README.md', content: '# Project Title\n\nDescription here.' },
        { path: 'src/index.ts', content: 'import "./app";' },
        {
          path: 'public/assets/logo.svg',
          content: '<svg viewBox="0 0 100 100"></svg>',
        },
        {
          path: 'lib/vendor/external.min.js',
          content: 'var a=function(){return 42;};',
        },
        {
          path: 'docs/guides/setup/installation.md',
          content: '## Installation\n\nRun npm install',
        },
      ]

      for (const file of mixedFiles) {
        await repo.addFile(file.path, file.content)
      }

      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)
      vi.mocked(isBinary).mockReturnValue(false)

      const result = await fileOperations.createSourceCodeArchive(
        mixedFiles.map((f) => f.path),
        repoPath,
        1024 * 1024
      )

      // Extract and verify
      const extractedZip = new AdmZip(result.archive)
      const zipEntries = extractedZip.getEntries()

      expect(zipEntries).toHaveLength(mixedFiles.length)

      // Test that each file maintains its exact relative path and content
      for (const file of mixedFiles) {
        const entry = zipEntries.find((e) => e.entryName === file.path)
        expect(entry).toBeDefined()
        expect(entry!.entryName).toBe(file.path)
        expect(entry!.getData().toString('utf8')).toBe(file.content)
      }

      // Verify root level file
      const readmeEntry = zipEntries.find((e) => e.entryName === 'README.md')
      expect(readmeEntry!.entryName).toBe('README.md')

      // Verify deeply nested file
      const installationEntry = zipEntries.find(
        (e) => e.entryName === 'docs/guides/setup/installation.md'
      )
      expect(installationEntry!.entryName).toBe(
        'docs/guides/setup/installation.md'
      )
    })

    it('should include important project configuration files in packing', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const fileOperations = new FileOperations()

      // Create only important project configuration files
      const importantFiles = [
        {
          path: 'package.json',
          content: '{"name": "test-project", "version": "1.0.0"}',
        },
        {
          path: 'package-lock.json',
          content: '{"name": "test-project", "lockfileVersion": 2}',
        },
        {
          path: 'pnpm-lock.yaml',
          content: 'lockfileVersion: 5.4\n\ndependencies:',
        },
        { path: 'yarn.lock', content: '# This file is generated by Yarn.' },
        {
          path: 'pom.xml',
          content: '<?xml version="1.0"?><project></project>',
        },
      ]

      for (const file of importantFiles) {
        await repo.addFile(file.path, file.content)
      }

      // Don't mock shouldPackFile - let it use the real logic
      vi.mocked(isBinary).mockReturnValue(false)

      const result = await fileOperations.createSourceCodeArchive(
        importantFiles.map((f) => f.path),
        repoPath,
        1024 * 1024
      )

      // Extract and verify
      const extractedZip = new AdmZip(result.archive)
      const zipEntries = extractedZip.getEntries()

      // Should include all 5 important project files
      expect(result.packedFilesCount).toBe(5)
      expect(zipEntries).toHaveLength(5)

      // Verify each important file is included with correct content
      for (const file of importantFiles) {
        const entry = zipEntries.find((e) => e.entryName === file.path)
        expect(entry).toBeDefined()
        expect(entry!.entryName).toBe(file.path)
        expect(entry!.getData().toString('utf8')).toBe(file.content)
      }
    })
  })
})
