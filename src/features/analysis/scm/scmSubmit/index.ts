import { GitService } from '../services/GitService'

export const isValidBranchName = async (branchName: string) => {
  const gitService = new GitService(process.cwd())
  return gitService.isValidBranchName(branchName)
}
