import { AnalyzeOptions, ScanOptions } from '@mobb/bugsy/args'
import { mobbAscii, SCANNERS } from '@mobb/bugsy/constants'
import { runAnalysis } from '@mobb/bugsy/features/analysis/index'
import { choseScanner } from '@mobb/bugsy/features/analysis/prompts'
import { validateCheckmarxInstallation } from '@mobb/bugsy/features/analysis/scanners/checkmarx'
import { CliError, sleep } from '@mobb/bugsy/utils'
import chalkAnimation from 'chalk-animation'

export async function analyze(
  { repo, f: scanFile, ref, apiKey, ci, commitHash, srcPath }: AnalyzeOptions,
  { skipPrompts = false }: CommandOptions = {}
) {
  !ci && (await showWelcomeMessage(skipPrompts))

  await runAnalysis(
    {
      repo,
      scanFile,
      ref,
      apiKey,
      ci,
      commitHash,
      srcPath,
    },
    { skipPrompts }
  )
}
export type CommandOptions = {
  skipPrompts?: boolean
}

export async function scan(
  scanOptions: ScanOptions,
  { skipPrompts = false }: CommandOptions = {}
) {
  const { scanner, ci } = scanOptions

  !ci && (await showWelcomeMessage(skipPrompts))
  const selectedScanner = scanner || (await choseScanner())
  if (
    selectedScanner !== SCANNERS.Checkmarx &&
    selectedScanner !== SCANNERS.Snyk
  ) {
    // we can't use includes when using 'as const', weird
    throw new CliError(
      'Vulnerability scanning via Bugsy is available only with Snyk at the moment. Additional scanners will follow soon.'
    )
  }
  selectedScanner === SCANNERS.Checkmarx && validateCheckmarxInstallation()
  if (selectedScanner === SCANNERS.Checkmarx && !scanOptions.cxProjectName) {
    throw new CliError("Project name is needed if you're using checkmarx")
  }

  await runAnalysis(
    { ...scanOptions, scanner: selectedScanner },
    { skipPrompts }
  )
}
async function showWelcomeMessage(skipPrompts = false) {
  console.log(mobbAscii)
  const welcome = chalkAnimation.rainbow('\n\t\t\tWelcome to Bugsy\n')
  skipPrompts ? await sleep(100) : await sleep(2000)
  welcome.stop()
}
