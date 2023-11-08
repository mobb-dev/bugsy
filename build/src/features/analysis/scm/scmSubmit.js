'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.submitFixes =
  exports.SubmitFixesResponseMessageZ =
  exports.SubmitFixesMessageZ =
  exports.isValidBranchName =
    void 0
const promises_1 = __importDefault(require('node:fs/promises'))
const os_1 = __importDefault(require('os'))
const path_1 = __importDefault(require('path'))
const simple_git_1 = require('simple-git')
const zod_1 = require('zod')

const APP_DIR_PREFIX = 'mobb'
const MOBB_COMMIT_PREFIX = 'mobb fix commit:'
const isValidBranchName = async (branchName) => {
  const git = (0, simple_git_1.simpleGit)()
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
exports.isValidBranchName = isValidBranchName
exports.SubmitFixesMessageZ = zod_1.z.object({
  submitFixRequestId: zod_1.z.string().uuid(),
  fixes: zod_1.z.array(
    zod_1.z.object({
      fixId: zod_1.z.string().uuid(),
      diff: zod_1.z.string(),
    })
  ),
  branchName: zod_1.z.string(),
  commitHash: zod_1.z.string(),
  targetBranch: zod_1.z.string(),
  repoUrl: zod_1.z.string(),
})
const FixResponseArrayZ = zod_1.z.array(
  zod_1.z.object({
    fixId: zod_1.z.string().uuid(),
  })
)
exports.SubmitFixesResponseMessageZ = zod_1.z.object({
  submitFixRequestId: zod_1.z.string().uuid(),
  submitBranches: zod_1.z.array(
    zod_1.z.object({
      branchName: zod_1.z.string(),
      fixes: FixResponseArrayZ,
    })
  ),
  error: zod_1.z
    .object({
      type: zod_1.z.enum([
        'InitialRepoAccessError',
        'PushBranchError',
        'UnknownError',
      ]),
      info: zod_1.z.object({
        message: zod_1.z.string(),
        pushBranchName: zod_1.z.string().optional(),
      }),
    })
    .optional(),
})
const pushBranch = async (git, branchName, fixArray, response) => {
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
const abortRebase = async (git) => {
  try {
    await git.rebase(['--abort'])
  } catch (e) {
    //ignore
  }
  await git.reset(['--hard', 'HEAD'])
}
const rebaseFix = async (git, branchName, fixId, baseCommitHash) => {
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
const fetchInitialCommit = async (git, commitHash, response) => {
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
const submitFixes = async (msg) => {
  const response = {
    submitBranches: [],
    submitFixRequestId: '',
  }
  //create a new temp dir for the repo
  const tmpDir = await promises_1.default.mkdtemp(
    path_1.default.join(os_1.default.tmpdir(), APP_DIR_PREFIX)
  )
  try {
    response.submitFixRequestId = msg.submitFixRequestId
    const git = (0, simple_git_1.simpleGit)(tmpDir)
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
    let fixArray = []
    for (const fix of msg.fixes) {
      //for each fix, create a temp dir with the patch file and apply the patch on the input commit (hash)
      await git.checkout([msg.commitHash])
      const fixTmpDir = await promises_1.default.mkdtemp(
        path_1.default.join(
          os_1.default.tmpdir(),
          `${APP_DIR_PREFIX}-fix-${fix.fixId}`
        )
      )
      try {
        await promises_1.default.writeFile(
          path_1.default.join(fixTmpDir, 'mobb.patch'),
          fix.diff
        )
        await git.applyPatch(path_1.default.join(fixTmpDir, 'mobb.patch'))
      } finally {
        await promises_1.default.rm(fixTmpDir, { recursive: true })
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
    await promises_1.default.rm(tmpDir, { recursive: true })
  }
}
exports.submitFixes = submitFixes
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NtU3VibWl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9zY21TdWJtaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQWlDO0FBRWpDLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsMkNBQWlEO0FBQ2pELDZCQUF1QjtBQUV2QixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUE7QUFDN0IsTUFBTSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUV0QyxNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFBRSxVQUFrQixFQUFFLEVBQUU7SUFDNUQsTUFBTSxHQUFHLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFDdkIsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQ3ZFLElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUE7U0FDWjtRQUNELE9BQU8sS0FBSyxDQUFBO0tBQ2I7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sS0FBSyxDQUFBO0tBQ2I7QUFDSCxDQUFDLENBQUE7QUFYWSxRQUFBLGlCQUFpQixxQkFXN0I7QUFFWSxRQUFBLG1CQUFtQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDMUMsa0JBQWtCLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRTtJQUNyQyxLQUFLLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FDWixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUU7UUFDeEIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7S0FDakIsQ0FBQyxDQUNIO0lBQ0QsVUFBVSxFQUFFLE9BQUMs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QUE7Z0JBQ25ELE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDN0MsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBO2dCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2FBQ3BDO1lBQ0QsZ0NBQWdDO1lBQ2hDLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7WUFDaEMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7U0FDcEM7UUFDRCx5RkFBeUY7UUFDekYsSUFBSSxDQUFDLENBQUMsTUFBTSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUM1RCxPQUFPLFFBQVEsQ0FBQTtTQUNoQjtRQUNELFFBQVEsR0FBRyxFQUFFLENBQUE7UUFDYixPQUFPLFFBQVEsQ0FBQTtLQUNoQjtZQUFTO1FBQ1IsTUFBTSxrQkFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUN6QztBQUNILENBQUMsQ0FBQTtBQXRGWSxRQUFBLFdBQVcsZUFzRnZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnXG5cbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBTaW1wbGVHaXQsIHNpbXBsZUdpdCB9IGZyb20gJ3NpbXBsZS1naXQnXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJ1xuXG5jb25zdCBBUFBfRElSX1BSRUZJWCA9ICdtb2JiJ1xuY29uc3QgTU9CQl9DT01NSVRfUFJFRklYID0gJ21vYmIgZml4IGNvbW1pdDonXG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkQnJhbmNoTmFtZSA9IGFzeW5jIChicmFuY2hOYW1lOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZ2l0ID0gc2ltcGxlR2l0KClcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBnaXQucmF3KFsnY2hlY2stcmVmLWZvcm1hdCcsICctLWJyYW5jaCcsIGJyYW5jaE5hbWVdKVxuICAgIGlmIChyZXMpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFN1Ym1pdEZpeGVzTWVzc2FnZVogPSB6Lm9iamVjdCh7XG4gIHN1Ym1pdEZpeFJlcXVlc3RJZDogei5zdHJpbmcoKS51dWlkKCksXG4gIGZpeGVzOiB6LmFycmF5KFxuICAgIHoub2JqZWN0KHtcbiAgICAgIGZpeElkOiB6LnN0cmluZygpLnV1aWQoKSxcbiAgICAgIGRpZmY6IHouc3RyaW5nKCksXG4gICAgfSlcbiAgKSxcbiAgYnJhbmNoTmFtZTogei5zdHJpbmcoKSxcbiAgY29tbWl0SGFzaDogei5zdHJpbmcoKSxcbiAgdGFyZ2V0QnJhbmNoOiB6LnN0cmluZygpLFxuICByZXBvVXJsOiB6LnN0cmluZygpLFxufSlcbmV4cG9ydCB0eXBlIFN1Ym1pdEZpeGVzTWVzc2FnZSA9IHouaW5mZXI8dHlwZW9mIFN1Ym1pdEZpeGVzTWVzc2FnZVo+XG5cbmNvbnN0IEZpeFJlc3BvbnNlQXJyYXlaID0gei5hcnJheShcbiAgei5vYmplY3Qoe1xuICAgIGZpeElkOiB6LnN0cmluZygpLnV1aWQoKSxcbiAgfSlcbilcbnR5cGUgRml4UmVzcG9uc2VBcnJheSA9IHouaW5mZXI8dHlwZW9mIEZpeFJlc3BvbnNlQXJyYXlaPlxuXG5leHBvcnQgY29uc3QgU3VibWl0Rml4ZXNSZXNwb25zZU1lc3NhZ2VaID0gei5vYmplY3Qoe1xuICBzdWJtaXRGaXhSZXF1ZXN0SWQ6IHouc3RyaW5nKCkudXVpZCgpLFxuICBzdWJtaXRCcmFuY2hlczogei5hcnJheShcbiAgICB6Lm9iamVjdCh7XG4gICAgICBicmFuY2hOYW1lOiB6LnN0cmluZygpLFxuICAgICAgZml4ZXM6IEZpeFJlc3BvbnNlQXJyYXlaLFxuICAgIH0pXG4gICksXG4gIGVycm9yOiB6XG4gICAgLm9iamVjdCh7XG4gICAgICB0eXBlOiB6LmVudW0oW1xuICAgICAgICAnSW5pdGlhbFJlcG9BY2Nlc3NFcnJvcicsXG4gICAgICAgICdQdXNoQnJhbmNoRXJyb3InLFxuICAgICAgICAnVW5rbm93bkVycm9yJyxcbiAgICAgIF0pLFxuICAgICAgaW5mbzogei5vYmplY3Qoe1xuICAgICAgICBtZXNzYWdlOiB6LnN0cmluZygpLFxuICAgICAgICBwdXNoQnJhbmNoTmFtZTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgfSksXG4gICAgfSlcbiAgICAub3B0aW9uYWwoKSxcbn0pXG5leHBvcnQgdHlwZSBTdWJtaXRGaXhlc1Jlc3BvbnNlTWVzc2FnZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBTdWJtaXRGaXhlc1Jlc3BvbnNlTWVzc2FnZVpcbj5cblxuY29uc3QgcHVzaEJyYW5jaCA9IGFzeW5jIChcbiAgZ2l0OiBTaW1wbGVHaXQsXG4gIGJyYW5jaE5hbWU6IHN0cmluZyxcbiAgZml4QXJyYXk6IEZpeFJlc3BvbnNlQXJyYXksXG4gIHJlc3BvbnNlOiBTdWJtaXRGaXhlc1Jlc3BvbnNlTWVzc2FnZVxuKSA9PiB7XG4gIHRyeSB7XG4gICAgYXdhaXQgZ2l0LnB1c2goJ29yaWdpbicsIGJyYW5jaE5hbWUpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXNwb25zZS5lcnJvciA9IHtcbiAgICAgIHR5cGU6ICdQdXNoQnJhbmNoRXJyb3InLFxuICAgICAgaW5mbzoge1xuICAgICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIHB1c2ggYnJhbmNoJyxcbiAgICAgICAgcHVzaEJyYW5jaE5hbWU6IGJyYW5jaE5hbWUsXG4gICAgICB9LFxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHN1Ym1pdEJyYW5jaCBvZiByZXNwb25zZS5zdWJtaXRCcmFuY2hlcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZ2l0LnB1c2goWydvcmlnaW4nLCAnLS1kZWxldGUnLCBzdWJtaXRCcmFuY2guYnJhbmNoTmFtZV0pXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vaWdub3JlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJlc3BvbnNlLnN1Ym1pdEJyYW5jaGVzLnB1c2goe1xuICAgIGJyYW5jaE5hbWUsXG4gICAgZml4ZXM6IGZpeEFycmF5LFxuICB9KVxuICByZXR1cm4gdHJ1ZVxufVxuXG5jb25zdCBhYm9ydFJlYmFzZSA9IGFzeW5jIChnaXQ6IFNpbXBsZUdpdCkgPT4ge1xuICB0cnkge1xuICAgIGF3YWl0IGdpdC5yZWJhc2UoWyctLWFib3J0J10pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvL2lnbm9yZVxuICB9XG4gIGF3YWl0IGdpdC5yZXNldChbJy0taGFyZCcsICdIRUFEJ10pXG59XG5cbmNvbnN0IHJlYmFzZUZpeCA9IGFzeW5jIChcbiAgZ2l0OiBTaW1wbGVHaXQsXG4gIGJyYW5jaE5hbWU6IHN0cmluZyxcbiAgZml4SWQ6IHN0cmluZyxcbiAgYmFzZUNvbW1pdEhhc2g6IHN0cmluZ1xuKSA9PiB7XG4gIGF3YWl0IGdpdC5yZWJhc2UoWyctLW9udG8nLCBicmFuY2hOYW1lLCBiYXNlQ29tbWl0SGFzaCwgJ0hFQUQnXSlcbiAgY29uc3Qgc2hvdyA9IGF3YWl0IGdpdC5zaG93KClcbiAgY29uc3Qgc2hvd0xpbmVzID0gc2hvdy5zcGxpdCgnXFxuJylcbiAgY29uc3Qgc2hvd0ZpeExpbmUgPSBzaG93TGluZXMuZmluZCgobGluZSkgPT5cbiAgICBsaW5lLmluY2x1ZGVzKE1PQkJfQ09NTUlUX1BSRUZJWClcbiAgKVxuICAvL3NvbWV0aW1lcyB0aGUgcmViYXNlIGZhaWxzIGJ1dCB0aGUgZ2l0IGNvbW1hbmQgZG9lc24ndCB0aHJvdyBhbiBlcnJvclxuICAvL3NvIHdlIG5lZWQgdG8gY2hlY2sgdGhhdCB0aGUgZml4IHdhcyBhY3R1YWxseSByZWJhc2VkXG4gIGlmICghc2hvd0ZpeExpbmUgfHwgIXNob3dGaXhMaW5lLmluY2x1ZGVzKGZpeElkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncmViYXNlIGZhaWxlZCcpXG4gIH1cbn1cblxuY29uc3QgZmV0Y2hJbml0aWFsQ29tbWl0ID0gYXN5bmMgKFxuICBnaXQ6IFNpbXBsZUdpdCxcbiAgY29tbWl0SGFzaDogc3RyaW5nLFxuICByZXNwb25zZTogU3VibWl0Rml4ZXNSZXNwb25zZU1lc3NhZ2VcbikgPT4ge1xuICB0cnkge1xuICAgIGF3YWl0IGdpdC5mZXRjaChbJy0tZGVwdGgnLCAnMScsICdvcmlnaW4nLCBjb21taXRIYXNoXSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3BvbnNlLmVycm9yID0ge1xuICAgICAgdHlwZTogJ0luaXRpYWxSZXBvQWNjZXNzRXJyb3InLFxuICAgICAgaW5mbzoge1xuICAgICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIGZldGNoIGNvbW1pdCBmcm9tIG9yaWdpbicsXG4gICAgICB9LFxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG4vL1RoaXMgZnVuY3Rpb24gcmVjZWl2ZXMgYSBtZXNzYWdlIGFuZCBhcHBsaWVzIHRoZSBmaXhlcyB0byB0aGUgcmVwby5cbi8vVGhlIG1lc3NhZ2UgaXMgcmVjZWl2ZXMgaW5jbHVkZXMgZml4ZXMgZGlmZiwgdGhlIGNvbW1pdCBoYXNoIHRvIGFwcGx5IHRoZSBmaXhlcyB0b1xuLy9hbmQgdGhlIGJyYW5jaCBuYW1lIHRvIHB1c2ggdGhlIGZpeGVzIHRvLlxuXG4vL0l0IGZpcnN0IGZldGNoZXMgdGhlIGNvbW1pdCBmcm9tIHRoZSBvcmlnaW4gYW5kIGNyZWF0ZXMgYSBuZXcgYnJhbmNoIGZyb20gaXQuXG4vL1RoZW4gaXQgYXBwbGllcyB0aGUgZml4ZXMgdG8gdGhlIGJyYW5jaCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBvcmlnaW4uXG4vL0lmIHRoZXJlIGFyZSBtdWx0aXBsZSBmaXhlcyB3aXRoIGNvbmZsaWN0aW5nIGNoYW5nZXMsIGl0IHdpbGwgY3JlYXRlIGFcbi8vbmV3IGJyYW5jaCAoZW5kaW5nIHdpdGggXCIteFwiIHdoZXJlIHggaXMgdGhlIGJyYW5jaCBpbmRleCkgZm9yIGVhY2ggY29uZmxpY3QgaXQgZW5jb3VudGVycy5cblxuLy9FYWNoIHRpbWUgYSBicmFuY2ggaXMgcHVzaGVkIHRvIHRoZSBvcmlnaW4sIHRoZSBmdW5jdGlvbiBhZGRzIHRoZSBicmFuY2ggbmFtZSBhbmQgdGhlXG4vL2ZpeGVzIGlkcyB0byB0aGUgcmVzcG9uc2UgbWVzc2FnZS5cblxuLy9JZiBhbiBlcnJvciBvY2N1cnMsIHRoZSBmdW5jdGlvbiB3aWxsIGFkZCB0aGUgZXJyb3IgdG8gdGhlIHJlc3BvbnNlIG1lc3NhZ2UgYW5kXG4vL2RlbGV0ZSB0aGUgYnJhbmNoIHRoYXQgZmFpbGVkIHRvIHB1c2ggZnJvbSBvcmlnaW4uXG5leHBvcnQgY29uc3Qgc3VibWl0Rml4ZXMgPSBhc3luYyAobXNnOiBTdWJtaXRGaXhlc01lc3NhZ2UpID0+IHtcbiAgY29uc3QgcmVzcG9uc2U6IFN1Ym1pdEZpeGVzUmVzcG9uc2VNZXNzYWdlID0ge1xuICAgIHN1Ym1pdEJyYW5jaGVzOiBbXSxcbiAgICBzdWJtaXRGaXhSZXF1ZXN0SWQ6ICcnLFxuICB9XG4gIC8vY3JlYXRlIGEgbmV3IHRlbXAgZGlyIGZvciB0aGUgcmVwb1xuICBjb25zdCB0bXBEaXIgPSBhd2FpdCBmcy5ta2R0ZW1wKHBhdGguam9pbihvcy50bXBkaXIoKSwgQVBQX0RJUl9QUkVGSVgpKVxuICB0cnkge1xuICAgIHJlc3BvbnNlLnN1Ym1pdEZpeFJlcXVlc3RJZCA9IG1zZy5zdWJtaXRGaXhSZXF1ZXN0SWRcbiAgICBjb25zdCBnaXQgPSBzaW1wbGVHaXQodG1wRGlyKVxuICAgIGF3YWl0IGdpdC5pbml0KClcbiAgICAvL1RPRE86IGFkZCBlbWFpbCBhbmQgbmFtZSB0byBjb25maWdcbiAgICBhd2FpdCBnaXQuYWRkQ29uZmlnKCd1c2VyLmVtYWlsJywgJ2dpdEBtb2JiLmFpJylcbiAgICBhd2FpdCBnaXQuYWRkQ29uZmlnKCd1c2VyLm5hbWUnLCAnTW9iYiBhdXRvZml4ZXInKVxuICAgIGF3YWl0IGdpdC5hZGRSZW1vdGUoJ29yaWdpbicsIG1zZy5yZXBvVXJsKVxuICAgIC8vZmV0Y2ggdGhlIGNvbW1pdCAoc2hhbGxvdyBjb3B5IC0gbm8gaGlzdG9yeSkgZnJvbSB0aGUgb3JpZ2luXG4gICAgaWYgKCEoYXdhaXQgZmV0Y2hJbml0aWFsQ29tbWl0KGdpdCwgbXNnLmNvbW1pdEhhc2gsIHJlc3BvbnNlKSkpIHtcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cbiAgICAvL2NyZWF0ZSBhIG5ldyBicmFuY2ggZnJvbSB0aGUgY29tbWl0IHRvIGFwcGx5IHRoZSBmaXhlcyBvblxuICAgIGxldCBicmFuY2hOYW1lID0gbXNnLmJyYW5jaE5hbWVcbiAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW21zZy5jb21taXRIYXNoXSlcbiAgICBhd2FpdCBnaXQuY2hlY2tvdXQoWyctYicsIGJyYW5jaE5hbWUsICdIRUFEJ10pXG4gICAgbGV0IGJyYW5jaEluZGV4ID0gMFxuICAgIGxldCBmaXhBcnJheTogRml4UmVzcG9uc2VBcnJheSA9IFtdXG4gICAgZm9yIChjb25zdCBmaXggb2YgbXNnLmZpeGVzKSB7XG4gICAgICAvL2ZvciBlYWNoIGZpeCwgY3JlYXRlIGEgdGVtcCBkaXIgd2l0aCB0aGUgcGF0Y2ggZmlsZSBhbmQgYXBwbHkgdGhlIHBhdGNoIG9uIHRoZSBpbnB1dCBjb21taXQgKGhhc2gpXG4gICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW21zZy5jb21taXRIYXNoXSlcbiAgICAgIGNvbnN0IGZpeFRtcERpciA9IGF3YWl0IGZzLm1rZHRlbXAoXG4gICAgICAgIHBhdGguam9pbihvcy50bXBkaXIoKSwgYCR7QVBQX0RJUl9QUkVGSVh9LWZpeC0ke2ZpeC5maXhJZH1gKVxuICAgICAgKVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHBhdGguam9pbihmaXhUbXBEaXIsICdtb2JiLnBhdGNoJyksIGZpeC5kaWZmKVxuICAgICAgICBhd2FpdCBnaXQuYXBwbHlQYXRjaChwYXRoLmpvaW4oZml4VG1wRGlyLCAnbW9iYi5wYXRjaCcpKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgYXdhaXQgZnMucm0oZml4VG1wRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgICAgfVxuICAgICAgLy9jb21taXQgZWFjaCBmaXggb24gaXRzIG93biBicmFuY2hcbiAgICAgIGF3YWl0IGdpdC5hZGQoJy4nKVxuICAgICAgYXdhaXQgZ2l0LmNvbW1pdChgJHtNT0JCX0NPTU1JVF9QUkVGSVh9ICR7Zml4LmZpeElkfWApXG4gICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoWyctYicsIGBtb2JiLWZpeC0ke2ZpeC5maXhJZH1gLCAnSEVBRCddKVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy9yZWJhc2UgdGhlIGZpeCBicmFuY2ggb24gdGhlIGJyYW5jaCB3ZSBjcmVhdGVkIGZyb20gdGhlIGlucHV0IGNvbW1pdCAodGhlIFBSIGJyYW5jaCBzYXZlZCBpbiBicmFuY2hOYW1lKVxuICAgICAgICBhd2FpdCByZWJhc2VGaXgoZ2l0LCBicmFuY2hOYW1lLCBmaXguZml4SWQsIG1zZy5jb21taXRIYXNoKVxuICAgICAgICAvL2lmIHRoZSByZWJhc2Ugc3VjY2VlZGVkLCBwdXNoIHRoZSBmaXggaWQgaW50byB0aGUgZml4IGFycmF5IHRoYXQgZ29lcyBpbnRvIHRoZSByZXNwb25zZVxuICAgICAgICBmaXhBcnJheS5wdXNoKHsgZml4SWQ6IGZpeC5maXhJZCB9KVxuICAgICAgICAvL21vdmUgdGhlIFBSIGJyYW5jaCB0byB0aGUgbmV3IGZpeCBjb21taXQgdGhhdCB3YXMgcmViYXNlZCBvbiB0aGUgUFIgYnJhbmNoXG4gICAgICAgIGF3YWl0IGdpdC5icmFuY2goWyctZicsIGJyYW5jaE5hbWUsICdIRUFEJ10pXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vc29tZXRpbWVzIHJlYmFzZSBmYWlscyBhbmQgbGVhdmVzIHRoZSByZXBvIGluIGEgYmFkIHN0YXRlIGFuZCBzb21ldGltZXMgaXQgZG9lc24ndFxuICAgICAgICBhd2FpdCBhYm9ydFJlYmFzZShnaXQpXG4gICAgICAgIC8vY2hlY2sgaWYgd2UgZW5jb3VudGVyZWQgYSBmaXJzdCBjb25mbGljdCBhcyB0aGUgY3VycmVudCBQUiBicmFuY2ggbmFtZSBtYXRjaGVzIHRoZSBpbnB1dCBicmFuY2ggbmFtZSBleGFjdGx5XG4gICAgICAgIGlmIChtc2cuYnJhbmNoTmFtZSA9PT0gYnJhbmNoTmFtZSkge1xuICAgICAgICAgIC8vbW92ZSB0aGUgY3VycmVudCBQUiBicmFuY2ggbmFtZSB0byBoYXZlIGEgXCItMVwiIHN1ZmZpeFxuICAgICAgICAgIGJyYW5jaE5hbWUgPSBgJHticmFuY2hOYW1lfS0xYFxuICAgICAgICAgIGF3YWl0IGdpdC5jaGVja291dChbbXNnLmJyYW5jaE5hbWVdKVxuICAgICAgICAgIGF3YWl0IGdpdC5jaGVja291dChbJy1iJywgYnJhbmNoTmFtZSwgJ0hFQUQnXSlcbiAgICAgICAgfVxuICAgICAgICAvL2NoZWNrb3V0IHRoZSBjdXJyZW50IFBSIGJyYW5jaFxuICAgICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW2JyYW5jaE5hbWVdKVxuICAgICAgICAvL3B1c2ggdGhlIGJyYW5jaCB0byB0aGUgb3JpZ2luIGFuZCBhZGQgdGhlIGJyYW5jaCBuYW1lIGFuZCB0aGUgZml4ZXMgaWRzIHRvIHRoZSByZXNwb25zZVxuICAgICAgICBpZiAoIShhd2FpdCBwdXNoQnJhbmNoKGdpdCwgYnJhbmNoTmFtZSwgZml4QXJyYXksIHJlc3BvbnNlKSkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgfVxuICAgICAgICBmaXhBcnJheSA9IFtdXG4gICAgICAgIGJyYW5jaEluZGV4KytcbiAgICAgICAgLy9zdGFydCBhIG5ldyBicmFuY2ggZm9yIHRoZSBuZXh0IGZpeGVzIGluIHRoZSBpbnB1dFxuICAgICAgICAvL2NyZWF0ZSBhIG5ldyBicmFuY2ggd2l0aCB0aGUgc2FtZSBuYW1lIGFzIHRoZSBQUiBicmFuY2ggYnV0IHdpdGggYSBcIi14XCIgc3VmZml4IHdoZXJlIHggaXMgdGhlIGJyYW5jaCBpbmRleFxuICAgICAgICBicmFuY2hOYW1lID0gYCR7bXNnLmJyYW5jaE5hbWV9LSR7YnJhbmNoSW5kZXggKyAxfWBcbiAgICAgICAgYXdhaXQgZ2l0LmNoZWNrb3V0KFtgbW9iYi1maXgtJHtmaXguZml4SWR9YF0pXG4gICAgICAgIGF3YWl0IGdpdC5jaGVja291dChbJy1iJywgYnJhbmNoTmFtZSwgJ0hFQUQnXSlcbiAgICAgICAgZml4QXJyYXkucHVzaCh7IGZpeElkOiBmaXguZml4SWQgfSlcbiAgICAgIH1cbiAgICAgIC8vY2hlY2tvdXQgdGhlIGN1cnJlbnQgUFIgYnJhbmNoXG4gICAgICBhd2FpdCBnaXQuY2hlY2tvdXQoW2JyYW5jaE5hbWVdKVxuICAgICAgYXdhaXQgZ2l0LnJlc2V0KFsnLS1oYXJkJywgJ0hFQUQnXSlcbiAgICB9XG4gICAgLy9wdXNoIHRoZSBicmFuY2ggdG8gdGhlIG9yaWdpbiBhbmQgYWRkIHRoZSBicmFuY2ggbmFtZSBhbmQgdGhlIGZpeGVzIGlkcyB0byB0aGUgcmVzcG9uc2VcbiAgICBpZiAoIShhd2FpdCBwdXNoQnJhbmNoKGdpdCwgYnJhbmNoTmFtZSwgZml4QXJyYXksIHJlc3BvbnNlKSkpIHtcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cbiAgICBmaXhBcnJheSA9IFtdXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgZnMucm0odG1wRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICB9XG59XG4iXX0=
