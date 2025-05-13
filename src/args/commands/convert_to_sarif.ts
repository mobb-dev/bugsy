import fs from 'node:fs'

import { convertToSarif } from '@mobb/bugsy/commands/convert_to_sarif'
import { CliError } from '@mobb/bugsy/utils'
import type * as Yargs from 'yargs'

import {
  convertToSarifCodePathPatternsOption,
  convertToSarifInputFileFormatOption,
  convertToSarifInputFilePathOption,
  convertToSarifOutputFilePathOption,
} from '../options'
import { BaseConvertToSarifOptions, ConvertToSarifOptions } from '../types'

export function convertToSarifBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<BaseConvertToSarifOptions> {
  return args
    .option('input-file-path', convertToSarifInputFilePathOption)
    .option('input-file-format', convertToSarifInputFileFormatOption)
    .option('output-file-path', convertToSarifOutputFilePathOption)
    .option('code-path-patterns', convertToSarifCodePathPatternsOption)
    .example(
      'npx mobbdev@latest convert-to-sarif --input-file-path /path/to/vuln-report.fpr --input-file-format FortifyFPR --output-file-path /path/to/vuln-report.sarif --code-path-patterns **/*.ts --code-path-patterns **/*.js',
      'convert an existing SAST report to SARIF format'
    )
    .help()
    .demandOption(['input-file-path', 'input-file-format', 'output-file-path'])
}

export async function validateConvertToSarifOptions(
  args: ConvertToSarifOptions
) {
  if (!fs.existsSync(args.inputFilePath)) {
    throw new CliError(
      '\nError: --input-file-path flag should point to an existing file'
    )
  }
}

export async function convertToSarifHandler(args: ConvertToSarifOptions) {
  await validateConvertToSarifOptions(args)
  await convertToSarif(args)
}
