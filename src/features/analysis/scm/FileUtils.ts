import fs from 'node:fs'

import { isBinary } from 'istextorbinary'
import path from 'path'

// Default excluded file patterns for source code analysis
const EXCLUDED_FILE_PATTERNS = [
  // ... (copy the full array from FilePacking.ts)
  '.json',
  '.yaml',
  '.yml',
  '.toml',
  '.ini',
  '.conf',
  '.config',
  '.xml',
  '.env',
  '.md',
  '.txt',
  '.rst',
  '.adoc',
  '.lock',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.bmp',
  '.tiff',
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
  '.eot',
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',
  '.log',
  '.db',
  '.sqlite',
  '.sql',
  '.pem',
  '.crt',
  '.key',
  '.p12',
  '.pfx',
  '.editorconfig',
  '.sublime-project',
  '.sublime-workspace',
  '.DS_Store',
  'Thumbs.db',
  '.lcov',
  '.exe',
  '.dll',
  '.so',
  '.dylib',
  '.class',
  '.pyc',
  '.pyo',
  '.o',
  '.obj',
  '.min.js',
  '.min.css',
  '.min.html',
  '.test.js',
  '.test.ts',
  '.test.jsx',
  '.test.tsx',
  '.spec.js',
  '.spec.ts',
  '.spec.jsx',
  '.spec.tsx',
  '.d.ts',
  '.bundle.js',
  '.chunk.js',
  'dockerfile',
  'jenkinsfile',
  'go.sum',
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.gitkeep',
  '.keep',
  '.hgignore',
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
  '.babelrc',
  '.babelrc.js',
  '.swcrc',
  '.browserslistrc',
  'jest.config.js',
  'jest.config.ts',
  'vitest.config.js',
  'karma.conf.js',
  'protractor.conf.js',
  'cypress.config.js',
  'playwright.config.js',
  '.nycrc',
  '.c8rc',
  '.eslintrc',
  '.eslintrc.js',
  '.prettierrc',
  '.prettierrc.js',
  '.stylelintrc',
  '.stylelintrc.js',
  'pipfile',
  'gemfile',
  'go.mod',
  'project.clj',
  'setup.py',
  'setup.cfg',
  'manifest.in',
  '.pythonrc',
  'readme',
  'changelog',
  'authors',
  'contributors',
  'license',
  'notice',
  'copyright',
  '.htaccess',
]

export class FileUtils {
  static isExcludedFileType(filepath: string): boolean {
    const basename = path.basename(filepath).toLowerCase()
    if (basename === '.env' || basename.startsWith('.env.')) {
      return true
    }
    if (EXCLUDED_FILE_PATTERNS.some((pattern) => basename.endsWith(pattern))) {
      return true
    }
    return false
  }

  static shouldPackFile(
    filepath: string,
    maxFileSize = 1024 * 1024 * 5
  ): boolean {
    const absoluteFilepath = path.resolve(filepath)
    if (this.isExcludedFileType(filepath)) return false
    if (!fs.existsSync(absoluteFilepath)) return false
    if (fs.lstatSync(absoluteFilepath).size > maxFileSize) return false
    let data: Buffer
    try {
      data = fs.readFileSync(absoluteFilepath)
    } catch {
      return false
    }
    if (isBinary(null, data)) return false
    return true
  }

  private static getAllFiles(
    dir: string,
    rootDir?: string
  ): {
    name: string
    fullPath: string
    relativePath: string
    time: number
    isFile: boolean
  }[] {
    const root = rootDir || dir // Use original dir as root if not provided
    const results: {
      name: string
      fullPath: string
      relativePath: string
      time: number
      isFile: boolean
    }[] = []

    // if the recursion is over 20 directories in relative to the rootDir, skip the current directory
    const relativeDepth = path.relative(root, dir).split(path.sep).length
    if (relativeDepth > 20) {
      return []
    }

    // we already collected 100000 files, skip the current directory
    if (results.length > 100000) {
      return []
    }

    // check if I have access to the directory
    try {
      fs.accessSync(dir, fs.constants.R_OK)
    } catch {
      return []
    }

    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)

      try {
        fs.accessSync(fullPath, fs.constants.R_OK)
      } catch {
        continue
      }

      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Recursively get files from subdirectories, passing the original root
        results.push(...this.getAllFiles(fullPath, root))
      } else {
        results.push({
          name: item,
          fullPath,
          relativePath: path.relative(root, fullPath),
          time: stat.mtime.getTime(),
          isFile: true,
        })
      }
    }

    return results
  }

  static getLastChangedFiles(
    dir: string,
    maxFileSize = 1024 * 1024 * 5,
    count = 10
  ): string[] {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) return []

    const files = this.getAllFiles(dir)
    return files
      .filter((file) => this.shouldPackFile(file.fullPath, maxFileSize))
      .sort((a, b) => b.time - a.time)
      .slice(0, count)
      .map((file) => file.relativePath)
  }
}
