import { z } from 'zod'

import { AdoSCMLib } from './ado'
import { BitbucketSCMLib } from './bitbucket'
import { InvalidRepoUrlError, RepoNoTokenAccessError } from './errors'
import { GithubSCMLib } from './github/GithubSCMLib'
import { GitlabSCMLib } from './gitlab'
import { SCMLib } from './scm'
import { StubSCMLib } from './StubSCMLib'
import { ScmInitParams, ScmLibScmType, scmLibScmTypeToScmType } from './types'

export async function createScmLib(
  { url, accessToken, scmType, scmOrg }: ScmInitParams,
  { propagateExceptions = false } = {}
): Promise<SCMLib> {
  const trimmedUrl = url
    ? url.trim().replace(/\/$/, '').replace(/.git$/i, '')
    : undefined
  try {
    switch (scmType) {
      case ScmLibScmType.GITHUB: {
        const scm = new GithubSCMLib(trimmedUrl, accessToken, scmOrg)
        await scm.validateParams()
        return scm
      }
      case ScmLibScmType.GITLAB: {
        const scm = new GitlabSCMLib(trimmedUrl, accessToken, scmOrg)
        await scm.validateParams()
        return scm
      }
      case ScmLibScmType.ADO: {
        const scm = new AdoSCMLib(trimmedUrl, accessToken, scmOrg)
        // we make async constructor here, which can cause uncaught promise rejection
        // we consume the promise here to make sure we catch the error
        // todo: we should move this async logic out of the constructor
        await scm.getAdoSdk()
        await scm.validateParams()
        return scm
      }
      case ScmLibScmType.BITBUCKET: {
        const scm = new BitbucketSCMLib(trimmedUrl, accessToken, scmOrg)
        await scm.validateParams()
        return scm
      }
    }
  } catch (e) {
    if (e instanceof InvalidRepoUrlError && url) {
      throw new RepoNoTokenAccessError(
        'no access to repo',
        scmLibScmTypeToScmType[z.nativeEnum(ScmLibScmType).parse(scmType)]
      )
    }
    console.error(`error validating scm: ${scmType} `, e)
    if (propagateExceptions) {
      throw e
    }
  }

  return new StubSCMLib(trimmedUrl, undefined, undefined)
}
