import { CliError } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import path from 'path'
import type * as Yargs from 'yargs'
import { z } from 'zod'

type ThrowRepoUrlErrorMessageArgs = {
  error: z.ZodError<string>
  repoUrl?: string
  command: string | number
}

function throwRepoUrlErrorMessage({
  error,
  repoUrl,
  command,
}: ThrowRepoUrlErrorMessageArgs) {
  const errorMessage = error.issues[error.issues.length - 1]?.message
  const formattedErrorMessage = `\nError: ${chalk.bold(
    repoUrl
  )} is ${errorMessage}
Example: \n\tmobbdev ${command} -r ${chalk.bold(
    'https://github.com/WebGoat/WebGoat'
  )}`

  throw new CliError(formattedErrorMessage)
}

const GIT_REPO_URL_PATTERN =
  /^https:\/\/(gitlab|github)\.com\/(([^/.\s]+[/])+)([^/.\s]+)(\.git)?(\/)?$/i

const UrlZ = z
  .string({
    invalid_type_error: 'is not a valid GitHub / GitLab URL',
  })
  .regex(GIT_REPO_URL_PATTERN, {
    message: 'is not a valid GitHub / GitLab URL',
  })

export function validateRepoUrl(
  args: Yargs.ArgumentsCamelCase<{ repo?: string }>
) {
  const repoSafeParseResult = UrlZ.safeParse(args.repo)
  const { success } = repoSafeParseResult
  const [command] = args._
  if (!command) {
    throw new CliError('Command not found')
  }
  if (!success) {
    throwRepoUrlErrorMessage({
      error: repoSafeParseResult.error,
      repoUrl: args.repo,
      command,
    })
  }
}

const supportExtensions = ['.json', '.xml', '.fpr', '.sarif']
export function validateReportFileFormat(reportFile: string) {
  if (!supportExtensions.includes(path.extname(reportFile))) {
    throw new CliError(
      `\n${chalk.bold(
        reportFile
      )} is not a supported file extension. Supported extensions are: ${chalk.bold(
        supportExtensions.join(', ')
      )}\n`
    )
  }
}
