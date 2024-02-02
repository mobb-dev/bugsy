type Repo = {
  repoName: string | undefined
  organization: string | undefined
  projectName: string | undefined
} | null

const pathnameParsingMap = {
  'dev.azure.com': (pathname: string[]): Repo => {
    if (pathname.length < 2) return null
    return {
      organization: pathname[0],
      repoName: pathname[pathname.length - 1],
      projectName: pathname[1],
    }
  },
  'gitlab.com': (pathname: string[]): Repo => {
    if (pathname.length < 2) return null
    return {
      organization: pathname[0],
      repoName: pathname[pathname.length - 1],
      projectName: undefined,
    }
  },
  'github.com': (pathname: string[]): Repo => {
    if (pathname.length !== 2) return null
    return {
      organization: pathname[0],
      repoName: pathname[1],
      projectName: undefined,
    }
  },
}

type PathnameParsingMapType = typeof pathnameParsingMap

const NAME_REGEX = /[a-z0-9\-_.+]+/i

export const parseScmURL = (scmURL: string) => {
  try {
    const url = new URL(scmURL)
    const hostname = url.hostname.toLowerCase()
    if (!(hostname in pathnameParsingMap)) return null
    const projectPath = url.pathname.substring(1).replace(/.git$/i, '')

    const repo = pathnameParsingMap[hostname as keyof PathnameParsingMapType](
      projectPath.split('/')
    )

    if (!repo) return null

    const { organization, repoName, projectName } = repo

    if (!organization || !repoName) return null
    if (!organization.match(NAME_REGEX) || !repoName.match(NAME_REGEX))
      return null

    return {
      hostname: url.hostname as keyof PathnameParsingMapType,
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
