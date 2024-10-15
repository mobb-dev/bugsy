import { setTimeout } from 'node:timers/promises'

import { spawn } from 'node-pty'

/**
 * This is a TTY terminal emulator which allows to interact with Bugsy the same
 * way as user would do in a typical Linux terminal.
 */
export default class TerminalEmulator {
  #process = null
  #out = ''
  #exitCode = null
  #exitPromise = null

  /**
   * @param {string} command - CLI command.
   * @param {Array[string]} args - CLI command arguments.
   * @param {Object} options - Custom spawn arguments.
   */
  constructor(command, args, options) {
    this.#process = spawn(command, args, options)

    this.#process.onData((data) => {
      this.#out += data
    })

    this.#exitPromise = new Promise((resolve) => {
      this.#process.onExit((state) => {
        this.#exitCode = state.exitCode
        resolve()
      })
    })
  }

  /**
   * Wait for a certain string in the command output.
   *
   * @param {RegExp} match - Regular expression to wait.
   * @param {number} timeout - Max waiting time.
   * @returns {Promise<void>}
   */
  async waitForString(match, timeout = 100000) {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      if (match.test(this.getOutput())) {
        return
      }
      await setTimeout(100)
    }

    this.kill()
    throw new Error(`Waiting for ${match} for too long`)
  }

  /**
   * Kill the subprocess.
   */
  kill() {
    this.#process.kill()
  }

  /**
   * Send arbitrary string to the command's stdin.
   *
   * @param {string} value
   */
  communicate(value) {
    this.#process.write(value)
  }

  /**
   * Send Enter key press to the command's stdin.
   */
  sendEnterKey() {
    this.communicate('\r')
  }

  /**
   * Send Arrow Down key press to the command's stdin.
   */
  sendArrowDownKey() {
    this.communicate('\x1B[B')
  }

  /**
   * Wait command's exit.
   */
  async waitForExit() {
    await this.#exitPromise
  }

  /**
   * Get current stdout+stderr buffer.
   *
   * @returns {string}
   */
  getOutput() {
    return this.#out
  }

  /**
   * Get command's exit code.
   *
   * @returns {null|number}
   */
  getExitCode() {
    return this.#exitCode
  }
}
