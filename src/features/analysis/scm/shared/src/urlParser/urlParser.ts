import { z } from 'zod'

import { ParseScmURLRes, scmCloudUrl, ScmType } from '../types'

export const ADO_PREFIX_PATH = 'tfs'

const NAME_REGEX = /[a-z0-9\-_.+]+/i

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
  const normalizedPath = prefixPath ? pathname.slice(1) : pathname
  if (
    hostnameParts.length === 3 &&
    hostnameParts[1] === 'visualstudio' &&
    hostnameParts[2] === 'com'
  ) {
    // the pattern is: https://{org-name}.visualstudio.com/_git/{projectName/repoName}
    if (normalizedPath.length === 2 && normalizedPath[0] === '_git') {
      const [_git, projectName] = normalizedPath
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
    if (normalizedPath.length === 3 && normalizedPath[1] === '_git') {
      const [projectName, _git, repoName] = normalizedPath

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
    if (normalizedPath[normalizedPath.length - 2] === '_git') {
      if (normalizedPath.length === 3) {
        const [organization, _git, repoName] = normalizedPath
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
      if (normalizedPath.length === 4) {
        const [organization, projectName, _git, repoName] = normalizedPath
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

/**
 * Parses SSH URL format: git@hostname:path
 * Returns null if not an SSH URL or parsing fails.
 * For unknown hosts, returns basic info with scmType: 'Unknown'.
 *
 * Supported formats:
 * - git@github.com:org/repo.git
 * - git@gitlab.com:group/subgroup/repo.git
 * - git@bitbucket.org:org/repo.git
 * - git@ssh.dev.azure.com:v3/org/project/repo
 * - git@custom-host.com:org/repo.git (returns Unknown type)
 */
function parseSshUrl(scmURL: string, scmType?: ScmType): ParseScmURLRes {
  // Match SSH format: git@hostname:path (with optional .git suffix)
  const sshMatch = scmURL.match(/^git@([^:]+):(.+?)(?:\.git)?$/)
  if (!sshMatch) return null

  const hostname = sshMatch[1]
  const pathPart = sshMatch[2]
  if (!hostname || !pathPart) return null

  const normalizedHostname = hostname.toLowerCase()

  // Handle ADO SSH format: git@ssh.dev.azure.com:v3/org/project/repo
  // The "v3" prefix needs to be stripped from the path
  let projectPath = pathPart
  if (
    normalizedHostname === 'ssh.dev.azure.com' &&
    projectPath.startsWith('v3/')
  ) {
    projectPath = projectPath.substring(3) // Remove 'v3/' prefix
  }

  const pathElements = projectPath.split('/')

  // Handle ADO SSH URLs directly (format after v3/ strip: org/project/repo)
  // This is separate from detectAdoUrl which handles HTTPS URLs (requiring _git in path)
  if (normalizedHostname === 'ssh.dev.azure.com') {
    if (pathElements.length === 3) {
      const [organization, projectName, repoName] = pathElements
      if (
        organization?.match(NAME_REGEX) &&
        projectName &&
        repoName?.match(NAME_REGEX)
      ) {
        return {
          scmType: ScmType.Ado,
          hostname: normalizedHostname,
          organization,
          projectName: z.string().parse(projectName),
          repoName,
          projectPath,
          protocol: 'ssh:',
          pathElements,
          prefixPath: '',
        }
      }
    }
    return null // Invalid ADO SSH URL format
  }

  const repo = getRepoInfo({
    pathname: pathElements,
    hostname: normalizedHostname,
    scmType,
  })

  // For unknown hosts, derive organization and repoName from path
  // Require at least 2 path segments for a valid repo URL (org/repo)
  // Don't return Unknown for known SCM hosts with invalid paths - return null
  if (!repo) {
    const knownHosts = [
      new URL(scmCloudUrl.GitHub).hostname,
      new URL(scmCloudUrl.GitLab).hostname,
      new URL(scmCloudUrl.Bitbucket).hostname,
      new URL(scmCloudUrl.Ado).hostname,
      'ssh.dev.azure.com', // ADO SSH host
    ]
    if (knownHosts.includes(normalizedHostname)) {
      return null // Known host with invalid path pattern
    }
    const filteredPathElements = pathElements.filter(Boolean)
    if (filteredPathElements.length < 2) {
      return null
    }
    const organization = filteredPathElements[0] || ''
    const repoName = filteredPathElements[filteredPathElements.length - 1] || ''
    return {
      scmType: 'Unknown',
      hostname: normalizedHostname,
      organization,
      projectPath,
      repoName,
      protocol: 'ssh:',
      pathElements: filteredPathElements,
    }
  }

  const { organization, repoName } = repo

  if (!organization || !repoName) return null
  if (!organization.match(NAME_REGEX) || !repoName.match(NAME_REGEX))
    return null

  const res = {
    hostname: normalizedHostname,
    organization,
    projectPath,
    repoName,
    protocol: 'ssh:',
    pathElements,
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
}

export const parseScmURL = (
  scmURL: string,
  scmType?: ScmType
): ParseScmURLRes => {
  // Try SSH format first
  const sshResult = parseSshUrl(scmURL, scmType)
  if (sshResult) return sshResult

  // Fall back to HTTPS/HTTP format
  try {
    const url = new URL(scmURL)
    const hostname = url.hostname.toLowerCase()
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')

    const repo = getRepoInfo({
      pathname: projectPath.split('/'),
      hostname,
      scmType,
    })

    // For unknown hosts, derive organization and repoName from path
    // Require at least 2 path segments for a valid repo URL (org/repo)
    // Don't return Unknown for known SCM hosts with invalid paths - return null
    if (!repo) {
      const knownHosts = [
        new URL(scmCloudUrl.GitHub).hostname,
        new URL(scmCloudUrl.GitLab).hostname,
        new URL(scmCloudUrl.Bitbucket).hostname,
        new URL(scmCloudUrl.Ado).hostname,
      ]
      if (knownHosts.includes(hostname)) {
        return null // Known host with invalid path pattern
      }
      const pathElements = projectPath.split('/').filter(Boolean)
      if (pathElements.length < 2) {
        return null
      }
      const organization = pathElements[0] || ''
      const repoName = pathElements[pathElements.length - 1] || ''
      return {
        scmType: 'Unknown',
        hostname,
        organization,
        projectPath,
        repoName,
        protocol: url.protocol,
        pathElements,
      }
    }

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
