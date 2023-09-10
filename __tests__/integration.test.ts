import fs from 'node:fs'
import path from 'node:path'

import open from 'open'
import { expect, it, vi } from 'vitest'

import { API_URL, PROJECT_PAGE_REGEX } from '../src/constants'
import * as analysisExports from '../src/features/analysis'
import {
  CREATE_COMMUNITY_USER,
  PERFORM_CLI_LOGIN,
} from '../src/features/analysis/graphql/mutations'

vi.mock('../src/utils/dirname.ts')

vi.mock('open', () => ({
  default: vi.fn().mockImplementation(async (url: string) => {
    const match = url.match(/\/cli-login\/(.*?)\?.*$/)

    if (match && match.length == 2) {
      const loginId = match[1]

      const createUserRes = await fetch(API_URL, {
        headers: {
          authorization: `Bearer ${process.env.TOKEN}`,
        },
        body: JSON.stringify({
          query: CREATE_COMMUNITY_USER,
        }),
        method: 'POST',
      })
      expect(createUserRes.status).toStrictEqual(200)

      // Emulate "Authenticate" button click in the Web UI.
      const performLoginRes = await fetch(API_URL, {
        headers: {
          authorization: `Bearer ${process.env.TOKEN}`,
        },
        body: JSON.stringify({
          query: PERFORM_CLI_LOGIN,
          variables: {
            loginId,
          },
        }),
        method: 'POST',
      })
      expect(performLoginRes.status).toStrictEqual(200)
    }
  }),
}))

vi.mock('configstore', () => {
  const Configstore = vi.fn()

  Configstore.prototype.get = vi.fn()
  Configstore.prototype.set = vi.fn()
  return { default: Configstore }
})

vi.mock('../src/features/analysis/snyk', () => ({
  getSnykReport: vi.fn().mockImplementation(async (reportPath) => {
    fs.copyFileSync(path.join(__dirname, 'report.json'), reportPath)
    return true
  }),
}))

it('Full analyze flow', async () => {
  open.mockClear()
  const runAnalysisSpy = vi.spyOn(analysisExports, 'runAnalysis')

  await analysisExports.runAnalysis(
    {
      repo: 'https://github.com/mobb-dev/simple-vulnerable-java-project',
      ci: false,
    },
    { skipPrompts: true }
  )

  expect(runAnalysisSpy).toHaveBeenCalled()
  expect(open).toHaveBeenCalledTimes(2)
  expect(open).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
}, 30000)

it('Direct repo upload', async () => {
  open.mockClear()
  await analysisExports.runAnalysis(
    {
      repo: 'https://bitbucket.com/a/b',
      ref: 'test',
      commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
      scanFile: path.join(__dirname, 'assets/simple/codeql_report.json'),
      srcPath: path.join(__dirname, 'assets/simple'),
      ci: false,
    },
    { skipPrompts: true }
  )
  expect(open).toHaveBeenCalledTimes(2)
  expect(open).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
})
