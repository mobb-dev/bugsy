import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { API_URL, SCANNERS, WEB_APP_URL } from '@mobb/bugsy/constants'
import { runAnalysis } from '@mobb/bugsy/features/analysis'
import { getRelevantVulenrabilitiesFromDiff } from '@mobb/bugsy/features/analysis/add_fix_comments_for_pr'
import { GQLClient } from '@mobb/bugsy/features/analysis/graphql'
import {
  GithubSCMLib,
  MOBB_ICON_IMG,
  scmCloudUrl,
  SCMLib,
  ScmLibScmType,
  ScmType,
} from '@mobb/bugsy/features/analysis/scm'
import { PerformCliLoginDocument } from '@mobb/bugsy/features/analysis/scm/generates/client_generates'
import { mobbCliCommand } from '@mobb/bugsy/types'
import AdmZip from 'adm-zip'
import * as dotenv from 'dotenv'
import * as openExport from 'open'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { PROJECT_PAGE_REGEX } from '../src/constants'
import * as analysisExports from '../src/features/analysis'
import * as ourPackModule from '../src/features/analysis/pack'
import { pack } from '../src/features/analysis/pack'

dotenv.config({
  path: path.join(__dirname, '../../../__tests__/.env'),
})

const TEST_GITHUB_TOKEN = z
  .string()
  .parse(process.env['TEST_GITHUB_FIXER_TOKEN'])
const uuidRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
const analysisRegex = new RegExp(
  `organization/${uuidRegex}/project/${uuidRegex}/report/${uuidRegex}`
)
const GITHUB_FIXER_REPO = {
  URL: 'https://github.com/mobb-dev/gh-fixer',
  COMMIT_HASH: '279ad4ae8c9f9e1bf3f53d71d8ee888e476a8e92',
  REF: 'vul-pr',
  PR_NUMBER: 1,
} as const

const fixMessageContent = `# ![image](${MOBB_ICON_IMG}) XSS fix is ready`

const token = z.string().parse(process.env['TOKEN'])
const mockedOpen = vi.spyOn(openExport, 'default')

vi.mock('open', () => ({
  default: vi.fn().mockImplementation(async (url: string) => {
    const match = url.match(/\/cli-login\/(.*?)\?.*$/)
    if (match && match.length == 2) {
      const loginId = match[1]
      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      await gqlClient.createCommunityUser()
      // Emulate "Authenticate" button click in the Web UI.
      const performLoginRes = await fetch(API_URL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: PerformCliLoginDocument,
          variables: {
            loginId,
          },
        }),
        method: 'POST',
      })
      expect(performLoginRes.status).toStrictEqual(200)
      await gqlClient.updateScmToken({
        scmType: ScmType.GitHub,
        url: scmCloudUrl.GitHub,
        org: undefined,
        refreshToken: undefined,
        token: TEST_GITHUB_TOKEN,
      })
    }
  }),
}))

vi.mock('../src/features/analysis/scanners/snyk', () => ({
  getSnykReport: vi.fn().mockImplementation(async (reportPath) => {
    fs.copyFileSync(path.join(__dirname, 'report.json'), reportPath)
    return true
  }),
}))

it('test manifest files are included in zip upload', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mobb-cli-test-pack'))
  const zip = new AdmZip(
    path.join(
      __dirname,
      '..',
      '..',
      '..',
      'services',
      'node_general_backend',
      'src',
      'maintenance',
      'try_now',
      'juice-shop',
      'repo.zip'
    )
  )
  zip.extractAllTo(tmpDir)
  const buffer = await pack(tmpDir, ['package.json', 'routes/dataExport.ts'])
  const updatedZip = new AdmZip(buffer)
  expect(updatedZip.getEntries().length).toBe(3)
  updatedZip.getEntries().forEach((entry) => {
    expect([
      'package.json',
      'frontend/package.json',
      'routes/dataExport.ts',
    ]).toContain(entry.entryName)
  })
}, 30000)

describe('Basic Analyze tests', () => {
  it('Full analyze flow', async () => {
    mockedOpen.mockClear()
    const runAnalysisSpy = vi.spyOn(analysisExports, 'runAnalysis')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    await analysisExports.runAnalysis(
      {
        repo: 'https://github.com/mobb-dev/simple-vulnerable-java-project',
        scanner: SCANNERS.Snyk,
        ci: false,
        command: 'scan',
        autoPr: true,
      },
      { skipPrompts: true }
    )

    expect(runAnalysisSpy).toHaveBeenCalled()
    expect(autoPrAnalysisSpy).toHaveBeenCalled()
    expect(mockedOpen).toHaveBeenCalledTimes(2)
    expect(mockedOpen).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
  }, 30000)

  it.each(['assets', 'assets/simple', 'assets/simple/src'])(
    'Direct repo upload',
    async (srcPath) => {
      const packSpy = vi.spyOn(ourPackModule, 'pack')
      const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
      mockedOpen.mockClear()
      await analysisExports.runAnalysis(
        {
          repo: 'https://bitbucket.com/a/b',
          ref: 'test',
          commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
          scanFile: path.join(__dirname, 'assets/simple/codeql_report.json'),
          srcPath: path.join(__dirname, srcPath),
          ci: false,
          command: 'analyze',
        },
        { skipPrompts: true }
      )
      expect(mockedOpen).toHaveBeenCalledTimes(2)
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()
      expect(mockedOpen).toBeCalledWith(
        expect.stringMatching(PROJECT_PAGE_REGEX)
      )
      // ensure that we filter only relevant files
      const packedResult = await packSpy.mock.results[0]?.value
      const uploadedRepoZip = new AdmZip(Buffer.from(packedResult))
      expect(uploadedRepoZip.getEntryCount()).toBe(1)
    }
  )

  it('Checks ci flag', async () => {
    const consoleMock = vi.spyOn(console, 'log')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    await analysisExports.runAnalysis(
      {
        repo: 'https://bitbucket.com/a/b',
        ref: 'test',
        commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
        scanFile: path.join(__dirname, 'assets/simple/codeql_report.json'),
        srcPath: path.join(__dirname, 'assets'),
        ci: true,
        command: 'analyze',
        autoPr: true,
      },
      { skipPrompts: true }
    )
    expect(autoPrAnalysisSpy).toHaveBeenCalled()
    expect(analysisRegex.test(consoleMock.mock.lastCall?.at(0))).toBe(true)
    consoleMock.mockClear()
  })
  it('Should run the github fixer command', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/snyk_report.json'
    )
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await SCMLib.init({
      url: GITHUB_FIXER_REPO.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })
    if (scm instanceof GithubSCMLib === false) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    const analysisId = await runAnalysis(
      {
        repo: GITHUB_FIXER_REPO.URL,
        ref: GITHUB_FIXER_REPO.REF,
        commitHash: GITHUB_FIXER_REPO.COMMIT_HASH,
        scanner: SCANNERS.Snyk,
        pullRequest: GITHUB_FIXER_REPO.PR_NUMBER,
        githubToken: TEST_GITHUB_TOKEN,
        scanFile: reportPath,
        command: mobbCliCommand.review,
        srcPath: path.join(__dirname, 'assets/github_fixer_demo/repo'),
        ci: true,
      },
      { skipPrompts: true }
    )
    const gqlClient = new GQLClient({
      token,
      type: 'token',
    })
    expect(autoPrAnalysisSpy).not.toHaveBeenCalled()

    const pullRequestNumber = GITHUB_FIXER_REPO.PR_NUMBER
    const getAnalysis = await gqlClient.getAnalysis(analysisId)
    const {
      vulnerabilityReport: {
        projectId,
        project: { organizationId },
      },
    } = getAnalysis
    const [comments, generalPrComments] = await Promise.all([
      castedScm.getPrComments({ pull_number: pullRequestNumber }),
      castedScm.getGeneralPrComments({ prNumber: pullRequestNumber }),
    ])
    const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
    const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
      diff,
      gqlClient,
      vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
    })

    //TODO: JONATHANA delete me after we find the problem
    console.log(
      `test debug: pr number: ${pullRequestNumber}\n\n\n${JSON.stringify(comments)}\n\n\n${JSON.stringify(generalPrComments)}\n\n\n${JSON.stringify(prVulenrabilities)}\n\n\n${JSON.stringify(diff)}`
    )

    expect(prVulenrabilities.fixablePrVuls).toBe(1)
    expect(prVulenrabilities.nonFixablePrVuls).toBe(0)
    expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
    expect(prVulenrabilities.totalScanVulnerabilities).toBe(2)
    expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(1)

    const [prComment] = comments.data
    if (!prComment) {
      throw new Error('PR comment not found')
    }
    const [fixId] = prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
      ({ vulnerabilityReportIssue: { fixId } }) => fixId
    )
    expect(comments.data.length).toBe(1)

    const searchParams = new URLSearchParams()
    searchParams.append('commit_redirect_url', prComment.html_url)
    searchParams.append('comment_id', prComment.id.toString())

    const fixUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/fix/${fixId}?${searchParams.toString()}`

    expect(prComment.body.startsWith(fixMessageContent)).toBe(true)
    expect(prComment.body.split('\n').pop()).toBe(
      `[Learn more and fine tune the fix](${fixUrl})`
    )
    expect(generalPrComments.data[0]?.body).toMatchInlineSnapshot(`
    "# ![image](${MOBB_ICON_IMG}) 1 fix is ready to be committed
    **XSS** - 1"
  `)
  })
})
