import simpleGit, { SimpleGit } from 'simple-git'

// Logger interface that can work with different logging systems
type Logger = {
  debug: (data: unknown, msg?: string) => void
  warn: (data: unknown, msg?: string) => void
}

// Default console logger fallback. `console.debug` is silent by default in
// Node unless NODE_DEBUG/--inspect is set, so the debug path routes through
// `console.log` to remain visible to a fallback caller.
const tag =
  (sink: (...args: unknown[]) => void) =>
  (data: unknown, msg?: string): void => {
    if (msg) {
      const sanitizedMsg = String(msg).replace(/\n|\r/g, '')
      sink(`[GIT] ${sanitizedMsg}`, data)
    } else {
      sink('[GIT]', data)
    }
  }
const defaultLogger: Logger = {
  debug: tag(console.log),
  warn: tag(console.warn),
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

    logger.debug({ callID, bin }, 'Start git CLI call')

    let errChunks: string[] = []
    let outChunks: string[] = []
    let isStdoutDone = false
    let isStderrDone = false

    const onStderrData = (data: Buffer) => errChunks.push(data.toString('utf8'))
    const onStdoutData = (data: Buffer) => outChunks.push(data.toString('utf8'))

    stderr.on('data', onStderrData)
    stdout.on('data', onStdoutData)

    let finalized = false

    function finalizeAndCleanup() {
      if (finalized || !isStderrDone || !isStdoutDone) {
        return
      }
      finalized = true

      const logObj = {
        callID,
        bin,
        err: `${errChunks.join('').slice(0, 200)}...`,
        out: `${outChunks.join('').slice(0, 200)}...`,
      }
      logger.debug(logObj, 'git log output')

      // Remove listeners and free chunk arrays to prevent FD/memory leaks
      stderr.removeListener('data', onStderrData)
      stdout.removeListener('data', onStdoutData)
      errChunks = []
      outChunks = []
    }

    function markDone(stream: 'stderr' | 'stdout') {
      if (stream === 'stderr') isStderrDone = true
      else isStdoutDone = true
      finalizeAndCleanup()
    }

    stderr.on('close', () => markDone('stderr'))
    stdout.on('close', () => markDone('stdout'))

    // Handle stream errors to prevent unhandled error events and ensure cleanup
    stderr.on('error', (error) => {
      logger.warn({ callID, error: String(error) }, 'git stderr stream error')
      markDone('stderr')
    })
    stdout.on('error', (error) => {
      logger.warn({ callID, error: String(error) }, 'git stdout stream error')
      markDone('stdout')
    })
  })
}
