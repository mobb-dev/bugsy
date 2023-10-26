import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

import type { CommandOptions } from '@mobb/bugsy/commands'
import { SupportedScanners } from '@mobb/bugsy/constants'
import { WEB_APP_URL } from '@mobb/bugsy/constants'
import * as utils from '@mobb/bugsy/utils'
import { sleep } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import Configstore from 'configstore'
import Debug from 'debug'
import extract from 'extract-zip'
import fetch from 'node-fetch'
import open from 'open'
import semver from 'semver'
import tmp from 'tmp'

import { getGitInfo } from './git'
import { GQLClient } from './graphql'
import { pack } from './pack'
import { mobbAnalysisPrompt, scmIntegrationPrompt } from './prompts'
import { getCheckmarxReport } from './scanners/checkmarx'
import { getSnykReport } from './scanners/snyk'
import {
  getScmLibTypeFromUrl,
  scmCanReachRepo,
  SCMLib,
  ScmLibScmType,
} from './scm'
import { uploadFile } from './upload-file'

const { CliError, Spinner, keypress, getDirName } = utils

const webLoginUrl = `${WEB_APP_URL}/cli-login`
const githubAuthUrl = `${WEB_APP_URL}/github-auth`
const gitlabAuthUrl = `${WEB_APP_URL}/gitlab-auth`

type DownloadRepoParams = {
  repoUrl: string
  dirname: string
  ci: boolean
  authHeaders: Record<string, string>
  downloadUrl: string
}
export async function downloadRepo({
  repoUrl,
  authHeaders,
  downloadUrl,
  dirname,
  ci,
}: DownloadRepoParams) {
  const { createSpinner } = Spinner({ ci })
  const repoSpinner = createSpinner('💾 Downloading Repo').start()
  debug('download repo %s %s %s', repoUrl, dirname)
  const zipFilePath = path.join(dirname, 'repo.zip')
  const response = await fetch(downloadUrl, {
    method: 'GET',
    headers: {
      ...authHeaders,
    },
  })
  if (!response.ok) {
    debug('SCM zipball request failed %s %s', response.body, response.status)
    repoSpinner.error({ text: '💾 Repo download failed' })
    throw new Error(`Can't access ${chalk.bold(repoUrl)}`)
  }

  const fileWriterStream = fs.createWriteStream(zipFilePath)
  if (!response.body) {
    throw new Error('Response body is empty')
  }

  await pipeline(response.body, fileWriterStream)
  await extract(zipFilePath, { dir: dirname })

  const repoRoot = fs
    .readdirSync(dirname, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)[0]
  if (!repoRoot) {
    throw new Error('Repo root not found')
  }
  debug('repo root %s', repoRoot)
  repoSpinner.success({ text: '💾 Repo downloaded successfully' })
  return path.join(dirname, repoRoot)
}

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
  scanner?: SupportedScanners
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
    scanner,
    cxProjectName,
  }: AnalysisParams & { dirname: string; cxProjectName?: string },
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
  const { githubToken, gitlabToken } = userInfo
  const isRepoAvailable = await scmCanReachRepo({
    repoUrl: repo,
    githubToken,
    gitlabToken,
  })

  const scmLibType = getScmLibTypeFromUrl(repo)
  const scmAuthUrl =
    scmLibType === ScmLibScmType.GITHUB
      ? githubAuthUrl
      : scmLibType === ScmLibScmType.GITLAB
      ? gitlabAuthUrl
      : undefined

  let token =
    scmLibType === ScmLibScmType.GITHUB
      ? githubToken
      : scmLibType === ScmLibScmType.GITLAB
      ? gitlabToken
      : undefined

  if (!isRepoAvailable) {
    if (ci || !scmLibType || !scmAuthUrl) {
      const errorMessage = scmAuthUrl
        ? `Cannot access repo ${repo}`
        : `Cannot access repo ${repo} with the provided token, please visit ${scmAuthUrl} to refresh your source control management system token`
      throw new Error(errorMessage)
    }

    if (scmLibType && scmAuthUrl) {
      token = (await handleScmIntegration(token, scmLibType, scmAuthUrl)) || ''

      // Check repo availability again after SCM token update.
      const isRepoAvailable = await scmCanReachRepo({
        repoUrl: repo,
        githubToken: token,
        gitlabToken: token,
      })

      if (!isRepoAvailable) {
        throw new Error(
          `Cannot access repo ${repo} with the provided credentials`
        )
      }
    }
  }
  const scm = await SCMLib.init({
    url: repo,
    accessToken: token,
    scmType: scmLibType,
  })

  const reference = ref ?? (await scm.getRepoDefaultBranch())
  const { sha } = await scm.getReferenceData(reference)
  debug('org id %s', organizationId)
  debug('project id %s', projectId)
  debug('default branch %s', reference)

  const repositoryRoot = await downloadRepo({
    repoUrl: repo,
    dirname,
    ci,
    authHeaders: scm.getAuthHeaders(),
    downloadUrl: scm.getDownloadUrl(sha),
  })

  if (scanner) {
    reportPath = await getReport(scanner)
  }
  if (!reportPath) {
    throw new Error('reportPath is null')
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
  async function getReport(scanner: SupportedScanners): Promise<string> {
    const reportPath = path.join(dirname, 'report.json')
    switch (scanner) {
      case 'snyk':
        await getSnykReport(reportPath, repositoryRoot, { skipPrompts })
        break
      case 'checkmarx':
        if (!cxProjectName) {
          throw new Error('cxProjectName is required for checkmarx scanner')
        }
        await getCheckmarxReport(
          {
            reportPath,
            repositoryRoot,
            branch: reference,
            projectName: cxProjectName,
          },
          { skipPrompts }
        )
        break
    }
    return reportPath
  }

  async function askToOpenAnalysis() {
    const reportUrl = getReportUrl({
      organizationId,
      projectId,
      fixReportId: reportUploadInfo.fixReportId,
    })
    !ci && console.log('You can access the analysis at: \n')
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
    const browserUrl = `${webLoginUrl}/${loginId}?hostname=${os.hostname()}`

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
  async function handleScmIntegration(
    oldToken: string | undefined,
    scmLibType: ScmLibScmType,
    scmAuthUrl: string
  ) {
    const scmName =
      scmLibType === ScmLibScmType.GITHUB
        ? 'Github'
        : scmLibType === ScmLibScmType.GITLAB
        ? 'Gitlab'
        : ''

    const addScmIntegration = skipPrompts
      ? true
      : await scmIntegrationPrompt(scmName)

    const scmSpinner = createSpinner(
      `🔗 Waiting for ${scmName} integration...`
    ).start()
    if (!addScmIntegration) {
      scmSpinner.error()
      throw Error(`Could not reach ${scmName} repo`)
    }

    console.log(
      `If the page does not open automatically, kindly access it through ${scmAuthUrl}.`
    )
    await open(scmAuthUrl)

    for (let i = 0; i < LOGIN_MAX_WAIT / LOGIN_CHECK_DELAY; i++) {
      const { githubToken, gitlabToken } = await gqlClient.getUserInfo()

      if (scmLibType === ScmLibScmType.GITHUB && githubToken !== oldToken) {
        scmSpinner.success({ text: '🔗 Github integration successful!' })
        return githubToken
      }

      if (scmLibType === ScmLibScmType.GITLAB && gitlabToken !== oldToken) {
        scmSpinner.success({ text: '🔗 Gitlab integration successful!' })
        return gitlabToken
      }

      scmSpinner.spin()
      await sleep(LOGIN_CHECK_DELAY)
    }

    scmSpinner.error({
      text: `${scmName} login timeout error`,
    })
    throw new CliError(`${scmName} login timeout`)
  }

  async function uploadExistingRepo() {
    if (!srcPath || !reportPath) {
      throw new Error('src path and reportPath is required')
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
    uploadReportSpinner.success({
      text: '📁 Uploading Report successful!',
    })
    const digestSpinner = createSpinner('🕵️‍♂️ Digesting report').start()
    let vulnFiles = []
    try {
      const gitInfo = await getGitInfo(srcPath)
      const { vulnerabilityReportId } =
        await gqlClient.digestVulnerabilityReport({
          fixReportId: reportUploadInfo.fixReportId,
          projectId,
          repoUrl: repo || gitInfo.repoUrl,
          reference: gitInfo.reference,
          sha: commitHash || gitInfo.hash,
        })
      const finalState = await gqlClient.waitFixReportInit(
        reportUploadInfo.fixReportId,
        true
      )
      if (finalState !== 'Digested') {
        throw new Error('Digesting report failed')
      }
      vulnFiles = await gqlClient.getVulnerabilityReportPaths(
        vulnerabilityReportId
      )
    } catch (e) {
      digestSpinner.error({ text: '🕵️‍♂️ Digesting report failed' })
      throw e
    }
    digestSpinner.success({
      text: '🕵️‍♂️ Digesting report successful!',
    })

    const zippingSpinner = createSpinner('📦 Zipping repo').start()

    const zipBuffer = await pack(srcPath, vulnFiles)
    zippingSpinner.success({ text: '📦 Zipping repo successful!' })

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
      await gqlClient.initializeVulnerabilityReport({
        fixReportId: reportUploadInfo.fixReportId,
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
