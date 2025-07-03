export class ApiConnectionError extends Error {
  constructor(message: string = 'Failed to connect to the API') {
    super(message)
    this.name = 'ApiConnectionError'
  }
}

export class CliLoginError extends Error {
  constructor(message: string = 'CLI login failed') {
    super(message)
    this.name = 'CliLoginError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class NoFilesError extends Error {
  constructor(message: string = 'No files to fix') {
    super(message)
    this.name = 'NoFilesError'
  }
}

export class GqlClientError extends Error {
  constructor(message: string = 'GraphQL client not initialized') {
    super(message)
    this.name = 'GqlClientError'
  }
}

export class FileProcessingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileProcessingError'
  }
}

export class ReportInitializationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReportInitializationError'
  }
}

export class FileUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileUploadError'
  }
}

export class ScanError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ScanError'
  }
}

export class FailedToGetApiTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FailedToGetApiTokenError'
  }
}

export class ReportDigestError extends Error {
  static defaultMessage =
    '🕵️‍♂️ Digesting report failed. Please verify that the file provided is of a valid supported report format.'

  constructor(
    message: string,
    public failReason?: string
  ) {
    super(message)
    this.name = 'ReportDigestError'
    this.failReason = failReason
  }

  getDisplayMessage(): string {
    if (this.failReason?.trim()) {
      return `🕵️‍♂️ Digesting report failed. ${this.failReason}`
    }
    return ReportDigestError.defaultMessage
  }
}
