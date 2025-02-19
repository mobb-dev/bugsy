import {
  createSpinner as _createSpinner,
  Options as NanoSpinnerOptions,
  Spinner,
} from 'nanospinner'

function printToStdError(opts?: { text?: string }) {
  if (opts?.text) console.error(opts.text)
}

const mockSpinner: Spinner = {
  success: (opts?: { text?: string }) => {
    printToStdError(opts)
    return mockSpinner
  },
  error: (opts?: { text?: string }) => {
    printToStdError(opts)
    return mockSpinner
  },
  warn: (opts?: { text?: string }) => {
    printToStdError(opts)
    return mockSpinner
  },
  stop: (opts?: { text?: string }) => {
    printToStdError(opts)
    return mockSpinner
  },
  start: (opts?: { text?: string }) => {
    printToStdError(opts)
    return mockSpinner
  },
  update: (opts?: { text?: string }) => {
    printToStdError(opts)
    return mockSpinner
  },
  reset: () => mockSpinner,
  clear: () => mockSpinner,
  spin: () => mockSpinner,
}

export type CreateSpinner = (
  text?: string,
  options?: NanoSpinnerOptions
) => Spinner
export function Spinner({ ci = false } = {}) {
  return {
    createSpinner: (text?: string, options?: NanoSpinnerOptions) =>
      ci ? mockSpinner : _createSpinner(text, options),
  }
}
