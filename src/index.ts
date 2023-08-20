import { hideBin } from 'yargs/helpers'

import { parseArgs } from './args/yargs'
import { CliError } from './utils'

async function run() {
  return parseArgs(hideBin(process.argv))
}

;(async () => {
  try {
    await run()
    process.exit(0)
  } catch (err) {
    if (err instanceof CliError) {
      console.error(err.message)
      process.exit(1)
    }
    // unexpected error - print stack trace
    console.error(
      'Something went wrong, please try again or contact support if issue persists.'
    )
    console.error(err)
    process.exit(1)
  }
})()
