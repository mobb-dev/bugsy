import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'

import { SCANNERS, WEB_APP_URL } from '@mobb/bugsy/constants'
import { runAnalysis } from '@mobb/bugsy/features/analysis'
import { getRelevantVulenrabilitiesFromDiff } from '@mobb/bugsy/features/analysis/add_fix_comments_for_pr'
import { GQLClient } from '@mobb/bugsy/features/analysis/graphql'
import {
  scmCloudUrl,
  ScmLibScmType,
  ScmType,
} from '@mobb/bugsy/features/analysis/scm'
import { GithubSCMLib } from '@mobb/bugsy/features/analysis/scm/github/GithubSCMLib'
import { createScmLib } from '@mobb/bugsy/features/analysis/scm/scmFactory'
import { mobbCliCommand } from '@mobb/bugsy/types'
import AdmZip from 'adm-zip'
import { HttpsProxyAgent } from 'https-proxy-agent'
import * as openExport from 'open'
import { describe, expect, it, vi } from 'vitest'

import * as commandsExports from '../src/commands'
import { PROJECT_PAGE_REGEX } from '../src/constants'
import * as analysisExports from '../src/features/analysis'
import * as ourPackModule from '../src/features/analysis/pack'
import { pack } from '../src/features/analysis/pack'
import {
  analysisRegex,
  fixMessageContent,
  GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE,
  GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE,
  GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE,
  GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE,
  GITHUB_FIXER_REPO_FIXABLE_ISSUE,
  GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE,
  irrelevantIssueMessageContent,
  setupCommonBeforeEach,
  TEST_GITHUB_TOKEN,
  token,
} from './integration-test-utils'
import { closeTestPR, createTestPR } from './test-pr-utils'

vi.useFakeTimers({
  shouldAdvanceTime: true,
})

const mockedOpen = vi.spyOn(openExport, 'default')
const expectAnalysisUrlLogged = (consoleMock: {
  mock: { calls: unknown[][] }
}) => {
  const hasMatch = consoleMock.mock.calls.some((call) =>
    call.some((arg) => typeof arg === 'string' && analysisRegex.test(arg))
  )
  expect(hasMatch).toBe(true)
}

vi.mock('open', async () => {
  const { createOpenMockImplementation } =
    await import('./integration-test-utils')
  return {
    default: vi.fn().mockImplementation(createOpenMockImplementation()),
  }
})

vi.mock('../src/features/analysis/scanners/snyk', async () => {
  const { createSnykMockImplementation } =
    await import('./integration-test-utils')
  return {
    getSnykReport: vi.fn().mockImplementation(createSnykMockImplementation()),
  }
})

setupCommonBeforeEach()

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
})

describe('Basic Analyze tests', () => {
  it('Full analyze flow', async () => {
    mockedOpen.mockClear()
    const httpsProxyAgentConnectSpy = vi.spyOn(
      HttpsProxyAgent.prototype,
      'connect'
    )
    const runAnalysisSpy = vi.spyOn(analysisExports, 'runAnalysis')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    await analysisExports.runAnalysis(
      {
        repo: 'https://github.com/mobb-dev/simple-vulnerable-java-project',
        scanner: SCANNERS.Snyk,
        ci: false,
        command: 'scan',
        autoPr: true,
        commitDirectly: true,
        pullRequest: 1,
        mobbProjectName: 'My first project',
      },
      { skipPrompts: true }
    )

    //This test, when executed with a proxy, only calls the https proxy class for websocket connections
    //This validation here is to make sure that we do use the proxy when needed for websocket connections
    if (process.env['HTTP_PROXY']) {
      expect(httpsProxyAgentConnectSpy).toHaveBeenCalled()
    } else {
      expect(httpsProxyAgentConnectSpy).not.toHaveBeenCalled()
    }
    expect(runAnalysisSpy).toHaveBeenCalled()
    expect(autoPrAnalysisSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        analysisId: expect.any(String),
        commitDirectly: true,
        prId: 1,
        prStrategy: 'SPREAD',
      })
    )
    expect(mockedOpen).toHaveBeenCalledTimes(2)
    expect(mockedOpen).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
  })

  it('add-scm-token good token', async () => {
    mockedOpen.mockClear()
    const addScmTokenSpy = vi.spyOn(commandsExports, 'addScmToken')
    await commandsExports.addScmToken({
      token: TEST_GITHUB_TOKEN,
      scmType: ScmType.GitHub,
      url: scmCloudUrl.GitHub,
      'scm-type': ScmType.GitHub,
      ci: true,
      _: [],
      $0: '',
    })

    expect(addScmTokenSpy).toHaveBeenCalled()
    expect(addScmTokenSpy).not.toThrowError()
  })

  it('add-scm-token bad token', async () => {
    mockedOpen.mockClear()
    await expect(
      commandsExports.addScmToken({
        token: 'bad-token',
        scmType: ScmType.GitHub,
        url: scmCloudUrl.GitHub,
        'scm-type': ScmType.GitHub,
        ci: true,
        _: [],
        $0: '',
      })
    ).rejects.toThrowError('Invalid SCM credentials')
  })

  it('add-scm-token bad cloud url', async () => {
    mockedOpen.mockClear()
    await expect(
      commandsExports.addScmToken({
        token: TEST_GITHUB_TOKEN,
        scmType: ScmType.GitHub,
        url: 'https://gitbadscmdomain.com/a/b',
        'scm-type': ScmType.GitHub,
        ci: true,
        _: [],
        $0: '',
      })
    ).rejects.toThrowError('Mobb could not reach the repository')
  })

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
          mobbProjectName: 'My first project',
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

  it('Direct repo upload from FPR file', async () => {
    const packSpy = vi.spyOn(ourPackModule, 'repackFpr')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    mockedOpen.mockClear()
    await analysisExports.runAnalysis(
      {
        repo: 'https://bitbucket.com/a/b',
        ref: 'test',
        commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
        scanFile: path.join(__dirname, 'assets/scandata.fpr'),
        srcPath: path.join(__dirname, 'assets/scandata.fpr'),
        ci: false,
        command: 'analyze',
        mobbProjectName: 'My first project',
      },
      { skipPrompts: true }
    )
    expect(mockedOpen).toHaveBeenCalledTimes(2)
    expect(autoPrAnalysisSpy).not.toHaveBeenCalled()
    expect(mockedOpen).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
    // ensure that we filter only relevant files
    const packedResult = await packSpy.mock.results[0]?.value
    const uploadedRepoZip = new AdmZip(Buffer.from(packedResult))
    expect(uploadedRepoZip.getEntryCount()).toBe(12)
  })

  it('Checks ci flag', async () => {
    const consoleMock = vi.spyOn(console, 'log')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const prNumber = 1
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
        commitDirectly: true,
        pullRequest: prNumber,
        mobbProjectName: 'My first project',
      },
      { skipPrompts: true }
    )
    expect(autoPrAnalysisSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        analysisId: expect.any(String),
        commitDirectly: true,
        prId: prNumber,
        prStrategy: 'SPREAD',
      })
    )
    expectAnalysisUrlLogged(consoleMock)
    consoleMock.mockClear()
  })
  it('Should run the github fixer command - fixable issue', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/snyk_report.json'
    )
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await createScmLib({
      url: GITHUB_FIXER_REPO_FIXABLE_ISSUE.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })
    if (!(scm instanceof GithubSCMLib)) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    // Create a test PR dynamically
    const { prNumber: pullRequestNumber, branchName } = await createTestPR({
      repoUrl: GITHUB_FIXER_REPO_FIXABLE_ISSUE.URL,
      sourceBranch: GITHUB_FIXER_REPO_FIXABLE_ISSUE.REF,
      title: 'Test PR for fixable issue',
      token: TEST_GITHUB_TOKEN,
    })

    try {
      const analysisId = await runAnalysis(
        {
          repo: GITHUB_FIXER_REPO_FIXABLE_ISSUE.URL,
          ref: GITHUB_FIXER_REPO_FIXABLE_ISSUE.REF,
          commitHash: GITHUB_FIXER_REPO_FIXABLE_ISSUE.COMMIT_HASH,
          scanner: SCANNERS.Snyk,
          pullRequest: pullRequestNumber,
          githubToken: TEST_GITHUB_TOKEN,
          scanFile: reportPath,
          command: mobbCliCommand.review,
          ci: true,
          mobbProjectName: 'My first project',
        },
        { skipPrompts: true }
      )

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()

      const getAnalysis = await gqlClient.getAnalysis(analysisId)
      const {
        vulnerabilityReport: {
          projectId,
          project: { organizationId },
        },
      } = getAnalysis

      const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
      const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
        diff,
        gqlClient,
        vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
      })

      // Need to wait to make sure the comments are updated
      await setTimeout(10000)
      const comments = await castedScm.getPrComments({
        pull_number: pullRequestNumber,
      })

      expect(prVulenrabilities.fixablePrVuls).toBe(1)
      expect(prVulenrabilities.nonFixablePrVuls).toBe(0)
      expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
      expect(prVulenrabilities.totalScanVulnerabilities).toBe(2)
      expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(1)
      expect(
        prVulenrabilities.irrelevantVulnerabilityReportIssues?.length
      ).toBe(0)

      const [prComment] = comments.data
      if (!prComment) {
        throw new Error('PR comment not found')
      }
      const [fixId] = prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
        ({ vulnerabilityReportIssue: { fixId } }) => fixId
      )
      console.log('ALL COMMENTS:', JSON.stringify(comments.data, null, 2))
      expect(comments.data.length).toBe(1)

      const searchParams = new URLSearchParams()
      searchParams.append('commit_redirect_url', prComment.html_url)
      searchParams.append('comment_id', prComment.id.toString())

      const fixUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/fix/${fixId}?${searchParams.toString()}`

      expect(prComment.body.startsWith(fixMessageContent)).toBe(true)
      expect(prComment.body.split('\n').pop()).toBe(
        `[Learn more and fine tune the fix](${fixUrl})`
      )
    } finally {
      // Clean up the PR
      await closeTestPR({
        repoUrl: GITHUB_FIXER_REPO_FIXABLE_ISSUE.URL,
        prNumber: pullRequestNumber,
        token: TEST_GITHUB_TOKEN,
        branchName,
      })
    }
  })

  it('Should run the github fixer command - irrelevant autogenerated code fixable issue', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/irrelevant_autogenerated_code/snyk_report.json'
    )

    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await createScmLib({
      url: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })

    if (!(scm instanceof GithubSCMLib)) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    // Create a test PR dynamically
    const { prNumber: pullRequestNumber, branchName } = await createTestPR({
      repoUrl:
        GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.URL,
      sourceBranch:
        GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.REF,
      title: 'Test PR for irrelevant autogenerated code',
      token: TEST_GITHUB_TOKEN,
    })

    try {
      const analysisId = await runAnalysis(
        {
          repo: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.URL,
          ref: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.REF,
          commitHash:
            GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.COMMIT_HASH,
          scanner: SCANNERS.Snyk,
          pullRequest: pullRequestNumber,
          githubToken: TEST_GITHUB_TOKEN,
          scanFile: reportPath,
          command: mobbCliCommand.review,
          ci: true,
          experimentalEnabled: true,
          mobbProjectName: 'My first project',
        },
        { skipPrompts: true }
      )

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()

      const getAnalysis = await gqlClient.getAnalysis(analysisId)
      const {
        vulnerabilityReport: {
          projectId,
          project: { organizationId },
        },
      } = getAnalysis

      const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
      const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
        diff,
        gqlClient,
        vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
      })

      // Need to wait to make sure the comments are updated
      await setTimeout(10000)

      const comments = await castedScm.getPrComments({
        pull_number: pullRequestNumber,
      })

      expect(prVulenrabilities.fixablePrVuls).toBe(1)
      expect(prVulenrabilities.nonFixablePrVuls).toBe(0)
      expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
      expect(prVulenrabilities.totalScanVulnerabilities).toBe(3)
      expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(2)

      const [prComment] = comments.data
      if (!prComment) {
        throw new Error('PR comment not found')
      }
      const [vulnerabilityReportIssueId] =
        prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
          ({ vulnerabilityReportIssueId }) => vulnerabilityReportIssueId
        )
      console.log('ALL COMMENTS:', JSON.stringify(comments.data, null, 2))
      expect(comments.data.length).toBe(1)

      const searchParams = new URLSearchParams()
      searchParams.append('commit_redirect_url', prComment.html_url)
      searchParams.append('comment_id', prComment.id.toString())

      const fixUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/issue/${vulnerabilityReportIssueId}?${searchParams.toString()}`

      expect(prComment.body.startsWith(fixMessageContent)).toBe(true)
      expect(prComment.body.split('\n').pop()).toBe(
        `[Learn more and fine tune the fix](${fixUrl})`
      )
    } finally {
      // Clean up the PR
      await closeTestPR({
        repoUrl:
          GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUTO_GENERATED_CODE_ISSUE.URL,
        prNumber: pullRequestNumber,
        token: TEST_GITHUB_TOKEN,
        branchName,
      })
    }
  })

  it('Should run the github fixer command - irrelevant test code fixable issue', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/irrelevant_test_code/snyk_report.json'
    )
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await createScmLib({
      url: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })

    if (!(scm instanceof GithubSCMLib)) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    // Create a test PR dynamically
    const { prNumber: pullRequestNumber, branchName } = await createTestPR({
      repoUrl: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.URL,
      sourceBranch: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.REF,
      title: 'Test PR for irrelevant test code',
      token: TEST_GITHUB_TOKEN,
    })

    try {
      const analysisId = await runAnalysis(
        {
          repo: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.URL,
          ref: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.REF,
          commitHash:
            GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.COMMIT_HASH,
          scanner: SCANNERS.Snyk,
          pullRequest: pullRequestNumber,
          githubToken: TEST_GITHUB_TOKEN,
          scanFile: reportPath,
          command: mobbCliCommand.review,
          ci: true,
          experimentalEnabled: true,
          mobbProjectName: 'My first project',
        },
        { skipPrompts: true }
      )

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()
      const getAnalysis = await gqlClient.getAnalysis(analysisId)
      const {
        vulnerabilityReport: {
          projectId,
          project: { organizationId },
        },
      } = getAnalysis

      const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
      const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
        diff,
        gqlClient,
        vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
      })

      // Need to wait to make sure the comments are updated
      await setTimeout(10000)
      const comments = await castedScm.getPrComments({
        pull_number: pullRequestNumber,
      })

      expect(prVulenrabilities.fixablePrVuls).toBe(1)
      expect(prVulenrabilities.nonFixablePrVuls).toBe(0)
      expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
      expect(prVulenrabilities.totalScanVulnerabilities).toBe(2)
      expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(1)
      expect(
        prVulenrabilities.irrelevantVulnerabilityReportIssues?.length
      ).toBe(0)

      const [prComment] = comments.data
      if (!prComment) {
        throw new Error('PR comment not found')
      }
      const [vulnerabilityReportIssueId] =
        prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
          ({ vulnerabilityReportIssueId }) => vulnerabilityReportIssueId
        )
      console.log('ALL COMMENTS:', JSON.stringify(comments.data, null, 2))
      expect(comments.data.length).toBe(1)

      const searchParams = new URLSearchParams()
      searchParams.append('commit_redirect_url', prComment.html_url)
      searchParams.append('comment_id', prComment.id.toString())

      const fixUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/issue/${vulnerabilityReportIssueId}?${searchParams.toString()}`

      expect(prComment.body.startsWith(fixMessageContent)).toBe(true)
      expect(prComment.body.split('\n').pop()).toBe(
        `[Learn more and fine tune the fix](${fixUrl})`
      )
    } finally {
      // Clean up the PR
      await closeTestPR({
        repoUrl: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_TEST_CODE_ISSUE.URL,
        prNumber: pullRequestNumber,
        token: TEST_GITHUB_TOKEN,
        branchName,
      })
    }
  })

  it('Should run the github fixer command - irrelevant auxilary code fixable issue', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/irrelevant_auxiliary_code/snyk_report.json'
    )
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await createScmLib({
      url: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })
    if (!(scm instanceof GithubSCMLib)) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    // Create a test PR dynamically
    const { prNumber: pullRequestNumber, branchName } = await createTestPR({
      repoUrl: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.URL,
      sourceBranch:
        GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.REF,
      title: 'Test PR for irrelevant auxiliary code',
      token: TEST_GITHUB_TOKEN,
    })

    try {
      const analysisId = await runAnalysis(
        {
          repo: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.URL,
          ref: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.REF,
          commitHash:
            GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.COMMIT_HASH,
          scanner: SCANNERS.Snyk,
          pullRequest: pullRequestNumber,
          githubToken: TEST_GITHUB_TOKEN,
          scanFile: reportPath,
          command: mobbCliCommand.review,
          ci: true,
          experimentalEnabled: true,
          mobbProjectName: 'My first project',
        },
        { skipPrompts: true }
      )

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()
      const getAnalysis = await gqlClient.getAnalysis(analysisId)
      const {
        vulnerabilityReport: {
          projectId,
          project: { organizationId },
        },
      } = getAnalysis

      const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
      const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
        diff,
        gqlClient,
        vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
      })

      // Need to wait to make sure the comments are updated
      await setTimeout(10000)
      const comments = await castedScm.getPrComments({
        pull_number: pullRequestNumber,
      })

      expect(prVulenrabilities.fixablePrVuls).toBe(1)
      expect(prVulenrabilities.nonFixablePrVuls).toBe(0)
      expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
      expect(prVulenrabilities.totalScanVulnerabilities).toBe(2)
      expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(1)
      expect(
        prVulenrabilities.irrelevantVulnerabilityReportIssues?.length
      ).toBe(0)

      const [prComment] = comments.data
      if (!prComment) {
        throw new Error('PR comment not found')
      }
      const [vulnerabilityReportIssueId] =
        prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
          ({ vulnerabilityReportIssueId }) => vulnerabilityReportIssueId
        )
      console.log('ALL COMMENTS:', JSON.stringify(comments.data, null, 2))
      expect(comments.data.length).toBe(1)

      const searchParams = new URLSearchParams()
      searchParams.append('commit_redirect_url', prComment.html_url)
      searchParams.append('comment_id', prComment.id.toString())

      const fixUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/issue/${vulnerabilityReportIssueId}?${searchParams.toString()}`

      expect(prComment.body.startsWith(fixMessageContent)).toBe(true)
      expect(prComment.body.split('\n').pop()).toBe(
        `[Learn more and fine tune the fix](${fixUrl})`
      )
    } finally {
      // Clean up the PR
      await closeTestPR({
        repoUrl: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_AUXILIARY_CODE_ISSUE.URL,
        prNumber: pullRequestNumber,
        token: TEST_GITHUB_TOKEN,
        branchName,
      })
    }
  })

  it('Should run the github fixer command - irrelevant vendor code fixable issue', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/irrelevant_vendor_code/snyk_report.json'
    )
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await createScmLib({
      url: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })
    if (!(scm instanceof GithubSCMLib)) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    // Create a test PR dynamically
    const { prNumber: pullRequestNumber, branchName } = await createTestPR({
      repoUrl: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.URL,
      sourceBranch: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.REF,
      title: 'Test PR for irrelevant vendor code',
      token: TEST_GITHUB_TOKEN,
    })

    try {
      const analysisId = await runAnalysis(
        {
          repo: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.URL,
          ref: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.REF,
          commitHash:
            GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.COMMIT_HASH,
          scanner: SCANNERS.Snyk,
          pullRequest: pullRequestNumber,
          githubToken: TEST_GITHUB_TOKEN,
          scanFile: reportPath,
          command: mobbCliCommand.review,
          ci: true,
          experimentalEnabled: true,
          mobbProjectName: 'My first project',
        },
        { skipPrompts: true }
      )

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()
      const getAnalysis = await gqlClient.getAnalysis(analysisId)
      const {
        vulnerabilityReport: {
          projectId,
          project: { organizationId },
        },
      } = getAnalysis

      const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
      const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
        diff,
        gqlClient,
        vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
      })

      // Need to wait to make sure the comments are updated
      await setTimeout(10000)
      const comments = await castedScm.getPrComments({
        pull_number: pullRequestNumber,
      })

      expect(prVulenrabilities.fixablePrVuls).toBe(1)
      expect(prVulenrabilities.nonFixablePrVuls).toBe(0)
      expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
      expect(prVulenrabilities.totalScanVulnerabilities).toBe(2)
      expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(1)
      expect(
        prVulenrabilities.irrelevantVulnerabilityReportIssues?.length
      ).toBe(0)

      const [prComment] = comments.data
      if (!prComment) {
        throw new Error('PR comment not found')
      }
      const [vulnerabilityReportIssueId] =
        prVulenrabilities.vulnerabilityReportIssueCodeNodes.map(
          ({ vulnerabilityReportIssueId }) => vulnerabilityReportIssueId
        )
      console.log('ALL COMMENTS:', JSON.stringify(comments.data, null, 2))
      expect(comments.data.length).toBe(1)

      const searchParams = new URLSearchParams()
      searchParams.append('commit_redirect_url', prComment.html_url)
      searchParams.append('comment_id', prComment.id.toString())

      const fixUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/issue/${vulnerabilityReportIssueId}?${searchParams.toString()}`

      expect(prComment.body.startsWith(fixMessageContent)).toBe(true)
      expect(prComment.body.split('\n').pop()).toBe(
        `[Learn more and fine tune the fix](${fixUrl})`
      )
    } finally {
      // Clean up the PR
      await closeTestPR({
        repoUrl: GITHUB_FIXER_REPO_FIXABLE_IRRELEVANT_VENDOR_CODE_ISSUE.URL,
        prNumber: pullRequestNumber,
        token: TEST_GITHUB_TOKEN,
        branchName,
      })
    }
  })

  it('Should run the github fixer command - irrelevant false positive code not fixable issue', async () => {
    const reportPath = path.join(
      __dirname,
      'assets/github_fixer_demo/false_positive_no_fix_llm/checkmarx_report.json'
    )
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const scm = await createScmLib({
      url: GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: TEST_GITHUB_TOKEN,
      scmOrg: undefined,
    })
    if (scm instanceof GithubSCMLib === false) {
      throw new Error('SCM is not GithubSCMLib')
    }
    // todo: for some reason, the type is not inferred correctly when building while ide shows it correctly
    const castedScm = scm as GithubSCMLib

    // Create a test PR dynamically
    const { prNumber: pullRequestNumber, branchName } = await createTestPR({
      repoUrl:
        GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.URL,
      sourceBranch:
        GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.REF,
      title: 'Test PR for false positive issue',
      token: TEST_GITHUB_TOKEN,
    })

    try {
      const analysisId = await runAnalysis(
        {
          repo: GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.URL,
          ref: GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.REF,
          commitHash:
            GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.COMMIT_HASH,
          scanner: SCANNERS.Checkmarx,
          pullRequest: pullRequestNumber,
          githubToken: TEST_GITHUB_TOKEN,
          scanFile: reportPath,
          command: mobbCliCommand.review,
          ci: true,
          experimentalEnabled: true,
          mobbProjectName: 'My first project',
        },
        { skipPrompts: true }
      )

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      expect(autoPrAnalysisSpy).not.toHaveBeenCalled()
      const getAnalysis = await gqlClient.getAnalysis(analysisId)
      const {
        vulnerabilityReport: {
          projectId,
          project: { organizationId },
        },
      } = getAnalysis

      const diff = await castedScm.getPrDiff({ pull_number: pullRequestNumber })
      const prVulenrabilities = await getRelevantVulenrabilitiesFromDiff({
        diff,
        gqlClient,
        vulnerabilityReportId: getAnalysis.vulnerabilityReportId,
      })

      // Need to wait to make sure the comments are updated
      await setTimeout(10000)
      const [comments, generalPrComments] = await Promise.all([
        castedScm.getPrComments({ pull_number: pullRequestNumber }),
        castedScm.getGeneralPrComments({ prNumber: pullRequestNumber }),
      ])

      expect(prVulenrabilities.vulnerabilityReportIssueCodeNodes?.length).toBe(
        0
      )
      expect(prVulenrabilities.nonFixablePrVuls).toBe(1)
      expect(prVulenrabilities.fixablePrVuls).toBe(0)
      expect(prVulenrabilities.totalScanVulnerabilities).toBe(1)
      expect(prVulenrabilities.vulnerabilitiesOutsidePr).toBe(0)
      expect(prVulenrabilities.totalPrVulnerabilities).toBe(1)
      expect(
        prVulenrabilities.irrelevantVulnerabilityReportIssues?.length
      ).toBe(1)

      const vr = prVulenrabilities.irrelevantVulnerabilityReportIssues[0]
      expect(vr).is.not.toBeNull()
      expect(vr?.fixId).is.toBeNull()
      expect(vr?.id).is.not.toBeNull()
      expect(vr?.category).toBe('FalsePositive')
      expect(vr?.vulnerabilityReportIssueTags?.length).toBe(1)
      expect(vr?.vulnerabilityReportIssueTags[0]?.tag).toBe('FALSE_POSITIVE')
      expect(vr?.codeNodes?.length).toBe(1)

      const [prComment] = comments.data
      if (!prComment) {
        throw new Error('PR comment not found')
      }

      console.log('ALL COMMENTS:', JSON.stringify(comments.data, null, 2))
      expect(comments.data.length).toBe(1)

      const searchParams = new URLSearchParams()
      searchParams.append('commit_redirect_url', prComment.html_url)
      searchParams.append('comment_id', prComment.id.toString())

      const issueUrl = `${WEB_APP_URL}/organization/${organizationId}/project/${projectId}/report/${analysisId}/issue/${vr?.id}?${searchParams.toString()}`
      expect(generalPrComments.data[0]?.body).toMatchInlineSnapshot(`
       "# ![image](https://app.mobb.ai/gh-action/Logo_Rounded_Icon.svg) We couldn't fix the issues detected by **Checkmarx**
Mobb Fixer gets better and better every day, but unfortunately your current issues aren't supported yet.
For specific requests [contact us](https://content.mobb.ai/contact) and we'll do the most to answer your need quickly."
    `)
      expect(prComment.body.split('\n').pop()).toBe(
        `[Learn more about this issue](${issueUrl})`
      )

      comments.data.forEach((comment) => {
        expect(comment.body.startsWith(irrelevantIssueMessageContent)).toBe(
          true
        )
      })
    } finally {
      // Clean up the PR
      await closeTestPR({
        repoUrl:
          GITHUB_FIXER_REPO_NOT_FIXABLE_IRRELEVANT_FALSE_POSITIVE_ISSUE.URL,
        prNumber: pullRequestNumber,
        token: TEST_GITHUB_TOKEN,
        branchName,
      })
    }
  })
})

describe('create-one-pr flag tests', () => {
  it('should successy run analysis with create-one-pr and auto-pr', async () => {
    const consoleMock = vi.spyOn(console, 'log')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    // Note: For non-GitHub repos, we'll use a static PR number since we can't create PRs
    const prNumber = 1
    await analysisExports.runAnalysis(
      {
        repo: 'https://bitbucket.com/a/b',
        ref: 'test',
        commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
        scanFile: path.join(__dirname, 'assets/simple/codeql_report.json'),
        srcPath: path.join(__dirname, 'assets'),
        ci: true,
        command: 'analyze',
        createOnePr: true,
        autoPr: true,
        commitDirectly: false,
        pullRequest: prNumber,
        mobbProjectName: 'My first project',
      },
      { skipPrompts: true }
    )
    expect(autoPrAnalysisSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        analysisId: expect.any(String),
        commitDirectly: false,
        prId: prNumber,
        prStrategy: 'CONDENSE',
      })
    )
    expectAnalysisUrlLogged(consoleMock)
    consoleMock.mockClear()
  })

  it('should successfully run analysis with create-one-pr and auto-pr in non-CI mode', async () => {
    const consoleMock = vi.spyOn(console, 'log')
    const autoPrAnalysisSpy = vi.spyOn(GQLClient.prototype, 'autoPrAnalysis')
    const mockedOpen = vi.spyOn(openExport, 'default')
    await analysisExports.runAnalysis(
      {
        repo: 'https://bitbucket.com/a/b',
        ref: 'test',
        commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
        scanFile: path.join(__dirname, 'assets/simple/codeql_report.json'),
        srcPath: path.join(__dirname, 'assets'),
        ci: false,
        command: 'analyze',
        createOnePr: true,
        autoPr: true,
        commitDirectly: false,
        mobbProjectName: 'My first project',
      },
      { skipPrompts: true }
    )
    expect(autoPrAnalysisSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        analysisId: expect.any(String),
        commitDirectly: false,
        prId: undefined,
        prStrategy: 'CONDENSE',
      })
    )
    expect(mockedOpen).toHaveBeenCalledTimes(2)
    expect(mockedOpen).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
    consoleMock.mockClear()
    mockedOpen.mockClear()
  })
})
