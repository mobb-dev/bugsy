import { z } from 'zod'

import { ADO_PREFIX_PATH, NAME_REGEX } from '..'
import { ParseScmURLRes, scmCloudUrl, ScmType } from '../types'

type BaseRepo = {
  repoName: string | undefined
  organization: string | undefined
}

type Repo =
  | ({
      scmType: ScmType.GitHub | ScmType.Bitbucket | ScmType.GitLab
    } & BaseRepo)
  | ({
      scmType: ScmType.Ado
      projectName: string
      prefixPath: string
    } & BaseRepo)
  | null

// we're trying to parse the url according to the patterns described in the this
// https://docs.specsolutions.eu/specsync/important-concepts/what-is-my-server-url

function detectAdoUrl(args: GetRepoInfoArgs): Repo {
  const { pathname, hostname, scmType } = args
  const hostnameParts = hostname.split('.')
  const adoCloudHostname = new URL(scmCloudUrl.Ado).hostname
  // sometimes the path starts with tfs
  // if the url does have 'tfs' we'll need to return it as a prefix path
  const prefixPath =
    pathname.at(0)?.toLowerCase() === ADO_PREFIX_PATH ? ADO_PREFIX_PATH : ''
  // we have the same parsing logic when there's 'tfs' in the beginning of the path
  const normilizedPath = prefixPath ? pathname.slice(1) : pathname
  if (
    hostnameParts.length === 3 &&
    hostnameParts[1] === 'visualstudio' &&
    hostnameParts[2] === 'com'
  ) {
    // the pattern is: https://{org-name}.visualstudio.com/_git/{projectName/repoName}
    if (normilizedPath.length === 2 && normilizedPath[0] === '_git') {
      const [_git, projectName] = normilizedPath
      const [organization] = hostnameParts
      return {
        scmType: ScmType.Ado,
        organization,
        // project has single repo - repoName === projectName
        projectName: z.string().parse(projectName),
        repoName: projectName,
        prefixPath,
      }
    }
    // project has more than one repo
    // the pattern is: https://{org-name}.visualstudio.com/{projectName}/_git/{repoName}
    if (normilizedPath.length === 3 && normilizedPath[1] === '_git') {
      const [projectName, _git, repoName] = normilizedPath

      const [organization] = hostnameParts
      return {
        scmType: ScmType.Ado,
        organization,
        projectName: z.string().parse(projectName),
        repoName,
        prefixPath,
      }
    }
  }
  // custom domain / dev.azure.com
  if (hostname === adoCloudHostname || scmType === ScmType.Ado) {
    // the pattern is: https://{ado-domain}/(tfs?)/{org-name}/_git/{repoName/projectName}
    if (normilizedPath[normilizedPath.length - 2] === '_git') {
      if (normilizedPath.length === 3) {
        const [organization, _git, repoName] = normilizedPath
        return {
          scmType: ScmType.Ado,
          organization,
          // project has only one repo - repoName === projectName
          projectName: z.string().parse(repoName),
          repoName,
          prefixPath,
        }
      }

      // the pattern is: https://{ado-domain}/(tfs?)/{org-name}{project-name}/_git/{repo-name}
      if (normilizedPath.length === 4) {
        const [organization, projectName, _git, repoName] = normilizedPath
        return {
          scmType: ScmType.Ado,
          organization,
          projectName: z.string().parse(projectName),
          repoName,
          prefixPath,
        }
      }
    }
  }
  return null
}

function detectGithubUrl(args: GetRepoInfoArgs): Repo {
  const { pathname, hostname, scmType } = args
  const githubHostname = new URL(scmCloudUrl.GitHub).hostname
  if (hostname === githubHostname || scmType === ScmType.GitHub) {
    if (pathname.length === 2) {
      return {
        scmType: ScmType.GitHub,
        organization: pathname[0],
        repoName: pathname[1],
      }
    }
  }
  return null
}
function detectGitlabUrl(args: GetRepoInfoArgs): Repo {
  const { pathname, hostname, scmType } = args
  const gitlabHostname = new URL(scmCloudUrl.GitLab).hostname
  if (hostname === gitlabHostname || scmType === ScmType.GitLab) {
    if (pathname.length >= 2) {
      return {
        scmType: ScmType.GitLab,
        organization: pathname[0],
        repoName: pathname[pathname.length - 1],
      }
    }
  }
  return null
}

function detectBitbucketUrl(args: GetRepoInfoArgs): Repo {
  const { pathname, hostname, scmType } = args
  const bitbucketHostname = new URL(scmCloudUrl.Bitbucket).hostname
  if (hostname === bitbucketHostname || scmType === ScmType.Bitbucket) {
    if (pathname.length === 2) {
      return {
        scmType: ScmType.Bitbucket,
        organization: pathname[0],
        repoName: pathname[1],
      }
    }
  }
  return null
}

type GetRepoInfoArgs = {
  pathname: string[]
  hostname: string
  scmType?: ScmType
}

export const getRepoUrlFunctionMap: Record<
  ScmType,
  (args: GetRepoInfoArgs) => Repo
> = {
  [ScmType.GitLab]: detectGitlabUrl,
  [ScmType.GitHub]: detectGithubUrl,
  [ScmType.Ado]: detectAdoUrl,
  [ScmType.Bitbucket]: detectBitbucketUrl,
} as const

function getRepoInfo(args: GetRepoInfoArgs): Repo {
  // check the url against all the possible scm types
  for (const detectUrl of Object.values(getRepoUrlFunctionMap)) {
    const detectUrlRes = detectUrl(args)
    if (detectUrlRes) {
      return detectUrlRes
    }
  }
  return null
}

export const parseScmURL = (
  scmURL: string,
  scmType?: ScmType
): ParseScmURLRes => {
  try {
    const url = new URL(scmURL)
    const hostname = url.hostname.toLowerCase()
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')

    const repo = getRepoInfo({
      pathname: projectPath.split('/'),
      hostname,
      scmType,
    })

    if (!repo) return null

    const { organization, repoName } = repo

    if (!organization || !repoName) return null
    if (!organization.match(NAME_REGEX) || !repoName.match(NAME_REGEX))
      return null
    const res = {
      hostname,
      organization,
      projectPath,
      repoName,
      protocol: url.protocol,
      pathElements: projectPath.split('/'),
    }
    if (repo.scmType === ScmType.Ado) {
      return {
        projectName: repo.projectName,
        prefixPath: repo.prefixPath,
        scmType: repo.scmType,
        ...res,
      }
    }
    return {
      scmType: repo.scmType,
      ...res,
    }
  } catch (e) {
    return null
  }
}
