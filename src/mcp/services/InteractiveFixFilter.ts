import { logInfo } from '../Logger'
import { McpFix } from '../types'

export type InteractiveFixPartition = {
  applicableFixes: McpFix[]
  interactiveFixes: McpFix[]
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

// Opt-out kill switch. Default false = MOBB-3604 interactive routing stays on.
// Truthy ('1'/'true', case-insensitive) drops interactive fixes from the response.
const MOBB_MCP_DISABLE_INTERACTIVE_FILTER_DEFAULT = false

const isInteractiveRoutingDisabled = (): boolean => {
  const raw = process.env['MOBB_MCP_DISABLE_INTERACTIVE_FILTER']
  if (!raw) return MOBB_MCP_DISABLE_INTERACTIVE_FILTER_DEFAULT
  const normalized = raw.toLowerCase()
  return normalized === '1' || normalized === 'true'
}

export const partitionInteractiveFixes = (
  fixes: McpFix[]
): InteractiveFixPartition => {
  const disabled = isInteractiveRoutingDisabled()
  const applicableFixes: McpFix[] = []
  const interactiveFixes: McpFix[] = []
  const droppedInteractive: McpFix[] = []
  for (const fix of fixes) {
    if (isInteractiveFix(fix)) {
      if (disabled) {
        droppedInteractive.push(fix)
      } else {
        interactiveFixes.push(fix)
      }
    } else {
      applicableFixes.push(fix)
    }
  }

  if (disabled && droppedInteractive.length > 0) {
    logInfo(
      '[InteractiveFixFilter] Dropping interactive fixes (MOBB_MCP_DISABLE_INTERACTIVE_FILTER=true)',
      {
        totalFixes: fixes.length,
        droppedCount: droppedInteractive.length,
        droppedByRule: countByRule(droppedInteractive.map(ruleIdFor)),
      }
    )
  } else if (interactiveFixes.length > 0) {
    logInfo('[InteractiveFixFilter] Routing interactive fixes to LLM', {
      totalFixes: fixes.length,
      interactiveCount: interactiveFixes.length,
      interactiveByRule: countByRule(interactiveFixes.map(ruleIdFor)),
    })
  }

  return { applicableFixes, interactiveFixes }
}
