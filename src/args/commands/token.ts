import { addScmToken } from '@mobb/bugsy/commands'
import { scmCloudHostname, ScmType } from '@mobb/bugsy/features/analysis/scm'
import { CliError } from '@mobb/bugsy/utils'
import type * as Yargs from 'yargs'
import { z } from 'zod'

import {
  apiKeyOption,
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
    .example(
      '$0 add-scm-token --scm-type Ado --url https://dev.azure.com/adoorg/test/_git/repo --token abcdef0123456 --organization myOrg',
      'Add your SCM (Github, Gitlab, Azure DevOps) token to Mobb to enable automated fixes.'
    )
    .help()
    .demandOption(['url', 'token'])
}

export function validateAddScmTokenOptions(argv: AddScmTokenOptions) {
  if (!z.nativeEnum(ScmType).safeParse(argv.scmType).success) {
    throw new CliError(
      '\nError: --scm-type must reference a valid SCM type (GitHub, GitLab, Ado, Bitbutcket)'
    )
  }
  Object.values(scmValidationMap).forEach((validate) => validate(argv))
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
  const urlObj = new URL(argv.url)
  if (
    (urlObj.hostname.toLowerCase() === scmCloudHostname.Ado ||
      urlObj.hostname.toLowerCase().endsWith('.visualstudio.com')) &&
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
