import { IssueType_Enum } from '../../../../generates/client_generates'
import { csrf } from './csrf'
import { logForging } from './logForging'
import { openRedirect } from './openRedirect'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'

const vulnerabilities = {
  [IssueType_Enum.Csrf as string]: csrf,
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.OpenRedirect as string]: openRedirect,
  [IssueType_Enum.UncheckedLoopCondition as string]: uncheckedLoopCondition,
}

export default vulnerabilities
