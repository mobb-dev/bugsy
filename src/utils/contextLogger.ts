import debugModule from 'debug'

const debug = debugModule('mobb:shared')
/**
 * Context-aware logger that automatically detects the environment:
 * - When running in backend services: Uses pino logger with structured logging
 * - When running in CLI: Uses debug logger
 */
type Logger = {
  info: (message: string, data?: object) => void
  warn: (message: string, data?: object) => void
  debug: (message: string, data?: object) => void
  error: (message: string, data?: object) => void
}

let _contextLogger: Logger | null = null

const createContextLogger = async () => {
  if (_contextLogger) return _contextLogger

  try {
    // Try to import the backend logger (when running in backend services)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let logger: any
    try {
      // Try build path first (Docker/production)
      let module
      try {
        const buildPath =
          '../../../../../tscommon/backend/build/src/utils/logger'
        module = await import(buildPath)
      } catch (e) {
        // If build path fails, try source path (local development)
        const sourcePath = '../../../../../tscommon/backend/src/utils/logger'
        module = await import(sourcePath)
      }
      logger = module.logger
    } catch {
      // Fall through if both paths fail
    }

    if (logger) {
      _contextLogger = {
        info: (message: string, data?: object) =>
          data ? logger.info(data, message) : logger.info(message),
        warn: (message: string, data?: object) =>
          data ? logger.warn(data, message) : logger.warn(message),
        debug: (message: string, data?: object) =>
          data ? logger.debug(data, message) : logger.debug(message),
        error: (message: string, data?: object) =>
          data ? logger.error(data, message) : logger.error(message),
      }
      return _contextLogger
    }
  } catch {
    // Fall through to debug logger
  }

  // Fallback to debug logger (when running in CLI)
  _contextLogger = {
    info: (message: string, data?: object) => debug(message, data),
    warn: (message: string, data?: object) => debug(message, data),
    debug: (message: string, data?: object) => debug(message, data),
    error: (message: string, data?: object) => debug(message, data),
  }
  return _contextLogger
}

export const contextLogger = {
  info: async (message: string, data?: object) => {
    const logger = await createContextLogger()
    return logger.info(message, data)
  },
  debug: async (message: string, data?: object) => {
    const logger = await createContextLogger()
    return logger.debug(message, data)
  },
  warn: async (message: string, data?: object) => {
    const logger = await createContextLogger()
    return logger.warn(message, data)
  },
  error: async (message: string, data?: object) => {
    const logger = await createContextLogger()
    return logger.error(message, data)
  },
}
