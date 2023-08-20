import {
  createSpinner as _createSpinner,
  Options as NanoSpinnerOptions,
} from 'nanospinner'
import { Spinner } from 'nanospinner'

const mockSpinner: Spinner = {
  success: () => mockSpinner,
  error: () => mockSpinner,
  warn: () => mockSpinner,
  stop: () => mockSpinner,
  start: () => mockSpinner,
  update: () => mockSpinner,
  reset: () => mockSpinner,
  clear: () => mockSpinner,
  spin: () => mockSpinner,
}

export function Spinner({ ci = false } = {}) {
  return {
    createSpinner: (text?: string, options?: NanoSpinnerOptions) =>
      ci ? mockSpinner : _createSpinner(text, options),
  }
}
