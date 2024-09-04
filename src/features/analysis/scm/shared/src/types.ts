export const scmCloudUrl = {
  GitLab: 'https://gitlab.com',
  GitHub: 'https://github.com',
  Ado: 'https://dev.azure.com',
  Bitbucket: 'https://bitbucket.org',
} as const

export enum ScmType {
  GitHub = 'GitHub',
  GitLab = 'GitLab',
  Ado = 'Ado',
  Bitbucket = 'Bitbucket',
}

type BaseParseScmURLRes = {
  hostname: string
  organization: string
  projectPath: string
  repoName: string
  protocol: string
  pathElements: string[]
}

export type ParseScmURLRes =
  | ({
      scmType: ScmType.Ado
      projectName: string
      prefixPath: string
    } & BaseParseScmURLRes)
  | ({
      scmType: ScmType.GitHub | ScmType.Bitbucket | ScmType.GitLab
    } & BaseParseScmURLRes)
  | null
