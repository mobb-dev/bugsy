import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { env } from 'node:process'
import { pipeline } from 'node:stream/promises'

import {
  type CommandOptions,
  handleMobbLogin,
  LOGIN_CHECK_DELAY,
  LOGIN_MAX_WAIT,
} from '@mobb/bugsy/commands'
import {
  progressMassages,
  Scanner,
  SCANNERS,
  SupportedScanners,
  SupportedScannersZ,
  VUL_REPORT_DIGEST_TIMEOUT_MS,
  WEB_APP_URL,
} from '@mobb/bugsy/constants'
import { MobbCliCommand } from '@mobb/bugsy/types'
import * as utils from '@mobb/bugsy/utils'
import { getTopLevelDirName, packageJson, sleep } from '@mobb/bugsy/utils'
import chalk from 'chalk'
import Configstore from 'configstore'
import Debug from 'debug'
import extract from 'extract-zip'
import { createSpinner } from 'nanospinner'
import fetch from 'node-fetch'
import open from 'open'
import tmp from 'tmp'
import { z } from 'zod'

import { addFixCommentsForPr } from './add_fix_comments_for_pr'
import { handleAutoPr } from './auto_pr_handler'
import { getGitInfo, GetGitInfoResult } from './git'
import { GQLClient } from './graphql'
import { pack, repackFpr } from './pack'
import { mobbAnalysisPrompt, scmIntegrationPrompt } from './prompts'
import { getCheckmarxReport } from './scanners/checkmarx'
import { getSnykReport } from './scanners/snyk'
import {
  getCloudScmLibTypeFromUrl,
  getScmConfig,
  ScmConfig,
  ScmLibScmType,
} from './scm'
import {
  Fix_Report_State_Enum,
  OrganizationToRoleType,
  Scan_Source_Enum,
} from './scm/generates/client_generates'
import { createScmLib } from './scm/scmFactory'
import { uploadFile } from './upload-file'
import { getFromArraySafe, sendReport } from './utils'

const { CliError, Spinner } = utils

type DownloadRepoParams = {
  repoUrl: string
  dirname: string
  ci: boolean
  authHeaders: Record<string, string>
  downloadUrl: string
}

function _getScanSource(command: MobbCliCommand): Scan_Source_Enum {
  // `review` comes from the GitHub action https://github.com/mobb-dev/action/blob/b5dfbbe1e005a46b135421c2481a6bff2a3f46fe/review/action.yml#L37
  if (command === 'review') return Scan_Source_Enum.AutoFixer

  // Based on code samples from grep.app. Not tested on every env.
  const envToCi: [string, Scan_Source_Enum][] = [
    ['GITLAB_CI', Scan_Source_Enum.CiGitlab],
    ['GITHUB_ACTIONS', Scan_Source_Enum.CiGithub],
    ['JENKINS_URL', Scan_Source_Enum.CiJenkins],
    ['CIRCLECI', Scan_Source_Enum.CiCircleci],
    ['TF_BUILD', Scan_Source_Enum.CiAzure],
    ['bamboo_buildKey', Scan_Source_Enum.CiBamboo],
  ]

  for (const [envKey, source] of envToCi) {
    if (env[envKey]) {
      return source
    }
  }

  return Scan_Source_Enum.Cli
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
  debug('download URL: %s auth headers: %o', downloadUrl, authHeaders)
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

const config = new Configstore(packageJson.name, { apiToken: '' })
debug('config %o', config)
export type AnalysisParams = {
  scanFile?: string
  repo?: string
  p?: string
  srcPath?: string
  ref?: string
  commitHash?: string
  experimentalEnabled?: boolean
  scanner?: Scanner
  mobbProjectName?: string
  y?: boolean
  yes?: boolean
  apiKey?: string
  ci: boolean
  pullRequest?: number
  githubToken?: string
  command: MobbCliCommand
  organizationId?: string
  autoPr?: boolean
  commitDirectly?: boolean
}
export async function runAnalysis(
  params: AnalysisParams,
  options: CommandOptions
): Promise<string> {
  const tmpObj = tmp.dirSync({
    unsafeCleanup: true,
  })
  try {
    return await _scan(
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

function _getUrlForScmType({
  scmLibType,
}: {
  scmLibType: ScmLibScmType | undefined
}): { authUrl: string | undefined } {
  const githubAuthUrl = `${WEB_APP_URL}/github-auth`
  const gitlabAuthUrl = `${WEB_APP_URL}/gitlab-auth`
  const adoAuthUrl = `${WEB_APP_URL}/ado-auth`
  switch (scmLibType) {
    case ScmLibScmType.GITHUB:
      return {
        authUrl: githubAuthUrl,
      }
    case ScmLibScmType.GITLAB:
      return {
        authUrl: gitlabAuthUrl,
      }
    case ScmLibScmType.ADO:
      return {
        authUrl: adoAuthUrl,
      }
    default:
      return {
        authUrl: undefined,
      }
  }
}

function getBrokerHosts(
  userOrgsAnUserOrgRoles:
    | (null | undefined | OrganizationToRoleType)[]
    | null
    | undefined
) {
  const brokerHosts: {
    realDomain: string
    virtualDomain: string
  }[] = []
  if (!userOrgsAnUserOrgRoles) {
    return brokerHosts
  }
  userOrgsAnUserOrgRoles.forEach((org) => {
    org?.organization?.brokerHosts.forEach((brokerHost) => {
      if (brokerHost) {
        brokerHosts.push(brokerHost)
      }
    })
  })
  return brokerHosts
}

async function getScmTokenInfo(params: { gqlClient: GQLClient; repo: string }) {
  const { gqlClient, repo } = params
  const userInfo = await gqlClient.getUserInfo()
  if (!userInfo) {
    throw new Error('userInfo is null')
  }
  const scmConfigs = getFromArraySafe<ScmConfig>(userInfo.scmConfigs)

  return getScmConfig({
    url: repo,
    scmConfigs,
    includeOrgTokens: false,
    brokerHosts: getBrokerHosts(
      userInfo.userOrganizationsAndUserOrganizationRoles
    ),
  })
}

async function getReport(
  params: {
    scanner: SupportedScanners
    repoUrl: string
    sha: string
    gqlClient: GQLClient
    cxProjectName?: string
    dirname: string
    reference: string
    ci: boolean
  },
  { skipPrompts }: { skipPrompts: boolean }
): Promise<string> {
  const {
    scanner,
    repoUrl,
    gqlClient,
    sha,
    dirname,
    reference,
    cxProjectName,
    ci,
  } = params
  const tokenInfo = await getScmTokenInfo({ gqlClient, repo: repoUrl })
  const scm = await createScmLib(
    {
      url: repoUrl,
      accessToken: tokenInfo.accessToken,
      scmOrg: tokenInfo.scmOrg,
      scmType: tokenInfo.scmLibType,
    },
    { propagateExceptions: true }
  )

  const downloadUrl = await scm.getDownloadUrl(sha)
  const repositoryRoot = await downloadRepo({
    repoUrl,
    dirname,
    ci,
    authHeaders: scm.getAuthHeaders(),
    downloadUrl,
  })
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

export async function _scan(
  params: AnalysisParams & { dirname: string; cxProjectName?: string },
  { skipPrompts = false } = {}
) {
  const {
    dirname,
    repo,
    scanFile,
    apiKey,
    ci,
    srcPath,
    commitHash,
    ref,
    experimentalEnabled,
    scanner,
    cxProjectName,
    mobbProjectName,
    githubToken: githubActionToken,
    command,
    organizationId: userOrganizationId,
    autoPr,
    commitDirectly,
    pullRequest,
  } = params
  debug('start %s %s', dirname, repo)
  const { createSpinner } = Spinner({ ci })
  skipPrompts = skipPrompts || ci
  let gqlClient = new GQLClient({
    apiKey: apiKey || config.get('apiToken'),
    type: 'apiKey',
  })

  gqlClient = await handleMobbLogin({
    inGqlClient: gqlClient,
    skipPrompts,
    apiKey,
  })

  const { projectId, organizationId } = await gqlClient.getOrgAndProjectId({
    projectName: mobbProjectName,
    userDefinedOrganizationId: userOrganizationId,
  })
  const {
    uploadS3BucketInfo: { repoUploadInfo, reportUploadInfo },
  } = await gqlClient.uploadS3BucketInfo()
  if (!reportUploadInfo || !repoUploadInfo) {
    throw new Error('uploadS3BucketInfo is null')
  }
  let reportPath = scanFile

  if (srcPath) {
    return await uploadExistingRepo()
  }

  if (!repo) {
    throw new Error('repo is required in case srcPath is not provided')
  }
  const tokenInfo = await getScmTokenInfo({ gqlClient, repo })

  const validateRes = await gqlClient.validateRepoUrl({ repoUrl: repo })
  const isRepoAvailable =
    validateRes.validateRepoUrl?.__typename === 'RepoValidationSuccess'

  //we can only do oauth to cloud SCM types so use this to make sure it is indeed a cloud URL
  const cloudScmLibType = getCloudScmLibTypeFromUrl(repo)
  const { authUrl: scmAuthUrl } = _getUrlForScmType({
    scmLibType: cloudScmLibType,
  })

  if (!isRepoAvailable) {
    if (ci || !cloudScmLibType || !scmAuthUrl) {
      const errorMessage = scmAuthUrl
        ? `Cannot access repo ${repo}. Make sure that the repo is accessible and the SCM token configured on Mobb is correct.`
        : `Cannot access repo ${repo} with the provided token, please visit ${scmAuthUrl} to refresh your source control management system token`
      throw new Error(errorMessage)
    }

    if (cloudScmLibType && scmAuthUrl) {
      await handleScmIntegration(tokenInfo.accessToken, scmAuthUrl, repo)

      // Check repo availability again after SCM token update.
      const repoValidationResponse = await gqlClient.validateRepoUrl({
        repoUrl: repo,
      })
      const isRepoAvailable =
        repoValidationResponse.validateRepoUrl?.__typename ===
        'RepoValidationSuccess'

      if (!isRepoAvailable) {
        throw new Error(
          `Cannot access repo ${repo} with the provided credentials: ${repoValidationResponse.validateRepoUrl?.__typename}`
        )
      }
    }
  }
  const revalidateRes = await gqlClient.validateRepoUrl({ repoUrl: repo })
  if (revalidateRes.validateRepoUrl?.__typename !== 'RepoValidationSuccess') {
    throw new Error(
      `could not reach repo ${repo}: ${revalidateRes.validateRepoUrl?.__typename}`
    )
  }

  const reference = ref ?? revalidateRes.validateRepoUrl.defaultBranch
  const getReferenceDataRes = await gqlClient.getReferenceData({
    reference,
    repoUrl: repo,
  })
  if (getReferenceDataRes.gitReference?.__typename !== 'GitReferenceData') {
    throw new Error(
      `Could not get reference data for ${reference}: ${getReferenceDataRes.gitReference?.__typename}`
    )
  }
  const { sha } = getReferenceDataRes.gitReference
  debug('project id %s', projectId)
  debug('default branch %s', reference)

  if (command === 'scan') {
    reportPath = await getReport(
      {
        scanner: SupportedScannersZ.parse(scanner),
        repoUrl: repo,
        sha,
        gqlClient,
        cxProjectName,
        dirname,
        reference,
        ci,
      },
      { skipPrompts }
    )
  }

  if (!reportPath) {
    throw new Error('reportPath is null')
  }
  const uploadReportSpinner = createSpinner('📁 Uploading Report').start()
  try {
    await uploadFile({
      file: reportPath,
      url: reportUploadInfo.url,
      uploadFields: JSON.parse(reportUploadInfo.uploadFieldsJSON) as Record<
        string,
        string
      >,
      uploadKey: reportUploadInfo.uploadKey,
    })
  } catch (e) {
    uploadReportSpinner.error({ text: '📁 Report upload failed' })
    throw e
  }

  await _digestReport({
    gqlClient,
    fixReportId: reportUploadInfo.fixReportId,
    projectId,
    command,
  })

  uploadReportSpinner.success({ text: '📁 Report uploaded successfully' })
  const mobbSpinner = createSpinner('🕵️‍♂️ Initiating Mobb analysis').start()

  const sendReportRes = await sendReport({
    gqlClient,
    spinner: mobbSpinner,
    submitVulnerabilityReportVariables: {
      fixReportId: reportUploadInfo.fixReportId,
      repoUrl: z.string().parse(repo),
      reference,
      projectId,
      vulnerabilityReportFileName: 'report.json',
      sha,
      experimentalEnabled,
      pullRequest: params.pullRequest,
      scanSource: _getScanSource(command),
    },
  })
  if (
    sendReportRes.submitVulnerabilityReport.__typename !== 'VulnerabilityReport'
  ) {
    mobbSpinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
    throw new Error('🕵️‍♂️ Mobb analysis failed')
  }

  mobbSpinner.success({
    text: '🕵️‍♂️ Generating fixes...',
  })
  if (autoPr) {
    await handleAutoPr({
      gqlClient,
      analysisId: reportUploadInfo.fixReportId,
      commitDirectly,
      prId: pullRequest,
      createSpinner,
    })
  }

  await askToOpenAnalysis()
  return reportUploadInfo.fixReportId

  async function askToOpenAnalysis() {
    if (!repoUploadInfo || !reportUploadInfo) {
      throw new Error('uploadS3BucketInfo is null')
    }
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

  async function handleScmIntegration(
    oldToken: string | undefined,
    scmAuthUrl: string,
    repoUrl: string
  ) {
    const scmLibType = getCloudScmLibTypeFromUrl(repoUrl)
    const scmName =
      scmLibType === ScmLibScmType.GITHUB
        ? 'Github'
        : scmLibType === ScmLibScmType.GITLAB
          ? 'Gitlab'
          : scmLibType === ScmLibScmType.ADO
            ? 'Azure DevOps'
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
      const userInfo = await gqlClient.getUserInfo()
      if (!userInfo) {
        throw new CliError('User info not found')
      }
      const scmConfigs = getFromArraySafe<ScmConfig>(userInfo.scmConfigs)

      const tokenInfo = getScmConfig({
        url: repoUrl,
        scmConfigs,
        brokerHosts: getBrokerHosts(
          userInfo.userOrganizationsAndUserOrganizationRoles
        ),
        includeOrgTokens: false,
      })

      if (tokenInfo.accessToken && tokenInfo.accessToken !== oldToken) {
        scmSpinner.success({ text: `🔗 ${scmName} integration successful!` })
        return tokenInfo.accessToken
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
    if (!repoUploadInfo || !reportUploadInfo) {
      throw new Error('uploadS3BucketInfo is null')
    }
    if (!srcPath || !reportPath) {
      throw new Error('src path and reportPath is required')
    }
    const uploadReportSpinner = createSpinner('📁 Uploading Report').start()
    try {
      await uploadFile({
        file: reportPath,
        url: reportUploadInfo.url,
        uploadFields: JSON.parse(reportUploadInfo.uploadFieldsJSON) as Record<
          string,
          string
        >,
        uploadKey: reportUploadInfo.uploadKey,
      })
    } catch (e) {
      uploadReportSpinner.error({ text: '📁 Report upload failed' })
      throw e
    }
    uploadReportSpinner.success({
      text: '📁 Uploading Report successful!',
    })

    const vulnFiles = await _digestReport({
      gqlClient,
      fixReportId: reportUploadInfo.fixReportId,
      projectId,
      command,
    })
    const srcFileStatus = await fsPromises.lstat(srcPath)
    const zippingSpinner = createSpinner('📦 Zipping repo').start()

    let zipBuffer: Buffer
    let gitInfo: GetGitInfoResult = { success: false }

    if (
      srcFileStatus.isFile() &&
      path.extname(srcPath).toLowerCase() === '.fpr'
    ) {
      zipBuffer = await repackFpr(srcPath)
    } else {
      gitInfo = await getGitInfo(srcPath)
      zipBuffer = await pack(srcPath, vulnFiles)
    }

    zippingSpinner.success({ text: '📦 Zipping repo successful!' })

    const uploadRepoSpinner = createSpinner('📁 Uploading Repo').start()
    try {
      await uploadFile({
        file: zipBuffer,
        url: repoUploadInfo.url,
        uploadFields: JSON.parse(repoUploadInfo.uploadFieldsJSON) as Record<
          string,
          string
        >,
        uploadKey: repoUploadInfo.uploadKey,
      })
    } catch (e) {
      uploadRepoSpinner.error({ text: '📁 Repo upload failed' })
      throw e
    }
    uploadRepoSpinner.success({ text: '📁 Uploading Repo successful!' })

    const mobbSpinner = createSpinner('🕵️‍♂️ Initiating Mobb analysis').start()

    try {
      await sendReport({
        gqlClient,
        spinner: mobbSpinner,
        submitVulnerabilityReportVariables: {
          fixReportId: reportUploadInfo.fixReportId,
          projectId: projectId,
          repoUrl: repo || gitInfo.repoUrl || getTopLevelDirName(srcPath),
          reference: ref || gitInfo.reference || 'no-branch',
          sha: commitHash || gitInfo.hash || '0123456789abcdef',
          scanSource: _getScanSource(command),
          pullRequest: params.pullRequest,
        },
      })

      if (command === 'review') {
        const params = z
          .object({
            repo: z.string().url(),
            githubActionToken: z.string(),
          })
          .parse({ repo, githubActionToken })

        const scm = await createScmLib(
          {
            url: params.repo,
            accessToken: params.githubActionToken,
            scmOrg: '',
            scmType: ScmLibScmType.GITHUB,
          },
          {
            propagateExceptions: true,
          }
        )
        await gqlClient.subscribeToAnalysis({
          subscribeToAnalysisParams: {
            analysisId: reportUploadInfo.fixReportId,
          },
          callback: (analysisId) => {
            return addFixCommentsForPr({
              analysisId,
              gqlClient,
              scm,
              scanner: z.nativeEnum(SCANNERS).parse(scanner),
            })
          },
          callbackStates: [Fix_Report_State_Enum.Finished],
        })
      }
    } catch (e) {
      mobbSpinner.error({ text: '🕵️‍♂️ Mobb analysis failed' })
      throw e
    }

    mobbSpinner.success({
      text: '🕵️‍♂️ Generating fixes...',
    })
    if (autoPr) {
      await handleAutoPr({
        gqlClient,
        analysisId: reportUploadInfo.fixReportId,
        commitDirectly,
        prId: pullRequest,
        createSpinner,
      })
    }

    await askToOpenAnalysis()
    return reportUploadInfo.fixReportId
  }
}

export async function _digestReport({
  gqlClient,
  fixReportId,
  projectId,
  command,
}: {
  gqlClient: GQLClient
  fixReportId: string
  projectId: string
  command: MobbCliCommand
}) {
  const digestSpinner = createSpinner(
    progressMassages.processingVulnerabilityReport
  ).start()
  try {
    const { vulnerabilityReportId } = await gqlClient.digestVulnerabilityReport(
      {
        fixReportId,
        projectId,
        scanSource: _getScanSource(command),
      }
    )
    try {
      await gqlClient.subscribeToAnalysis({
        subscribeToAnalysisParams: {
          analysisId: fixReportId,
        },
        callback: () =>
          digestSpinner.update({
            text: progressMassages.processingVulnerabilityReportSuccess,
          }),

        callbackStates: [
          Fix_Report_State_Enum.Digested,
          Fix_Report_State_Enum.Finished,
        ],
        timeoutInMs: VUL_REPORT_DIGEST_TIMEOUT_MS,
      })
    } catch (e) {
      throw new Error(progressMassages.processingVulnerabilityReportFailed)
    }
    const vulnFiles = await gqlClient.getVulnerabilityReportPaths(
      vulnerabilityReportId
    )
    digestSpinner.success({
      text: progressMassages.processingVulnerabilityReportSuccess,
    })
    return vulnFiles
  } catch (e) {
    digestSpinner.error({
      text: '🕵️‍♂️ Digesting report failed. Please verify that the file provided is of a valid supported report format.',
    })
    throw e
  }
}
