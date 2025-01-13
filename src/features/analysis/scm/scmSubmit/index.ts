import fs from 'node:fs/promises'

import parseDiff from 'parse-diff'
import path from 'path'
import { CommitResult, SimpleGit, simpleGit } from 'simple-git'
import tmp from 'tmp'
import { z } from 'zod'

import { GIT_PROXY_HOST } from '../env'
import { isBrokerUrl } from '../utils'
import {
  CommitToSameBranchParams,
  FixResponseArray,
  InitGitAndFilesParams,
  InitGitParams,
  SubmitFixesResponseMessage,
  SubmitFixesToDifferentBranchParams,
  submitToScmMessageType,
} from './types'

export * from './types'

const MOBB_COMMIT_PREFIX = 'mobb fix commit:'

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

const _pushBranch = async (
  git: SimpleGit,
  branchName: string,
  fixArray: FixResponseArray,
  response: SubmitFixesResponseMessage
) => {
  try {
    await git.push('origin', branchName, ['--set-upstream'])
  } catch (e) {
    response.error = {
      type: 'PushBranchError',
      info: {
        message: 'Failed to push branch',
        pushBranchName: branchName,
      },
    }
    for (const submitBranch of response.submitBranches) {
      try {
        git.push(['origin', '--delete', submitBranch.branchName])
      } catch (e) {
        //ignore
      }
    }
    return false
  }
  response.submitBranches.push({
    branchName,
    fixes: fixArray,
  })
  return true
}

const _abortCherryPick = async (git: SimpleGit) => {
  try {
    await git.raw(['cherry-pick', '--abort'])
  } catch (e) {
    //ignore
  }
  await git.reset(['--hard', 'HEAD'])
}

const _cherryPickFix = async (params: { git: SimpleGit; commit: string }) => {
  const { git, commit } = params
  try {
    // Here we cherry pick the latest commit from the input brach (which we previously configured and contains a single fix group over the base commit).
    // We cherry pick it into the current target brach one by one because this way, git showed the based intenal strategy to resolve conflicts automatically
    // and merge changes that touch the same lines.
    // In any case we first filter change groups (patches) that are exactly the same from different fixes, even before getting here.
    // We use the flag --keep-redundant-commits to make sure it creates empty commit for patches that contain code that is already applied in the target branch instead of failing.
    await git.raw(['cherry-pick', '--keep-redundant-commits', commit])
    return true
  } catch (e) {
    await _abortCherryPick(git)
    return false
  }
}

function _getCommitMessage({
  fixId,
  commitMessage,
  commitDescription,
}: {
  fixId: string
  commitMessage?: string | null
  commitDescription?: string | null
}) {
  if (commitMessage) {
    return `${commitMessage}-${fixId}${
      commitDescription ? `\n\n${commitDescription}` : ''
    }`
  }
  return `${MOBB_COMMIT_PREFIX} ${fixId}`
}

async function _fetchInitialCommit(params: {
  git: SimpleGit
  reference: string
  response: SubmitFixesResponseMessage
  depth?: number
}) {
  const { git, reference, depth = 1, response } = params
  try {
    await git.fetch([
      '--depth',
      `${depth}`,
      '--filter=blob:none',
      'origin',
      reference,
    ])
  } catch (e) {
    response.error = {
      type: 'InitialRepoAccessError',
      info: {
        message: 'Failed to fetch commit from origin',
      },
    }
    return false
  }
  return true
}

const FixesZ = z
  .array(
    z.object({
      fixId: z.string(),
      patchesOriginalEncodingBase64: z.array(z.string()),
    })
  )
  .nonempty()

async function _initGit(params: InitGitParams) {
  const { repoUrl, dirName, changedFiles, extraHeaders = {} } = params
  const git = simpleGit(dirName).outputHandler((bin, stdout, stderr) => {
    const errChunks: string[] = []
    const outChunks: string[] = []
    let isStdoutClosed = false
    let isStderrClosed = false
    stderr.on('data', (data) => errChunks.push(data.toString('utf8')))
    stdout.on('data', (data) => outChunks.push(data.toString('utf8')))

    function logData() {
      if (!isStderrClosed || !isStdoutClosed) {
        return
      }
      const logObj = {
        bin,
        err: errChunks.join(''),
        out: outChunks.join(''),
      }
      console.log(JSON.stringify(logObj))
    }

    stderr.on('close', () => {
      isStderrClosed = true
      logData()
    })
    stdout.on('close', () => {
      isStdoutClosed = true
      logData()
    })
  })
  await git.init()
  await git.addConfig('user.email', 'git@mobb.ai')
  await git.addConfig('user.name', 'Mobb autofixer')
  await Promise.all(
    Object.entries(extraHeaders).map(([headerKey, headerValue]) =>
      git.addConfig('http.extraheader', `${headerKey}: ${headerValue}`)
    )
  )

  let repoUrlParsed = null
  // this block is used for unit tests only. URL starts from local directory
  try {
    repoUrlParsed = repoUrl ? new URL(repoUrl) : null
  } catch (err) {
    console.log(
      `this block is used for unit tests only. URL ${repoUrl} starts from local directory`
    )
  }

  if (repoUrlParsed && isBrokerUrl(repoUrlParsed.href)) {
    await git.addConfig('http.sslVerify', 'false')

    await git.addConfig('http.proxy', GIT_PROXY_HOST)
    await git.addConfig('https.proxy', GIT_PROXY_HOST)
  }
  await git.addRemote('origin', repoUrl)

  await git.raw(['sparse-checkout', 'init', '--no-cone'])
  await git.raw(['sparse-checkout', 'set', ''])

  for (const file of changedFiles) {
    await git.raw(['sparse-checkout', 'add', file])
  }

  return git
}

function _getSetOfFilesFromDiffs(diffs: string[]) {
  const files = new Set<string>()
  for (const diff of diffs) {
    const parsedDiff = parseDiff(diff)
    for (const file of parsedDiff) {
      if (file.from) {
        files.add(file.from)
      }
    }
  }
  return files
}

//This function receives a git patch (diff) string, writes it to a temp patch file and applies it to the current working dir
async function _applyPatch(git: SimpleGit, patchBase64: string) {
  const fixTmpDir = tmp.dirSync({ unsafeCleanup: true })
  try {
    console.log(fixTmpDir.name)
    await fs.writeFile(
      path.join(fixTmpDir.name, 'mobb.patch'),
      Buffer.from(patchBase64, 'base64')
    )
    await git.applyPatch(path.join(fixTmpDir.name, 'mobb.patch'))
  } finally {
    fixTmpDir.removeCallback()
  }
}

//This function receives a patch string, a fix id, a commit message and a commit description, applied the patch to
//the current work dir and commits it with the commit message and description to the current branch
async function _commitPatch(
  git: SimpleGit,
  patchBase64: string,
  fixId: string,
  commitMessage: string | undefined | null,
  commitDescription: string | undefined | null
) {
  await _applyPatch(git, patchBase64)

  await git.add('.')
  const newCommitMessage = _getCommitMessage({
    fixId,
    commitMessage,
    commitDescription,
  })
  await git.commit(newCommitMessage)
}

const COMMIT_TO_SAME_BRANCH_FETCH_DEPTH = 10

//This function receives a message and applies all the fix groups (patches) of all the fixes, each to a new commit on a new special brach.
//All of them are based on the same base commit.
//This is so that they can later be cherry picked to the target branch from these special branches.
async function _createBranchesForAllFixPatches({
  git,
  commitHash,
  fixes,
}: {
  git: SimpleGit
  commitHash: string
  fixes: {
    fixId: string
    patchesOriginalEncodingBase64: string[]
  }[]
}) {
  await git.checkout([commitHash])
  await git.reset(['--hard', commitHash])
  for (const fix of fixes) {
    for (const [
      patchIndex,
      patchBase64,
    ] of fix.patchesOriginalEncodingBase64.entries()) {
      await git.checkout([commitHash])
      await _commitPatch(git, patchBase64, fix.fixId, undefined, undefined)
      await git.checkout(['-b', `mobb-fix-${fix.fixId}-${patchIndex}`, 'HEAD'])
    }
  }
}

//The goal of this function is to all the fix groups (patches) of a single fix to a target branch while skipping patches that have already been applied in other fixes.
//It leaves the target branch in the state of the last patch of the fix and returns true if successful, false otherwise (and returns the target branch to the original state)
//All the patches of the fix are squashed into a single commit with the commit message and description.
//It relies on the fact the the special branches created by _createBranchesForAllFixPatches are still available and contain the patches of the fix.
async function _cherryPickFixToBranch({
  git,
  fix,
  targetBranch,
  commitMessage,
  commitDescription,
  appliedPatches = {},
  appliedFixes = [],
}: {
  git: SimpleGit
  fix: { fixId: string; patchesOriginalEncodingBase64: string[] }
  targetBranch: string
  commitMessage?: string | null
  commitDescription?: string | null
  appliedPatches?: { [id: string]: boolean }
  appliedFixes?: FixResponseArray
}): Promise<{ success: boolean; commit: CommitResult | null }> {
  await git.checkout([targetBranch])
  await git.reset(['--hard', targetBranch])
  await git.checkout([
    '-b',
    `mobb-temp-fix-${fix.fixId}-${targetBranch}`,
    'HEAD',
  ])
  let appliedPatchesCount = 0
  for (const [
    patchIndex,
    patchBase64,
  ] of fix.patchesOriginalEncodingBase64.entries()) {
    //skip patches that have already been applied in other fixes
    if (appliedPatches[patchBase64] === true) {
      continue
    }
    const res = await _cherryPickFix({
      git,
      commit: `mobb-fix-${fix.fixId}-${patchIndex}`,
    })
    if (!res) {
      //rollback the cherry-pick and reset the branch to the commit before the failed fix
      await git.checkout([targetBranch])
      await git.reset(['--hard', targetBranch])
      return { success: false, commit: null }
    }
    appliedPatchesCount += 1
  }
  //squash all the patches of the fix into a single commit
  await git.reset(['--soft', `HEAD~${appliedPatchesCount}`])
  const commit = await git.commit(
    _getCommitMessage({ fixId: fix.fixId, commitDescription, commitMessage })
  )
  //advance the target branch to the new commit
  await git.branch(['-f', targetBranch, 'HEAD'])
  for (const patchBase64 of fix.patchesOriginalEncodingBase64) {
    appliedPatches[patchBase64] = true
  }
  //if the fix was applied successfully on the branch, add it to the list of applied fixes
  appliedFixes.push({ fixId: fix.fixId })
  await git.checkout([targetBranch])
  await git.reset(['--hard', targetBranch])
  return {
    success: true,
    commit,
  }
}

async function _initGitAndFiles({
  fixes,
  dirName,
  repoUrl,
  extraHeaders,
}: InitGitAndFilesParams) {
  const changedFiles = _getSetOfFilesFromDiffs(
    fixes.reduce((acc, fix) => {
      acc.push(...fix.patches)
      return acc
    }, [] as string[])
  )
  const git = await _initGit({
    dirName,
    repoUrl,
    changedFiles,
    extraHeaders,
  })
  return git
}

export async function submitFixesToSameBranch(
  msg: Omit<CommitToSameBranchParams, 'type'>
): Promise<SubmitFixesResponseMessage> {
  const { commitDescription, commitMessage } = msg
  const response: SubmitFixesResponseMessage = {
    mobbUserEmail: msg.mobbUserEmail,
    githubCommentId: msg.githubCommentId,
    submitBranches: [],
    submitFixRequestId: '',
    type: submitToScmMessageType.commitToSameBranch,
    commit: null,
  }

  const tmpDir = tmp.dirSync({
    unsafeCleanup: true,
  })
  try {
    response.submitFixRequestId = msg.submitFixRequestId
    const fixesParseRes = FixesZ.safeParse(msg.fixes)
    if (!fixesParseRes.success) {
      return response
    }

    const { branch: branchName, commitHash } = msg
    const fixes = fixesParseRes.data
    const git = await _initGitAndFiles({
      fixes: msg.fixes,
      dirName: tmpDir.name,
      repoUrl: msg.repoUrl,
      extraHeaders: msg.extraHeaders,
    })
    if (
      !(await _fetchInitialCommit({
        git,
        reference: branchName,
        response,
        depth: COMMIT_TO_SAME_BRANCH_FETCH_DEPTH,
      }))
    ) {
      return response
    }
    await _createBranchesForAllFixPatches({
      git,
      commitHash,
      fixes: msg.fixes,
    })

    const [fix] = fixes
    const { commit } = await _cherryPickFixToBranch({
      git,
      fix,
      targetBranch: branchName,
      commitDescription,
      commitMessage,
    })
    if (
      !(await _pushBranch(git, branchName, [{ fixId: fix.fixId }], response))
    ) {
      console.log('pushBranch failed')
      return response
    }
    response.commit = commit
    return response
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.error(`error submitting fixes: ${errorMessage}`)
    return {
      ...response,
      error: {
        type: 'PushBranchError',
        info: {
          message: errorMessage,
        },
      },
    }
  } finally {
    tmpDir.removeCallback()
  }
}

//This function receives a message and applies the fixes to the repo.
//The message is receives includes fixes diff, the commit hash to apply the fixes to
//and the branch name to push the fixes to.

//It first fetches the commit from the origin and creates a new branch from it.
//Then it applies the fixes to the branch and pushes it to the origin.
//If there are multiple fixes with conflicting changes, it will create a
//new branch (ending with "-x" where x is the branch index) for each conflict it encounters.

//Each time a branch is pushed to the origin, the function adds the branch name and the
//fixes ids to the response message.

//If an error occurs, the function will add the error to the response message and
//delete the branch that failed to push from origin.
export const submitFixesToDifferentBranch = async (
  msg: Omit<SubmitFixesToDifferentBranchParams, 'type'>
) => {
  const response: SubmitFixesResponseMessage = {
    mobbUserEmail: msg.mobbUserEmail,
    submitBranches: [],
    submitFixRequestId: '',
    type: submitToScmMessageType.submitFixesForDifferentBranch,
  }
  const { commitHash, extraHeaders } = msg
  //create a new temp dir for the repo
  const tmpDir = tmp.dirSync({
    unsafeCleanup: true,
  })
  try {
    response.submitFixRequestId = msg.submitFixRequestId
    let submitBranch = msg.submitBranch
    const git = await _initGitAndFiles({
      fixes: msg.fixes,
      dirName: tmpDir.name,
      repoUrl: msg.repoUrl,
      extraHeaders,
    })
    if (
      !(await _fetchInitialCommit({ git, reference: commitHash, response }))
    ) {
      return response
    }
    await _createBranchesForAllFixPatches({
      git,
      commitHash,
      fixes: msg.fixes,
    })
    await git.checkout([commitHash])
    await git.checkout(['-b', submitBranch, 'HEAD'])
    //create a new branch from the commit to apply the fixes on
    let branchIndex = 1
    let fixArray: FixResponseArray = []
    const appliedPatches: { [id: string]: boolean } = {}
    for (const fix of msg.fixes) {
      const fixRes = await _cherryPickFixToBranch({
        git,
        fix,
        targetBranch: submitBranch,
        appliedPatches,
        appliedFixes: fixArray,
      })
      if (!fixRes.success) {
        submitBranch = `${submitBranch}-${branchIndex}`
        //create a new branch with the same name as the PR branch but with a "-x" suffix where x is the branch index
        //as we now know there will be more than a single PR branch
        await git.checkout(['-b', submitBranch, 'HEAD'])
        //push the branch to the origin and add the branch name and the fixes ids to the response
        if (!(await _pushBranch(git, submitBranch, fixArray, response))) {
          return response
        }
        fixArray = []
        branchIndex++
        //start a new branch for the next fixes in the input
        //create a new branch with the same name as the PR branch but with a "-x" suffix where x is the branch index
        submitBranch = `${msg.submitBranch}-${branchIndex}`
        await git.checkout([commitHash])
        await git.checkout(['-b', submitBranch, 'HEAD'])
        //cherry pick the patches of the current fix on the new branch for the next PR
        //not testing the return value as it can't fail because this is a new branch straight from the base commit
        await _cherryPickFixToBranch({
          git,
          fix,
          targetBranch: submitBranch,
          appliedPatches,
          appliedFixes: fixArray,
        })
      }
    }
    //push the branch to the origin and add the branch name and the fixes ids to the response
    if (!(await _pushBranch(git, submitBranch, fixArray, response))) {
      return response
    }
    return response
  } finally {
    tmpDir.removeCallback()
  }
}
