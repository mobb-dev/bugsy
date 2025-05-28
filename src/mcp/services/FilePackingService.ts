import fs from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - istextorbinary module doesn't have proper TypeScript declarations
import { isBinary } from 'istextorbinary'

import { logInfo } from '../Logger'

const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

// Default excluded file patterns for source code analysis
const EXCLUDED_FILE_PATTERNS = [
  // Configuration files
  '.json',
  '.yaml',
  '.yml',
  '.toml',
  '.ini',
  '.conf',
  '.config',
  '.xml',
  '.env',

  // Documentation
  '.md',
  '.txt',
  '.rst',
  '.adoc',

  // Lock/dependency files
  '.lock',

  // Images and media
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.bmp',
  '.tiff',

  // Fonts
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
  '.eot',

  // Archives
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',

  // Logs and databases
  '.log',
  '.db',
  '.sqlite',
  '.sql',

  // Certificates and keys
  '.pem',
  '.crt',
  '.key',
  '.p12',
  '.pfx',

  // IDE/Editor files
  '.editorconfig',
  '.sublime-project',
  '.sublime-workspace',

  // System files
  '.DS_Store',
  'Thumbs.db',

  // Coverage reports
  '.lcov',

  // Compiled/binary files
  '.exe',
  '.dll',
  '.so',
  '.dylib',
  '.class',
  '.pyc',
  '.pyo',
  '.o',
  '.obj',

  // Minified files
  '.min.js',
  '.min.css',
  '.min.html',

  // Test files
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

  // Build/generated files
  '.bundle.js',
  '.chunk.js',

  // Build/CI files (exact filenames)
  'dockerfile',
  'jenkinsfile',

  // Lock files (ones without standard extensions)
  'go.sum',

  // Version control
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.gitkeep',
  '.keep',
  '.hgignore',

  // Node.js specific
  '.nvmrc',
  '.node-version',
  '.npmrc',
  '.yarnrc',
  '.pnpmfile.cjs',

  // Language version files
  '.ruby-version',
  '.python-version',
  '.rvmrc',
  '.rbenv-version',
  '.gvmrc',

  // Build tools and task runners
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

  // JavaScript/TypeScript config
  '.babelrc',
  '.babelrc.js',
  '.swcrc',
  '.browserslistrc',

  // Testing frameworks
  'jest.config.js',
  'jest.config.ts',
  'vitest.config.js',
  'karma.conf.js',
  'protractor.conf.js',
  'cypress.config.js',
  'playwright.config.js',
  '.nycrc',
  '.c8rc',

  // Linting/formatting configs
  '.eslintrc',
  '.eslintrc.js',
  '.prettierrc',
  '.prettierrc.js',
  '.stylelintrc',
  '.stylelintrc.js',

  // Package manager configs (ones without standard extensions)
  'pipfile',
  'gemfile',
  'go.mod',
  'project.clj',

  // Python specific
  'setup.py',
  'setup.cfg',
  'manifest.in',
  '.pythonrc',

  // Documentation files (ones without standard extensions)
  'readme',
  'changelog',
  'authors',
  'contributors',

  // License and legal (ones without standard extensions)
  'license',
  'notice',
  'copyright',

  // Web specific
  '.htaccess',
]

export class FilePackingService {
  private isExcludedFileType(filepath: string): boolean {
    const basename = path.basename(filepath).toLowerCase()

    // Check for .env files and all .env.* variations (.env.local, .env.production, etc.)
    if (basename === '.env' || basename.startsWith('.env.')) {
      return true
    }

    // Check for excluded patterns (suffix matching)
    if (EXCLUDED_FILE_PATTERNS.some((pattern) => basename.endsWith(pattern))) {
      return true
    }

    return false
  }

  public async packFiles(
    sourceDirectoryPath: string,
    filesToPack: string[]
  ): Promise<Buffer> {
    logInfo(`FilePackingService: packing files from ${sourceDirectoryPath}`)

    const zip = new AdmZip()
    let packedFilesCount = 0

    logInfo('FilePackingService: compressing files')
    for (const filepath of filesToPack) {
      const absoluteFilepath = path.join(sourceDirectoryPath, filepath)

      // Check if file type is excluded
      if (this.isExcludedFileType(filepath)) {
        logInfo(
          `FilePackingService: ignoring ${filepath} because it is an excluded file type`
        )
        continue
      }

      // Check if file exists
      if (!fs.existsSync(absoluteFilepath)) {
        logInfo(
          `FilePackingService: ignoring ${filepath} because it does not exist`
        )
        continue
      }

      if (fs.lstatSync(absoluteFilepath).size > MAX_FILE_SIZE) {
        logInfo(
          `FilePackingService: ignoring ${filepath} because the size is > ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        )
        continue
      }

      let data: Buffer
      try {
        data = fs.readFileSync(absoluteFilepath)
      } catch (fsError) {
        logInfo(
          `FilePackingService: failed to read ${filepath} from filesystem: ${fsError}`
        )
        continue
      }

      // Exclude binary files
      if (isBinary(null, data)) {
        logInfo(
          `FilePackingService: ignoring ${filepath} because it seems to be a binary file`
        )
        continue
      }

      zip.addFile(filepath, data)
      packedFilesCount++
    }

    const zipBuffer = zip.toBuffer()
    logInfo(
      `FilePackingService: read ${packedFilesCount} source files. total size: ${zipBuffer.length} bytes`
    )
    logInfo('FilePackingService: Files packed successfully')
    return zipBuffer
  }
}
