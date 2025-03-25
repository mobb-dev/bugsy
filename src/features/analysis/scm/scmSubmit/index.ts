import { simpleGit } from 'simple-git'

export const isValidBranchName = async (branchName: string) => {
  const git = simpleGit()
  try {
    const res = await git.raw(['check-ref-format', '--branch', branchName])
    if (res) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
