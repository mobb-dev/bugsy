import {
  convertToSarifBuilder,
  convertToSarifHandler,
} from '@mobb/bugsy/args/commands/convert_to_sarif'
import { mobbCliCommand } from '@mobb/bugsy/types'
import chalk from 'chalk'
import yargs from 'yargs/yargs'

import { analyzeBuilder, analyzeHandler } from './commands/analyze'
import { mcpBuilder, mcpHandler } from './commands/mcp'
import { reviewBuilder, reviewHandler } from './commands/review'
import { scanBuilder, scanHandler } from './commands/scan'
import { addScmTokenBuilder, addScmTokenHandler } from './commands/token'
import {
  uploadAiBlameBuilder,
  uploadAiBlameHandler,
} from './commands/upload_ai_blame'

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
      mobbCliCommand.scan,
      chalk.bold(
        'Scan your code for vulnerabilities, get automated fixes right away.'
      ),
      scanBuilder,
      scanHandler
    )
    .command(
      mobbCliCommand.analyze,
      chalk.bold(
        'Provide a code repository, get automated fixes right away. You can also provide a vulnerability report to analyze or have Mobb scan the code for you.'
      ),
      analyzeBuilder,
      analyzeHandler
    )
    .command(
      mobbCliCommand.review,
      chalk.bold(
        'Mobb will review your github pull requests and provide comments with fixes '
      ),
      reviewBuilder,
      reviewHandler
    )
    .command(
      mobbCliCommand.addScmToken,
      chalk.bold(
        'Add your SCM (Github, Gitlab, Azure DevOps) token to Mobb to enable automated fixes.'
      ),
      addScmTokenBuilder,
      addScmTokenHandler
    )
    .command(
      mobbCliCommand.convertToSarif,
      chalk.bold('Convert an existing SAST report to SARIF format.'),
      convertToSarifBuilder,
      convertToSarifHandler
    )
    .command(
      mobbCliCommand.mcp,
      chalk.bold('Launch the MCP (Model Context Protocol) server.'),
      mcpBuilder,
      mcpHandler
    )
    .command(
      mobbCliCommand.uploadAiBlame,
      chalk.bold(
        'Upload AI Blame inference artifacts (prompt + inference) and finalize them.'
      ),
      uploadAiBlameBuilder,
      uploadAiBlameHandler
    )
    .example(
      'npx mobbdev@latest scan -r https://github.com/WebGoat/WebGoat',
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
    .epilog(chalk.bgBlue('Made with ❤️ by Mobb'))
    .showHelpOnFail(true)
    .wrap(Math.min(120, yargsInstance.terminalWidth()))
    .parse()
}
