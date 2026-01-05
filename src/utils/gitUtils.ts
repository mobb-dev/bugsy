import simpleGit, { SimpleGit } from 'simple-git'

// Logger interface that can work with different logging systems
type Logger = {
  info: (data: unknown, msg?: string) => void
}

// Default console logger fallback
const defaultLogger: Logger = {
  info: (data: unknown, msg?: string) => {
    if (msg) {
      const sanitizedMsg = String(msg).replace(/\n|\r/g, '')
      console.log(`[GIT] ${sanitizedMsg}`, data)
    } else {
      console.log('[GIT]', data)
    }
  },
}

/** Creates a SimpleGit instance with output logging configured. */
export function createGitWithLogging(
  dirName: string,
  logger: Logger = defaultLogger
): SimpleGit {
  return simpleGit(dirName, {
    maxConcurrentProcesses: 6,
  }).outputHandler((bin, stdout, stderr) => {
    const callID = Math.random()

    logger.info({ callID, bin }, 'Start git CLI call')

    const errChunks: string[] = []
    const outChunks: string[] = []
    let isStdoutClosed = false
    let isStderrClosed = false

    stderr.on('data', (data) => errChunks.push(data.toString('utf8')))
    stdout.on('data', (data) => outChunks.push(data.toString('utf8')))

    function logData() {
      if (!isStderrClosed || !isStdoutClosed) {
        return
      }
      const logObj = {
        callID,
        bin,
        err: `${errChunks.join('').slice(0, 200)}...`,
        out: `${outChunks.join('').slice(0, 200)}...`,
      }
      logger.info(logObj, 'git log output')
    }

    stderr.on('close', () => {
      isStderrClosed = true
      logData()
    })
    stdout.on('close', () => {
      isStdoutClosed = true
      logData()
    })
  })
}
