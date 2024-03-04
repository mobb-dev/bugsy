import { addScmToken } from '@mobb/bugsy/commands'
import { errorMessages } from '@mobb/bugsy/constants'
import { ScmType } from '@mobb/bugsy/features/analysis/scm'
import { CliError } from '@mobb/bugsy/utils'
import type * as Yargs from 'yargs'

import {
  apiKeyOption,
  scmOrgOption,
  scmRefreshTokenOption,
  scmTokenOption,
  scmTypeOption,
  scmUsernameOption,
  urlOption,
} from '../options'
import { AddScmTokenOptions, BaseAddScmTokenOptions } from '../types'

export function addScmTokenBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<BaseAddScmTokenOptions> {
  return args
    .option('scm-type', scmTypeOption)
    .option('url', urlOption)
    .option('token', scmTokenOption)
    .option('organization', scmOrgOption)
    .option('username', scmUsernameOption)
    .option('refresh-token', scmRefreshTokenOption)
    .option('api-key', apiKeyOption)
    .example(
      '$0 add-scm-token --scm-type Ado --url https://dev.azure.com/adoorg/test/_git/repo --token abcdef0123456 --organization myOrg',
      'Add your SCM (Github, Gitlab, Azure DevOps) token to Mobb to enable automated fixes.'
    )
    .help()
    .demandOption(['url', 'token'])
}

export function validateAddScmTokenOptions(argv: AddScmTokenOptions) {
  if (!argv.url) {
    throw new CliError(errorMessages.missingUrl)
  }
  if (!argv.token) {
    throw new CliError(errorMessages.missingToken)
  }
  if (
    ScmType.GitHub !== argv.scmType &&
    ScmType.Ado !== argv.scmType &&
    ScmType.GitLab !== argv.scmType
  ) {
    throw new CliError(
      '\nError: --scm-type must reference a valid SCM type (GitHub, GitLab, Ado)'
    )
  }
  const urlObj = new URL(argv.url)
  if (urlObj.hostname === 'github.com' && !argv.username) {
    throw new CliError('\nError: --username flag is required for GitHub')
  }
  if (
    (urlObj.hostname === 'dev.azure.com' ||
      urlObj.hostname.endsWith('.visualstudio.com')) &&
    !argv.organization
  ) {
    throw new CliError(
      '\nError: --organization flag is required for Azure DevOps'
    )
  }
}

export async function addScmTokenHandler(args: AddScmTokenOptions) {
  validateAddScmTokenOptions(args)
  await addScmToken(args)
}
