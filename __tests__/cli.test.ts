import path from 'node:path'

import { parseArgs } from '@mobb/bugsy/args/yargs'
import { SCANNERS } from '@mobb/bugsy/constants'
import * as analysisExports from '@mobb/bugsy/features/analysis'
import { mobbCliCommand } from '@mobb/bugsy/types'
import { describe, expect, it, vi } from 'vitest'

const TEST_REPO = {
  URL: 'https://github.com/yhaggai/GitHub-Fixer-Demo-private',
  COMMIT_HASH: 'f6bec6ebb5a5a5283b1767a5f622f5309fd2e6e5',
  API_KEY: 'gReSDe7YojXUgxqK5EjgbMWKiXAzk0',
  REF: 'yhaggai-patch-2',
  PR_NUMBER: 3,
} as const

const TEST_GITHUB_TOKEN = 'token'

const kebabCase = (arg: string) =>
  `--${arg
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()}`

const reportPath = path.join(
  __dirname,
  'assets/github_fixer_demo/snyk_report.json'
)

vi.mock('@mobb/bugsy/features/analysis', async () => {
  const actual = await vi.importActual<
    typeof import('@mobb/bugsy/features/analysis')
  >('@mobb/bugsy/features/analysis')
  const mocks = {
    runAnalysis: vi.fn(),
  }
  return { ...actual, ...mocks }
})

describe('cli commands', () => {
  it('should run the github fixer command', async () => {
    const srcPath = path.join(__dirname, 'assets')
    const baseReviewOptions = {
      apiKey: TEST_REPO.API_KEY,
      repo: TEST_REPO.URL,
      ref: TEST_REPO.REF,
      commitHash: TEST_REPO.COMMIT_HASH,
      scanner: SCANNERS.Snyk,
      pullRequest: TEST_REPO.PR_NUMBER,
      githubToken: TEST_GITHUB_TOKEN,
      scanFile: reportPath,
      srcPath,
    }
    const rawArgs = Object.entries(baseReviewOptions).flatMap(
      ([key, value]) => {
        return [kebabCase(key), `${value}`]
      }
    )
    const runAnalysisSpy = vi.spyOn(analysisExports, 'runAnalysis')
    await runCommand([mobbCliCommand.review, ...rawArgs])
    expect(runAnalysisSpy).toBeCalled()
    expect(runAnalysisSpy).toBeCalledWith(
      {
        apiKey: TEST_REPO.API_KEY,
        ci: true,
        command: 'review',
        commitHash: TEST_REPO.COMMIT_HASH,
        experimentalEnabled: false,
        githubToken: TEST_GITHUB_TOKEN,
        mobbProjectName: 'My first project',
        pullRequest: TEST_REPO.PR_NUMBER,
        ref: TEST_REPO.REF,
        repo: TEST_REPO.URL,
        scanFile: reportPath,
        scanner: 'snyk',
        srcPath,
      },
      {
        skipPrompts: true,
      }
    )
  })
})

function runCommand(args: string[]) {
  // Require the yargs CLI script
  return parseArgs(args)
}
