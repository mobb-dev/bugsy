import { ScmType } from './shared/src'

export class InvalidRepoUrlError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class InvalidAccessTokenError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class InvalidUrlPatternError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class BadShaError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RefNotFoundError extends Error {
  constructor(m: string) {
    super(m)
  }
}
export class ScmBadCredentialsError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RepoNoTokenAccessError extends Error {
  constructor(
    m: string,
    public scmType: ScmType
  ) {
    super(m)
  }
}
