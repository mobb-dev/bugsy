import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Configstore from 'configstore'
import open from 'open'
import tmp from 'tmp'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'

import { PROJECT_PAGE_REGEX } from '../src/constants'
import * as analysisExports from '../src/features/analysis'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
)
vi.mock('../src/utils/dirname.ts')
const config = new Configstore(packageJson.name)

let tmpObj

afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})

beforeAll(() => {
  tmpObj = tmp.dirSync({
    unsafeCleanup: true,
  })
})

afterAll(() => {
  tmpObj.removeCallback()
})

vi.mock('open', () => ({
  default: vi.fn(),
}))
vi.mock('../src/features/analysis/snyk', () => ({
  getSnykReport: vi.fn().mockImplementation(async (reportPath) => {
    fs.copyFileSync(path.join(__dirname, 'report.json'), reportPath)
    return true
  }),
}))

it('Full analyze flow', async () => {
  config.set('token', process.env.TOKEN)
  const runAnalysisSpy = vi.spyOn(analysisExports, 'runAnalysis')

  await analysisExports.runAnalysis(
    {
      repo: 'https://github.com/mobb-dev/simple-vulnerable-java-project',
      ci: false,
    },
    { skipPrompts: true }
  )

  expect(runAnalysisSpy).toHaveBeenCalled()
  expect(open).toHaveBeenCalledTimes(1)
  expect(open).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
}, 30000)

it('Direct repo upload', async () => {
  config.set('token', process.env.TOKEN)

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
  expect(open).toHaveBeenCalledTimes(1)
  expect(open).toBeCalledWith(expect.stringMatching(PROJECT_PAGE_REGEX))
})
