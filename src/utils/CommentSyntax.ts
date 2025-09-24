import path from 'path'

/**
 * Maps file extensions to their corresponding comment syntax
 */
const COMMENT_SYNTAX_MAP: Record<string, string> = {
  // C-style languages (single line comments)
  '.js': '//',
  '.jsx': '//',
  '.ts': '//',
  '.tsx': '//',
  '.java': '//',
  '.c': '//',
  '.cpp': '//',
  '.cc': '//',
  '.cxx': '//',
  '.h': '//',
  '.hpp': '//',
  '.cs': '//',
  '.php': '//',
  '.go': '//',
  '.rs': '//',
  '.swift': '//',
  '.kt': '//',
  '.scala': '//',
  '.dart': '//',

  // Python-style languages
  '.py': '#',
  '.pyx': '#',
  '.pyi': '#',
  '.sh': '#',
  '.bash': '#',
  '.zsh': '#',
  '.fish': '#',
  '.pl': '#',
  '.pm': '#',
  '.rb': '#',
  '.r': '#',
  '.yaml': '#',
  '.yml': '#',
  '.toml': '#',
  '.conf': '#',
  '.cfg': '#',
  '.ini': '#',

  // SQL
  '.sql': '--',

  // HTML/XML style
  '.html': '<!--',
  '.htm': '<!--',
  '.xml': '<!--',
  '.xhtml': '<!--',
  '.svg': '<!--',

  // CSS
  '.css': '/*',
  '.less': '//',
  '.scss': '//',
  '.sass': '//',

  // Other scripting
  '.lua': '--',
  '.vim': '"',
  '.vimrc': '"',

  // Assembly
  '.asm': ';',
  '.s': ';',

  // Batch/PowerShell
  '.bat': 'REM',
  '.cmd': 'REM',
  '.ps1': '#',

  // Functional languages
  '.hs': '--',
  '.lhs': '--',
  '.elm': '--',
  '.ml': '(*',
  '.mli': '(*',
  '.fs': '//',
  '.fsx': '//',
  '.fsi': '//',

  // Lisp family
  '.lisp': ';',
  '.lsp': ';',
  '.cl': ';',
  '.scm': ';',
  '.ss': ';',
  '.clj': ';',
  '.cljs': ';',
  '.cljc': ';',

  // Configuration files
  '.properties': '#',
  '.gitignore': '#',
  '.env': '#',
  '.editorconfig': '#',
  '.dockerfile': '#',
  dockerfile: '#',

  // Default fallback
  '': '//',
}

/**
 * Gets the appropriate comment syntax for a file based on its extension
 */
export function getCommentSyntax(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  return COMMENT_SYNTAX_MAP[ext] || COMMENT_SYNTAX_MAP[''] || '//'
}

/**
 * Formats a comment using the appropriate syntax for the given file
 */
export function formatComment(filePath: string, message: string): string {
  const commentPrefix = getCommentSyntax(filePath)

  if (commentPrefix === '<!--') {
    // HTML/XML style comment
    return `<!-- ${message} -->`
  } else if (commentPrefix === '/*') {
    // CSS style comment
    return `/* ${message} */`
  } else if (commentPrefix === '(*') {
    // OCaml style comment
    return `(* ${message} *)`
  } else {
    // Single line comment style
    return `${commentPrefix} ${message}`
  }
}

/**
 * Adds a comment to content with proper formatting
 */
export function addComment(
  content: string,
  filePath: string,
  message: string
): string {
  const comment = formatComment(filePath, message)
  return content + '\n' + comment
}
