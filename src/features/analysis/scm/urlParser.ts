import { ScmType } from './scm'

type Repo = {
  repoName: string | undefined
  organization: string | undefined
  projectName: string | undefined
} | null

function getRepoInfo(
  pathname: string[],
  hostname: string,
  scmType?: ScmType
): Repo {
  const hostnameParts = hostname.split('.')
  if (
    hostnameParts.length === 3 &&
    hostnameParts[1] === 'visualstudio' &&
    hostnameParts[2] === 'com'
  ) {
    if (pathname.length === 2 && pathname[0] === '_git') {
      return {
        organization: hostnameParts[0],
        projectName: pathname[1],
        repoName: pathname[1],
      }
    }
    if (pathname.length === 3 && pathname[1] === '_git') {
      return {
        organization: hostnameParts[0],
        projectName: pathname[0],
        repoName: pathname[2],
      }
    }
  }
  if (hostname === 'dev.azure.com' || scmType === ScmType.Ado) {
    if (pathname.length === 3 && pathname[1] === '_git') {
      return {
        organization: pathname[0],
        projectName: pathname[2],
        repoName: pathname[2],
      }
    }
    if (pathname.length === 4 && pathname[2] === '_git') {
      return {
        organization: pathname[0],
        projectName: pathname[1],
        repoName: pathname[3],
      }
    }
  }
  if (hostname === 'github.com' || scmType === ScmType.GitHub) {
    if (pathname.length === 2) {
      return {
        organization: pathname[0],
        projectName: undefined,
        repoName: pathname[1],
      }
    }
  }
  if (hostname === 'gitlab.com' || scmType === ScmType.GitLab) {
    if (pathname.length >= 2) {
      return {
        organization: pathname[0],
        projectName: undefined,
        repoName: pathname[pathname.length - 1],
      }
    }
  }

  return null
}

const NAME_REGEX = /[a-z0-9\-_.+]+/i

export const parseScmURL = (scmURL: string, scmType?: ScmType) => {
  try {
    const url = new URL(scmURL)
    const hostname = url.hostname.toLowerCase()
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')

    const repo = getRepoInfo(projectPath.split('/'), hostname, scmType)

    if (!repo) return null

    const { organization, repoName, projectName } = repo

    if (!organization || !repoName) return null
    if (!organization.match(NAME_REGEX) || !repoName.match(NAME_REGEX))
      return null

    return {
      hostname,
      organization,
      projectPath,
      repoName,
      projectName,
      pathElements: projectPath.split('/'),
    }
  } catch (e) {
    return null
  }
}

//check in general that the URL is a valid repo URL (GH, GL, ADO, on prem options as well)
//make sure that it has a user/org and a repo name but that the path doesn't have more than 4 parts
//make sure that the path parts are valid names for repo/user/org names
export const sanityRepoURL = (scmURL: string) => {
  try {
    const url = new URL(scmURL)
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')
    const pathParts = projectPath.split('/')
    if (pathParts.length < 2) return false
    if (pathParts.length > 4) return false
    if (pathParts.some((part) => !part.match(NAME_REGEX))) return false
    return true
  } catch (e) {
    return null
  }
}
