import { Octokit } from 'octokit'

type CreateTestPRParams = {
  repoUrl: string
  sourceBranch: string
  title?: string
  body?: string
  token: string
}

type CloseTestPRParams = {
  repoUrl: string
  prNumber: number
  token: string
  branchName?: string
}

function parseGithubRepoUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/)
  if (!match?.[1] || !match[2]) {
    throw new Error(`Invalid GitHub URL: ${url}`)
  }
  return {
    owner: match[1],
    repo: match[2],
  }
}

/**
 * Creates a test PR from a new unique branch based on an existing branch to main
 * @returns Object containing the PR number and the created branch name
 */
export async function createTestPR(
  params: CreateTestPRParams
): Promise<{ prNumber: number; branchName: string }> {
  const { repoUrl, sourceBranch, token } = params
  const { owner, repo } = parseGithubRepoUrl(repoUrl)

  const octokit = new Octokit({
    auth: token,
  })

  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const newBranchName = `test-pr-${sourceBranch.replace(/\//g, '-')}-${timestamp}-${randomId}`
  const title = params.title || `Test PR ${timestamp}`
  const body =
    params.body || `Automated test PR created at ${new Date().toISOString()}`

  try {
    // Get the SHA of the source branch
    const sourceBranchRef = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${sourceBranch}`,
    })

    // Create a new branch from the source branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: sourceBranchRef.data.object.sha,
    })

    // Push an empty commit with a random message to the new branch
    const randomCommitMessage = `Empty commit ${Math.random().toString(36).substring(2, 15)}`
    const currentCommit = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: sourceBranchRef.data.object.sha,
    })

    const emptyCommit = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: randomCommitMessage,
      tree: currentCommit.data.tree.sha,
      parents: [sourceBranchRef.data.object.sha],
    })

    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${newBranchName}`,
      sha: emptyCommit.data.sha,
    })

    // Create PR from the new branch to main
    const response = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      body,
      head: newBranchName,
      base: 'main',
      draft: false,
    })

    return { prNumber: response.data.number, branchName: newBranchName }
  } catch (error) {
    // If something goes wrong, try to clean up the branch
    try {
      await octokit.rest.git.deleteRef({
        owner,
        repo,
        ref: `heads/${newBranchName}`,
      })
    } catch {
      // Ignore cleanup errors
    }
    throw error
  }
}

/**
 * Closes a test PR and deletes the associated branch if provided
 */
export async function closeTestPR(params: CloseTestPRParams): Promise<void> {
  const { repoUrl, prNumber, token, branchName } = params
  const { owner, repo } = parseGithubRepoUrl(repoUrl)

  const octokit = new Octokit({
    auth: token,
  })

  try {
    await octokit.rest.pulls.update({
      owner,
      repo,
      pull_number: prNumber,
      state: 'closed',
    })
  } catch (error) {
    // Log but don't throw - cleanup errors shouldn't fail tests
    console.warn(`Failed to close PR #${prNumber}: ${error}`)
  }

  // Delete the branch if it was provided
  if (branchName) {
    try {
      await octokit.rest.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      })
    } catch (error) {
      // Log but don't throw - cleanup errors shouldn't fail tests
      console.warn(`Failed to delete branch ${branchName}: ${error}`)
    }
  }
}

/**
 * Helper to ensure PR cleanup happens even if test fails
 */
export function withTestPR<T>(
  params: CreateTestPRParams,
  testFn: (prNumber: number) => Promise<T>
): Promise<T> {
  let prNumber: number | undefined
  let branchName: string | undefined

  return createTestPR(params)
    .then(async (result) => {
      prNumber = result.prNumber
      branchName = result.branchName
      return testFn(result.prNumber)
    })
    .finally(async () => {
      if (prNumber !== undefined) {
        await closeTestPR({
          repoUrl: params.repoUrl,
          prNumber,
          token: params.token,
          branchName,
        })
      }
    })
}
