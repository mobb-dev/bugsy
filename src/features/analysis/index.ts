import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import type { CommandOptions } from '@mobb/bugsy/commands'
import { WEB_APP_URL } from '@mobb/bugsy/constants'
import * as utils from '@mobb/bugsy/utils'
import { sleep } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import Configstore from 'configstore'
import Debug from 'debug'
import open from 'open'
import semver from 'semver'
import tmp from 'tmp'

import { callbackServer } from './callback-server'
import { getGitInfo } from './git'
import { canReachRepo, downloadRepo, getRepo } from './github/github'
import { GQLClient } from './graphql'
import { pack } from './pack'
import { githubIntegrationPrompt, mobbAnalysisPrompt } from './prompts'
import { getSnykReport } from './snyk'
import { uploadFile } from './upload-file'

const { CliError, Spinner, keypress, getDirName } = utils

const webLoginUrl = `${WEB_APP_URL}/cli-login`
const githubSubmitUrl = `${WEB_APP_URL}/gh-callback`
const githubAuthUrl = `${WEB_APP_URL}/github-auth`

const LOGIN_MAX_WAIT = 10 * 60 * 1000 // 10 minutes
const LOGIN_CHECK_DELAY = 5 * 1000 // 5 sec

const MOBB_LOGIN_REQUIRED_MSG = `🔓 Login to Mobb is Required, you will be redirected to our login page, once the authorization is complete return to this prompt, ${chalk.bgBlue(
  'press any key to continue'
)};`
const tmpObj = tmp.dirSync({
  unsafeCleanup: true,
})

type ReportUrlParam = {
  organizationId: string
  projectId: string
  fixReportId: string
}
const getReportUrl = ({
  organizationId,
  projectId,
  fixReportId,
}: ReportUrlParam) =>
  `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${fixReportId}`

const debug = Debug('mobbdev:index')

const packageJson = JSON.parse(
  fs.readFileSync(path.join(getDirName(), '../package.json'), 'utf8')
)

if (!semver.satisfies(process.version, packageJson.engines.node)) {
  throw new CliError(
    `${packageJson.name} requires node version ${packageJson.engines.node}, but running ${process.version}.`
  )
}

const config = new Configstore(packageJson.name, { apiToken: '' })
debug('config %o', config)
export type AnalysisParams = {
  scanFile?: string
  repo?: string
  p?: string
  srcPath?: string
  ref?: string
  commitHash?: string
  s?: string
  scanner?: string
  y?: boolean
  yes?: boolean
  apiKey?: string
  ci: boolean
}
export async function runAnalysis(
  params: AnalysisParams,
  options: CommandOptions
) {
  try {
    await _scan(
      {
        ...params,
        dirname: tmpObj.name,
      },
      options
    )
  } finally {
    tmpObj.removeCallback()
  }
}

export async function _scan(
  {
    dirname,
    repo,
    scanFile,
    apiKey,
    ci,
    srcPath,
    commitHash,
    ref,
  }: AnalysisParams & { dirname: string },
  { skipPrompts = false } = {}
) {
  debug('start %s %s', dirname, repo)
  const { createSpinner } = Spinner({ ci })
  skipPrompts = skipPrompts || ci

  let gqlClient = new GQLClient({
    apiKey: apiKey || config.get('apiToken'),
  })
  await handleMobbLogin()

  const { projectId, organizationId } = await gqlClient.getOrgAndProjectId()
  const {
    uploadS3BucketInfo: { repoUploadInfo, reportUploadInfo },
  } = await gqlClient.uploadS3BucketInfo()
  let reportPath = scanFile

  if (srcPath) {
    return await uploadExistingRepo()
  }

  if (!repo) {
    throw new Error('repo is required in case srcPath is not provided')
  }
  const userInfo = await gqlClient.getUserInfo()
  let { githubToken } = userInfo
  const isRepoAvailable = await canReachRepo(repo, {
    token: userInfo.githubToken,
  })

  if (!isRepoAvailable) {
    if (ci) {
      throw new Error(
        `Cannot access repo ${repo} with the provided token, please visit ${githubAuthUrl} to refresh your Github token`
      )
    }
    const { token } = await handleGithubIntegration()
    githubToken = token
  }

  const reference =
    ref ?? (await getRepo(repo, { token: githubToken })).data.default_branch
  debug('org id %s', organizationId)
  debug('project id %s', projectId)
  debug('default branch %s', reference)

  const repositoryRoot = await downloadRepo(
    {
      repoUrl: repo,
      reference,
      dirname,
      ci,
    },
    { token: githubToken }
  )

  if (!reportPath) {
    reportPath = await getReportFromSnyk()
  }
  const uploadReportSpinner = createSpinner('📁 Uploading Report').start()
  try {
    await uploadFile({
      file: reportPath,
      url: reportUploadInfo.url,
      uploadFields: reportUploadInfo.uploadFields,
      uploadKey: reportUploadInfo.uploadKey,
    })
  } catch (e) {
    uploadReportSpinner.error({ text: '📁 Report upload failed' })
    throw e
  }
  uploadReportSpinner.success({ text: '📁 Report uploaded successfully' })
  const mobbSpinner = createSpinner('🕵️‍♂️ Initiating Mobb analysis').start()
  try {
    await gqlClient.submitVulnerabilityReport({
      fixReportId: reportUploadInfo.fixReportId,
      repoUrl: repo,
      reference,
      projectId,
    })
  } catch (e) {
    mobbSpinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
    throw e
  }

  mobbSpinner.success({
    text: '🕵️‍♂️ Generating fixes...',
  })

  await askToOpenAnalysis()
  async function getReportFromSnyk() {
    const reportPath = path.join(dirname, 'report.json')
    if (!(await getSnykReport(reportPath, repositoryRoot, { skipPrompts }))) {
      debug('snyk code is not enabled')
      throw new CliError('Snyk code is not enabled')
    }
    return reportPath
  }
  async function askToOpenAnalysis() {
    const reportUrl = getReportUrl({
      organizationId,
      projectId,
      fixReportId: reportUploadInfo.fixReportId,
    })
    !ci && console.log('You can access the report at: \n')
    console.log(chalk.bold(reportUrl))
    !skipPrompts && (await mobbAnalysisPrompt())

    !ci && open(reportUrl)
    !ci &&
      console.log(
        chalk.bgBlue('\n\n  My work here is done for now, see you soon! 🕵️‍♂️  ')
      )
  }

  async function handleMobbLogin() {
    if (await gqlClient.verifyToken()) {
      createSpinner().start().success({
        text: '🔓 Logged in to Mobb successfully',
      })

      return
    } else if (apiKey) {
      createSpinner().start().error({
        text: '🔓 Logged in to Mobb failed - check your api-key',
      })
      throw new CliError()
    }

    const loginSpinner = createSpinner().start()

    if (!skipPrompts) {
      loginSpinner.update({ text: MOBB_LOGIN_REQUIRED_MSG })
      await keypress()
    }

    loginSpinner.update({
      text: '🔓 Waiting for Mobb login...',
    })

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    })

    const loginId = await gqlClient.createCliLogin({
      publicKey: publicKey.export({ format: 'pem', type: 'pkcs1' }).toString(),
    })
    const browserUrl = `${webLoginUrl}/${loginId}`

    !ci &&
      console.log(
        `If the page does not open automatically, kindly access it through ${browserUrl}.`
      )
    await open(browserUrl)

    let newApiToken = null

    for (let i = 0; i < LOGIN_MAX_WAIT / LOGIN_CHECK_DELAY; i++) {
      const encryptedApiToken = await gqlClient.getEncryptedApiToken({
        loginId,
      })
      loginSpinner.spin()

      if (encryptedApiToken) {
        debug('encrypted API token received %s', encryptedApiToken)
        newApiToken = crypto
          .privateDecrypt(privateKey, Buffer.from(encryptedApiToken, 'base64'))
          .toString('utf-8')
        debug('API token decrypted')
        break
      }
      await sleep(LOGIN_CHECK_DELAY)
    }

    if (!newApiToken) {
      loginSpinner.error({
        text: 'Login timeout error',
      })
      throw new CliError()
    }

    gqlClient = new GQLClient({ apiKey: newApiToken })

    if (await gqlClient.verifyToken()) {
      debug('set api token %s', newApiToken)
      config.set('apiToken', newApiToken)
      loginSpinner.success({ text: '🔓 Login to Mobb successful!' })
    } else {
      loginSpinner.error({
        text: 'Something went wrong, API token is invalid.',
      })
      throw new CliError()
    }
  }
  async function handleGithubIntegration() {
    const addGithubIntegration = skipPrompts
      ? true
      : await githubIntegrationPrompt()

    const githubSpinner = createSpinner(
      '🔗 Waiting for github integration...'
    ).start()
    if (!addGithubIntegration) {
      githubSpinner.error()
      throw Error('Could not reach github repo')
    }
    const result = await callbackServer({
      url: githubAuthUrl,
      redirectUrl: `${githubSubmitUrl}?done=true`,
    })
    githubSpinner.success({ text: '🔗 Github integration successful!' })
    return result
  }
  async function uploadExistingRepo() {
    if (!srcPath || !reportPath) {
      throw new Error('src path and reportPath is required')
    }

    const gitInfo = await getGitInfo(srcPath)
    const zippingSpinner = createSpinner('📦 Zipping repo').start()

    const zipBuffer = await pack(srcPath)
    zippingSpinner.success({ text: '📦 Zipping repo successful!' })
    const uploadReportSpinner = createSpinner('📁 Uploading Report').start()

    try {
      await uploadFile({
        file: reportPath,
        url: reportUploadInfo.url,
        uploadFields: reportUploadInfo.uploadFields,
        uploadKey: reportUploadInfo.uploadKey,
      })
    } catch (e) {
      uploadReportSpinner.error({ text: '📁 Report upload failed' })
      throw e
    }
    uploadReportSpinner.success({
      text: '📁 Uploading Report successful!',
    })
    const uploadRepoSpinner = createSpinner('📁 Uploading Repo').start()
    try {
      await uploadFile({
        file: zipBuffer,
        url: repoUploadInfo.url,
        uploadFields: repoUploadInfo.uploadFields,
        uploadKey: repoUploadInfo.uploadKey,
      })
    } catch (e) {
      uploadRepoSpinner.error({ text: '📁 Repo upload failed' })
      throw e
    }
    uploadRepoSpinner.success({ text: '📁 Uploading Repo successful!' })

    const mobbSpinner = createSpinner('🕵️‍♂️ Initiating Mobb analysis').start()

    try {
      await gqlClient.submitVulnerabilityReport({
        fixReportId: reportUploadInfo.fixReportId,
        repoUrl: repo || gitInfo.repoUrl,
        reference: gitInfo.reference,
        sha: commitHash || gitInfo.hash,
        projectId,
      })
    } catch (e) {
      mobbSpinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
      throw e
    }

    mobbSpinner.success({
      text: '🕵️‍♂️ Generating fixes...',
    })
    await askToOpenAnalysis()
  }
}
