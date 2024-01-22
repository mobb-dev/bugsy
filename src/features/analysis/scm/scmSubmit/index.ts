import fs from 'node:fs/promises'

import os from 'os'
import path from 'path'
import { SimpleGit, simpleGit } from 'simple-git'
import tmp from 'tmp'
import { z } from 'zod'

import { RebaseFailedError } from '../scm'
import {
  CommitToSameBranchParams,
  FixResponseArray,
  SubmitFixesResponseMessage,
  SubmitFixesToDifferentBranchParams,
  submitToScmMessageType,
} from './types'

export * from './types'

const APP_DIR_PREFIX = 'mobb'
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

const pushBranch = async (
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

const abortRebase = async (git: SimpleGit) => {
  try {
    await git.rebase(['--abort'])
  } catch (e) {
    //ignore
  }
  await git.reset(['--hard', 'HEAD'])
}

const rebaseFix = async (params: {
  git: SimpleGit
  branchName: string
  baseCommitHash: string
  commitMessage: string
}) => {
  const { git, branchName, baseCommitHash, commitMessage } = params
  try {
    await git.rebase(['--onto', branchName, baseCommitHash, 'HEAD'])
    const message = z.string().parse((await git.log(['-1'])).latest?.message)
    const [commitMessageHeader] = message.split('\n')
    //sometimes the rebase fails but the git command doesn't throw an error
    //so we need to check that the fix was actually rebased
    if (!commitMessageHeader?.includes(commitMessage)) {
      throw new RebaseFailedError('rebase failed')
    }
  } catch (e) {
    throw new RebaseFailedError(
      `rebasing ${baseCommitHash} with message ${commitMessage} failed `
    )
  }
}

const getCommitMessage = (fixId: string) => `${MOBB_COMMIT_PREFIX} ${fixId}`

const fetchInitialCommit = async (params: {
  git: SimpleGit
  reference: string
  response: SubmitFixesResponseMessage
  depth?: number
}) => {
  const { git, reference, depth = 1, response } = params
  try {
    await git.fetch(['--depth', `${depth}`, 'origin', reference])
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

const FixesZ = z
  .array(z.object({ fixId: z.string(), diff: z.string() }))
  .nonempty()

async function initGit(params: { dirName: string; repoUrl: string }) {
  const { repoUrl, dirName } = params
  const git = simpleGit(dirName)
  await git.init()
  await git.addConfig('user.email', 'git@mobb.ai')
  await git.addConfig('user.name', 'Mobb autofixer')
  await git.addRemote('origin', repoUrl)

  return git
}

const COMMIT_TO_SAME_BRNACH_FETCH_DEPTH = 10

export async function submitFixesToSameBranch(
  msg: Omit<CommitToSameBranchParams, 'type'>
): Promise<SubmitFixesResponseMessage> {
  const { commitDescription, commitMessage } = msg
  const response: SubmitFixesResponseMessage = {
    githubCommentId: msg.githubCommentId,
    submitBranches: [],
    submitFixRequestId: '',
    type: submitToScmMessageType.commitToSameBranch,
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

    const fixes = fixesParseRes.data
    const dirName = tmpDir.name
    const { branch: branchName, commitHash } = msg
    const git = await initGit({ dirName, repoUrl: msg.repoUrl })
    if (
      !(await fetchInitialCommit({
        git,
        reference: branchName,
        response,
        depth: COMMIT_TO_SAME_BRNACH_FETCH_DEPTH,
      }))
    ) {
      return response
    }
    await git.checkout([commitHash])
    await git.checkout(['-b', branchName, 'HEAD'])

    const [fix] = fixes
    const fixTmpDir = await tmp.dirSync({ unsafeCleanup: true })
    try {
      await fs.writeFile(path.join(fixTmpDir.name, 'mobb.patch'), fix.diff)
      await git.applyPatch(path.join(fixTmpDir.name, 'mobb.patch'))
    } finally {
      fixTmpDir.removeCallback()
    }

    await git.add('.')
    await git.commit(
      `${commitMessage}-${fix.fixId}${
        commitDescription ? `\n\n${commitDescription}` : ''
      }`
    )

    await rebaseFix({
      git,
      branchName: `origin/${branchName}`,
      commitMessage,
      baseCommitHash: 'HEAD~1',
    })
    await git.branch(['-f', branchName, 'HEAD'])
    await git.checkout([branchName])
    if (
      !(await pushBranch(git, branchName, [{ fixId: fix.fixId }], response))
    ) {
      console.log('pushBranch failed')
      return response
    }
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

export const submitFixesToDifferentBranch = async (
  msg: Omit<SubmitFixesToDifferentBranchParams, 'type'>
) => {
  const response: SubmitFixesResponseMessage = {
    submitBranches: [],
    submitFixRequestId: '',
    type: submitToScmMessageType.submitFixesForDifferentBranch,
  }
  const { commitHash } = msg
  //create a new temp dir for the repo
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), APP_DIR_PREFIX))
  try {
    response.submitFixRequestId = msg.submitFixRequestId
    let submitBranch = msg.submitBranch
    const git = await initGit({ dirName: tmpDir, repoUrl: msg.repoUrl })
    if (!(await fetchInitialCommit({ git, reference: commitHash, response }))) {
      return response
    }
    await git.checkout([commitHash])
    await git.checkout(['-b', submitBranch, 'HEAD'])
    //create a new branch from the commit to apply the fixes on
    let branchIndex = 0
    let fixArray: FixResponseArray = []
    for (const fix of msg.fixes) {
      //for each fix, create a temp dir with the patch file and apply the patch on the input commit (hash)
      await git.checkout([msg.commitHash])
      const fixTmpDir = await fs.mkdtemp(
        path.join(os.tmpdir(), `${APP_DIR_PREFIX}-fix-${fix.fixId}`)
      )
      try {
        await fs.writeFile(path.join(fixTmpDir, 'mobb.patch'), fix.diff)
        await git.applyPatch(path.join(fixTmpDir, 'mobb.patch'))
      } finally {
        await fs.rm(fixTmpDir, { recursive: true })
      }
      //commit each fix on its own branch
      await git.add('.')
      const commitMessage = getCommitMessage(fix.fixId)
      await git.commit(commitMessage)
      await git.checkout(['-b', `mobb-fix-${fix.fixId}`, 'HEAD'])
      try {
        //rebase the fix branch on the branch we created from the input commit (the PR branch saved in branchName)
        await rebaseFix({
          git,
          branchName: submitBranch,
          commitMessage,
          baseCommitHash: msg.commitHash,
        })
        //if the rebase succeeded, push the fix id into the fix array that goes into the response
        fixArray.push({ fixId: fix.fixId })
        //move the PR branch to the new fix commit that was rebased on the PR branch
        await git.branch(['-f', submitBranch, 'HEAD'])
      } catch (e) {
        //sometimes rebase fails and leaves the repo in a bad state and sometimes it doesn't
        await abortRebase(git)
        //check if we encountered a first conflict as the current PR branch name matches the input branch name exactly
        if (msg.submitBranch === submitBranch) {
          //move the current PR branch name to have a "-1" suffix
          submitBranch = `${submitBranch}-1`
          await git.checkout([msg.submitBranch])
          await git.checkout(['-b', submitBranch, 'HEAD'])
        }
        //checkout the current PR branch
        await git.checkout([submitBranch])
        //push the branch to the origin and add the branch name and the fixes ids to the response
        if (!(await pushBranch(git, submitBranch, fixArray, response))) {
          return response
        }
        fixArray = []
        branchIndex++
        //start a new branch for the next fixes in the input
        //create a new branch with the same name as the PR branch but with a "-x" suffix where x is the branch index
        submitBranch = `${msg.submitBranch}-${branchIndex + 1}`
        await git.checkout([`mobb-fix-${fix.fixId}`])
        await git.checkout(['-b', submitBranch, 'HEAD'])
        fixArray.push({ fixId: fix.fixId })
      }
      //checkout the current PR branch
      await git.checkout([submitBranch])
      await git.reset(['--hard', 'HEAD'])
    }
    //push the branch to the origin and add the branch name and the fixes ids to the response
    if (!(await pushBranch(git, submitBranch, fixArray, response))) {
      return response
    }
    fixArray = []
    return response
  } finally {
    await fs.rm(tmpDir, { recursive: true })
  }
}
