import fs from 'node:fs/promises'

import os from 'os'
import path from 'path'
import { SimpleGit, simpleGit } from 'simple-git'
import { z } from 'zod'

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

export const SubmitFixesMessageZ = z.object({
  submitFixRequestId: z.string().uuid(),
  fixes: z.array(
    z.object({
      fixId: z.string().uuid(),
      diff: z.string(),
    })
  ),
  branchName: z.string(),
  commitHash: z.string(),
  targetBranch: z.string(),
  repoUrl: z.string(),
})
export type SubmitFixesMessage = z.infer<typeof SubmitFixesMessageZ>

const FixResponseArrayZ = z.array(
  z.object({
    fixId: z.string().uuid(),
  })
)
type FixResponseArray = z.infer<typeof FixResponseArrayZ>

export const SubmitFixesResponseMessageZ = z.object({
  submitFixRequestId: z.string().uuid(),
  submitBranches: z.array(
    z.object({
      branchName: z.string(),
      fixes: FixResponseArrayZ,
    })
  ),
  error: z
    .object({
      type: z.enum([
        'InitialRepoAccessError',
        'PushBranchError',
        'UnknownError',
      ]),
      info: z.object({
        message: z.string(),
        pushBranchName: z.string().optional(),
      }),
    })
    .optional(),
})
export type SubmitFixesResponseMessage = z.infer<
  typeof SubmitFixesResponseMessageZ
>

const pushBranch = async (
  git: SimpleGit,
  branchName: string,
  fixArray: FixResponseArray,
  response: SubmitFixesResponseMessage
) => {
  try {
    await git.push('origin', branchName)
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

const rebaseFix = async (
  git: SimpleGit,
  branchName: string,
  fixId: string,
  baseCommitHash: string
) => {
  await git.rebase(['--onto', branchName, baseCommitHash, 'HEAD'])
  const show = await git.show()
  const showLines = show.split('\n')
  const showFixLine = showLines.find((line) =>
    line.includes(MOBB_COMMIT_PREFIX)
  )
  //sometimes the rebase fails but the git command doesn't throw an error
  //so we need to check that the fix was actually rebased
  if (!showFixLine || !showFixLine.includes(fixId)) {
    throw new Error('rebase failed')
  }
}

const fetchInitialCommit = async (
  git: SimpleGit,
  commitHash: string,
  response: SubmitFixesResponseMessage
) => {
  try {
    await git.fetch(['--depth', '1', 'origin', commitHash])
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
export const submitFixes = async (msg: SubmitFixesMessage) => {
  const response: SubmitFixesResponseMessage = {
    submitBranches: [],
    submitFixRequestId: '',
  }
  //create a new temp dir for the repo
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), APP_DIR_PREFIX))
  try {
    response.submitFixRequestId = msg.submitFixRequestId
    const git = simpleGit(tmpDir)
    await git.init()
    //TODO: add email and name to config
    await git.addConfig('user.email', 'git@mobb.ai')
    await git.addConfig('user.name', 'Mobb autofixer')
    await git.addRemote('origin', msg.repoUrl)
    //fetch the commit (shallow copy - no history) from the origin
    if (!(await fetchInitialCommit(git, msg.commitHash, response))) {
      return response
    }
    //create a new branch from the commit to apply the fixes on
    let branchName = msg.branchName
    await git.checkout([msg.commitHash])
    await git.checkout(['-b', branchName, 'HEAD'])
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
      await git.commit(`${MOBB_COMMIT_PREFIX} ${fix.fixId}`)
      await git.checkout(['-b', `mobb-fix-${fix.fixId}`, 'HEAD'])
      try {
        //rebase the fix branch on the branch we created from the input commit (the PR branch saved in branchName)
        await rebaseFix(git, branchName, fix.fixId, msg.commitHash)
        //if the rebase succeeded, push the fix id into the fix array that goes into the response
        fixArray.push({ fixId: fix.fixId })
        //move the PR branch to the new fix commit that was rebased on the PR branch
        await git.branch(['-f', branchName, 'HEAD'])
      } catch (e) {
        //sometimes rebase fails and leaves the repo in a bad state and sometimes it doesn't
        await abortRebase(git)
        //check if we encountered a first conflict as the current PR branch name matches the input branch name exactly
        if (msg.branchName === branchName) {
          //move the current PR branch name to have a "-1" suffix
          branchName = `${branchName}-1`
          await git.checkout([msg.branchName])
          await git.checkout(['-b', branchName, 'HEAD'])
        }
        //checkout the current PR branch
        await git.checkout([branchName])
        //push the branch to the origin and add the branch name and the fixes ids to the response
        if (!(await pushBranch(git, branchName, fixArray, response))) {
          return response
        }
        fixArray = []
        branchIndex++
        //start a new branch for the next fixes in the input
        //create a new branch with the same name as the PR branch but with a "-x" suffix where x is the branch index
        branchName = `${msg.branchName}-${branchIndex + 1}`
        await git.checkout([`mobb-fix-${fix.fixId}`])
        await git.checkout(['-b', branchName, 'HEAD'])
        fixArray.push({ fixId: fix.fixId })
      }
      //checkout the current PR branch
      await git.checkout([branchName])
      await git.reset(['--hard', 'HEAD'])
    }
    //push the branch to the origin and add the branch name and the fixes ids to the response
    if (!(await pushBranch(git, branchName, fixArray, response))) {
      return response
    }
    fixArray = []
    return response
  } finally {
    await fs.rm(tmpDir, { recursive: true })
  }
}
