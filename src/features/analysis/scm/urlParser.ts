type Repo = {
  repoName: string | undefined
  organization: string | undefined
  projectName: string | undefined
} | null

function getRepoInfo(pathname: string[], hostname: string): Repo {
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
  if (hostname === 'dev.azure.com') {
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
  if (hostname === 'github.com') {
    if (pathname.length === 2) {
      return {
        organization: pathname[0],
        projectName: undefined,
        repoName: pathname[1],
      }
    }
  }
  if (hostname === 'gitlab.com') {
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

export const parseScmURL = (scmURL: string) => {
  try {
    const url = new URL(scmURL)
    const hostname = url.hostname.toLowerCase()
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')

    const repo = getRepoInfo(projectPath.split('/'), hostname)

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
