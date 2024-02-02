import { addScmToken } from '@mobb/bugsy/commands'
import { errorMessages, ScmTypes } from '@mobb/bugsy/constants'
import { CliError } from '@mobb/bugsy/utils'
import type * as Yargs from 'yargs'

import {
  apiKeyOption,
  scmOrgOption,
  scmRefreshTokenOption,
  scmTokenOption,
  scmTypeOption,
  scmUsernameOption,
} from '../options'
import { AddScmTokenOptions, BaseAddScmTokenOptions } from '../types'

export function addScmTokenBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<BaseAddScmTokenOptions> {
  return args
    .option('scm', scmTypeOption)
    .option('token', scmTokenOption)
    .option('organization', scmOrgOption)
    .option('username', scmUsernameOption)
    .option('refresh-token', scmRefreshTokenOption)
    .option('api-key', apiKeyOption)
    .example(
      '$0 add-scm-token --scm ado --token abcdef0123456 --organization myOrg',
      'Add your SCM (Github, Gitlab, Azure DevOps) token to Mobb to enable automated fixes.'
    )
    .help()
    .demandOption(['scm', 'token'])
}

export function validateAddScmTokenOptions(argv: AddScmTokenOptions) {
  if (!argv.scm) {
    throw new CliError(errorMessages.missingScmType)
  }
  if (!(Object.values(ScmTypes) as string[]).includes(argv.scm)) {
    throw new CliError(errorMessages.invalidScmType)
  }
  if (!argv.token) {
    throw new CliError(errorMessages.missingToken)
  }
  if (argv.scm === ScmTypes.AzureDevOps && !argv.organization) {
    throw new CliError(
      '\nError: --organization flag is required for Azure DevOps'
    )
  }
  if (argv.scm === ScmTypes.Github && !argv.username) {
    throw new CliError('\nError: --username flag is required for GitHub')
  }
}

export async function addScmTokenHandler(args: AddScmTokenOptions) {
  validateAddScmTokenOptions(args)
  await addScmToken(args)
}
