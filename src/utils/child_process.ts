import cp from 'node:child_process'

import Debug from 'debug'
import * as process from 'process'
import supportsColor from 'supports-color'

const { stdout } = supportsColor

type ChildProcessArgs = {
  childProcess: cp.ChildProcess
  name: string
}

type BaseChildProcessArgs = {
  args: string[]
  processPath: string
  name: string
}

type ChildProcessOptions = {
  display: boolean
}

export function createFork(
  { args, processPath, name }: BaseChildProcessArgs,
  options: ChildProcessOptions
) {
  const child = cp.fork(processPath, args, {
    stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
    env: { FORCE_COLOR: stdout ? '1' : '0' },
  })
  return createChildProcess({ childProcess: child, name }, options)
}
export function createSpwan(
  { args, processPath, name }: BaseChildProcessArgs,
  options: ChildProcessOptions
) {
  const child = cp.spawn(processPath, args, {
    stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
    env: { FORCE_COLOR: stdout ? '1' : '0' },
  })
  return createChildProcess({ childProcess: child, name }, options)
}

function createChildProcess(
  { childProcess, name }: ChildProcessArgs,
  options: ChildProcessOptions
): Promise<{ message: string; code: number | null }> {
  const debug = Debug(`mobbdev:${name}`)
  const { display } = options
  return new Promise((resolve, reject) => {
    let out = ''
    const onData = (chunk: Buffer) => {
      debug(`chunk received from ${name} std ${chunk}`)
      out += chunk
    }
    if (!childProcess || !childProcess?.stdout || !childProcess?.stderr) {
      debug(`unable to fork ${name}`)
      reject(new Error(`unable to fork ${name}`))
    }

    childProcess.stdout?.on('data', onData)
    childProcess.stderr?.on('data', onData)

    if (display) {
      childProcess.stdout?.pipe(process.stdout)
      childProcess.stderr?.pipe(process.stderr)
    }

    childProcess.on('exit', (code) => {
      debug(`${name} exit code ${code}`)
      resolve({ message: out, code })
    })
    childProcess.on('error', (err) => {
      debug(`${name} error %o`, err)
      reject(err)
    })
  })
}
