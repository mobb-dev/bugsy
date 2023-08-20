import chalk from 'chalk'
import yargs from 'yargs/yargs'

import { analyzeBuilder, analyzeHandler } from './commands/analyze'
import { scanBuilder, scanHandler } from './commands/scan'

export const parseArgs = async (args: readonly string[]) => {
  const yargsInstance = yargs(args)
  return yargsInstance
    .updateStrings({
      'Commands:': chalk.yellow.underline.bold('Commands:'),
      'Options:': chalk.yellow.underline.bold('Options:'),
      'Examples:': chalk.yellow.underline.bold('Examples:'),
      'Show help': chalk.bold('Show help'),
    })
    .usage(
      `${chalk.bold(
        '\n Bugsy - Trusted, Automatic Vulnerability Fixer 🕵️‍♂️\n\n'
      )} ${chalk.yellow.underline.bold('Usage:')} \n  $0 ${chalk.green(
        '<command>'
      )} ${chalk.dim('[options]')}
            `
    )
    .version(false)
    .command(
      'scan',
      chalk.bold(
        'Scan your code for vulnerabilities, get automated fixes right away.'
      ),
      scanBuilder,
      scanHandler
    )
    .command(
      'analyze',
      chalk.bold(
        'Provide a vulnerability report and relevant code repository, get automated fixes right away.'
      ),
      analyzeBuilder,
      analyzeHandler
    )
    .example(
      '$0 scan -r https://github.com/WebGoat/WebGoat',
      'Scan an existing repository'
    )
    .command({
      command: '*',
      handler() {
        yargsInstance.showHelp()
      },
    })
    .strictOptions()
    .help('h')
    .alias('h', 'help')
    .epilog(chalk.bgBlue('Made with ❤️  by Mobb'))
    .showHelpOnFail(true)
    .wrap(Math.min(120, yargsInstance.terminalWidth()))
    .parse()
}
