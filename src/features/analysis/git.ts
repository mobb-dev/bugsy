import Debug from 'debug'

import { GitService } from './scm/git/GitService'

const debug = Debug('mobbdev:git')

export type GetGitInfoResult =
  | {
      success: true
      repoUrl: string
      hash: string
      reference: string
    }
  | {
      success: false
      repoUrl?: string
      hash?: string
      reference?: string
    }

export async function getGitInfo(
  srcDirPath: string
): Promise<GetGitInfoResult> {
  debug('getting git info for %s', srcDirPath)

  const gitService = new GitService(srcDirPath)

  try {
    const validationResult = await gitService.validateRepository()
    if (!validationResult.isValid) {
      debug('folder is not a git repo')
      return {
        success: false,
        hash: undefined,
        reference: undefined,
        repoUrl: undefined,
      }
    }

    const gitInfo = await gitService.getGitInfo()
    return {
      success: true,
      ...gitInfo,
    }
  } catch (e) {
    if (e instanceof Error) {
      debug('failed to run git %o', e)
      if (e.message.includes(' spawn ')) {
        debug('git cli not installed')
      } else {
        throw e
      }
    }
    throw e
  }
}
