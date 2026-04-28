type GithubSdkForMergeCommitShas = {
  compareCommitsBasehead: (args: {
    owner: string
    repo: string
    basehead: string
  }) => Promise<{ data: { commits: readonly { sha: string }[] } }>
}

/** SHAs on the target branch between base and merge commit (falls back to mergeCommitSha). */
export async function commitShasBetweenBaseAndMerge(
  githubSdk: GithubSdkForMergeCommitShas,
  args: {
    owner: string
    repo: string
    baseSha: string
    mergeCommitSha: string
  }
): Promise<string[]> {
  let compare: Awaited<ReturnType<typeof githubSdk.compareCommitsBasehead>>
  try {
    compare = await githubSdk.compareCommitsBasehead({
      owner: args.owner,
      repo: args.repo,
      basehead: `${args.baseSha}...${args.mergeCommitSha}`,
    })
  } catch (err) {
    throw new Error(
      `Failed to compare commits ${args.baseSha}...${args.mergeCommitSha}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
  const shas = compare.data.commits.map((c) => c.sha)
  return shas.length > 0 ? shas : [args.mergeCommitSha]
}
