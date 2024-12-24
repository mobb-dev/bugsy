import { addScmToken } from '@mobb/bugsy/commands'
import { scmFriendlyText } from '@mobb/bugsy/constants'
import { ScmType } from '@mobb/bugsy/features/analysis/scm'
import { CliError } from '@mobb/bugsy/utils'
import type * as Yargs from 'yargs'

import {
  apiKeyOption,
  ciOption,
  scmOrgOption,
  scmRefreshTokenOption,
  scmTokenOption,
  scmTypeOption,
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
    .option('refresh-token', scmRefreshTokenOption)
    .option('api-key', apiKeyOption)
    .option('ci', ciOption)
    .example(
      '$0 add-scm-token --scm-type Ado --url https://dev.azure.com/adoorg/test/_git/repo --token abcdef0123456 --organization myOrg',
      `Add your SCM (${Object.values(scmFriendlyText).join(', ')}) token to Mobb to enable automated fixes.`
    )
    .help()
    .demandOption(['url', 'token'])
}

export async function validateAddScmTokenOptions(argv: AddScmTokenOptions) {
  const scmType = argv['scm-type']
  scmValidationMap[scmType]
}

const scmValidationMap: Record<ScmType, (argv: AddScmTokenOptions) => void> = {
  [ScmType.GitHub]: () => {
    return
  },
  [ScmType.GitLab]: () => {
    return
  },
  [ScmType.Ado]: validateAdo,
  [ScmType.Bitbucket]: () => {
    return
  },
}

function validateAdo(argv: AddScmTokenOptions) {
  if (!argv.organization) {
    throw new CliError(
      '\nError: --organization flag is required for Azure DevOps'
    )
  }
}

export async function addScmTokenHandler(args: AddScmTokenOptions) {
  await validateAddScmTokenOptions(args)
  await addScmToken(args)
}
