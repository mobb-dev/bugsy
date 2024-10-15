export type RepoConfig = {
  url: {
    valid: string
    invalid: string
    nonExisting: string
  }
  commit: {
    date: Date
    sha: string
  }
  branch: {
    name: string
    date: Date
    sha: string
  }
  tag: {
    name: string
    date: Date
    sha: string
  }
  accessToken?: string
}
