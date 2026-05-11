import { logInfo } from '../Logger'
import { McpFix } from '../types'

export type InteractiveFixPartition = {
  applicableFixes: McpFix[]
  skippedRuleIds: string[]
}

const isFilterDisabled = (): boolean => {
  const raw = process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER']
  return raw === '1' || raw === 'true'
}

const isInteractiveFix = (fix: McpFix): boolean => {
  if (fix.patchAndQuestions.__typename !== 'FixData') {
    return false
  }
  return fix.patchAndQuestions.questions.length > 0
}

const ruleIdFor = (fix: McpFix): string => fix.safeIssueType ?? 'UNKNOWN'

const countByRule = (ruleIds: string[]): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const ruleId of ruleIds) {
    counts[ruleId] = (counts[ruleId] ?? 0) + 1
  }
  return counts
}

export const partitionInteractiveFixes = (
  fixes: McpFix[]
): InteractiveFixPartition => {
  if (isFilterDisabled()) {
    return { applicableFixes: fixes, skippedRuleIds: [] }
  }

  const applicableFixes: McpFix[] = []
  const skippedRuleIds: string[] = []
  for (const fix of fixes) {
    if (isInteractiveFix(fix)) {
      skippedRuleIds.push(ruleIdFor(fix))
    } else {
      applicableFixes.push(fix)
    }
  }

  if (skippedRuleIds.length > 0) {
    logInfo('[InteractiveFixFilter] Skipped interactive fixes', {
      totalFixes: fixes.length,
      skippedCount: skippedRuleIds.length,
      skippedByRule: countByRule(skippedRuleIds),
    })
  }

  return { applicableFixes, skippedRuleIds }
}
