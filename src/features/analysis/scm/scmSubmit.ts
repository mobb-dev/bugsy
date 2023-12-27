import fs from 'node:fs/promises'

import os from 'os'
import path from 'path'
import { SimpleGit, simpleGit } from 'simple-git'
import tmp from 'tmp'
import { z } from 'zod'

import { RebaseFailedError } from './scm'

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
const BaseSubmitToScmMessageZ = z.object({
  submitFixRequestId: z.string().uuid(),
  fixes: z.array(
    z.object({
      fixId: z.string().uuid(),
      diff: z.string(),
    })
  ),
  commitHash: z.string(),
  repoUrl: z.string(),
})

const submitToScmMessageType = {
  commitToSameBranch: 'commitToSameBranch',
  submitFixesForDifferentBranch: 'submitFixesForDifferentBranch',
} as const

export const CommitToSameBranchParamsZ = BaseSubmitToScmMessageZ.merge(
  z.object({
    type: z.literal(submitToScmMessageType.commitToSameBranch),
    branch: z.string(),
  })
)

export const SubmitFixesToDifferentBranchParamsZ = z
  .object({
    type: z.literal(submitToScmMessageType.submitFixesForDifferentBranch),
    submitBranch: z.string(),
    baseBranch: z.string(),
  })
  .merge(BaseSubmitToScmMessageZ)
export const SubmitFixesMessageZ = z.union([
  CommitToSameBranchParamsZ,
  SubmitFixesToDifferentBranchParamsZ,
])
export type SubmitFixesMessage = z.infer<typeof SubmitFixesMessageZ>
export type CommitToSameBranchParams = z.infer<typeof CommitToSameBranchParamsZ>
export type SubmitFixesToDifferentBranchParams = z.infer<
  typeof SubmitFixesToDifferentBranchParamsZ
>

const FixResponseArrayZ = z.array(
  z.object({
    fixId: z.string().uuid(),
  })
)
type FixResponseArray = z.infer<typeof FixResponseArrayZ>

export const SubmitFixesResponseMessageZ = z.object({
  type: z.nativeEnum(submitToScmMessageType),
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
    throw new RebaseFailedError('rebase failed')
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

const FixesZ = z
  .array(z.object({ fixId: z.string(), diff: z.string() }))
  .nonempty()

async function initGit(params: {
  dirName: string
  commitHash: string
  repoUrl: string
  branchName: string
  response: SubmitFixesResponseMessage
}) {
  const { repoUrl, dirName, commitHash, branchName, response } = params
  const git = simpleGit(dirName)
  await git.init()

  await git.addConfig('user.email', 'git@mobb.ai')
  await git.addConfig('user.name', 'Mobb autofixer')
  await git.addRemote('origin', repoUrl)
  if (!(await fetchInitialCommit(git, commitHash, response))) {
    return null
  }
  await git.checkout([commitHash])
  await git.checkout(['-b', branchName, 'HEAD'])
  return git
}

export async function submitFixesToSameBranch(
  msg: Omit<CommitToSameBranchParams, 'type'>
): Promise<SubmitFixesResponseMessage> {
  const response: SubmitFixesResponseMessage = {
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
    const git = await initGit({
      dirName,
      commitHash: msg.commitHash,
      repoUrl: msg.repoUrl,
      branchName: msg.branch,
      response,
    })
    if (!git) {
      return response
    }

    const branchName = msg.branch
    const [fix] = fixes
    const fixTmpDir = await tmp.dirSync({ unsafeCleanup: true })
    try {
      await fs.writeFile(path.join(fixTmpDir.name, 'mobb.patch'), fix.diff)
      await git.applyPatch(path.join(fixTmpDir.name, 'mobb.patch'))
    } finally {
      fixTmpDir.removeCallback()
    }
    await git.add('.')
    await git.commit(`${MOBB_COMMIT_PREFIX} ${fix.fixId}`)
    if (
      !(await pushBranch(git, branchName, [{ fixId: fix.fixId }], response))
    ) {
      console.log('pushBranch failed')
      return response
    }
    return response
  } catch (e) {
    console.log('error', e)
    if (e instanceof RebaseFailedError) {
      return {
        ...response,
        error: {
          type: 'PushBranchError',
          info: {
            message: 'Failed to rebase fix',
          },
        },
      }
    }
    return response
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
  //create a new temp dir for the repo
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), APP_DIR_PREFIX))
  try {
    response.submitFixRequestId = msg.submitFixRequestId
    const git = await initGit({
      dirName: tmpDir,
      commitHash: msg.commitHash,
      repoUrl: msg.repoUrl,
      branchName: msg.submitBranch,
      response,
    })
    if (!git) {
      return response
    }
    //create a new branch from the commit to apply the fixes on
    let submitBranch = msg.submitBranch
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
        await rebaseFix(git, submitBranch, fix.fixId, msg.commitHash)
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
