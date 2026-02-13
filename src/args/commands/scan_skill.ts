import chalk from 'chalk'
import type * as Yargs from 'yargs'

import { scanSkill } from '../../commands'
import { apiKeyOption, ciOption } from '../options'
import type { BaseScanSkillOptions, ScanSkillOptions } from '../types'

export function scanSkillBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<BaseScanSkillOptions> {
  return args
    .option('url', {
      demandOption: true,
      type: 'string',
      describe: chalk.bold(
        'URL or local directory of the skill to scan (GitHub repo, ZIP archive, raw SKILL.md, or folder containing SKILL.md)'
      ),
    })
    .option('api-key', apiKeyOption)
    .option('ci', ciOption)
    .example(
      'npx mobbdev@latest scan-skill --url https://github.com/user/my-skill',
      'Scan an OpenClaw/ClawHub skill for security threats'
    )
    .example(
      'npx mobbdev@latest scan-skill --url ./my-skill-folder',
      'Scan a local skill directory that contains SKILL.md'
    )
    .help()
}

export async function scanSkillHandler(args: ScanSkillOptions) {
  await scanSkill(args)
}
