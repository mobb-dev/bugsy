import { IssueType_Enum } from '../../../../generates/client_generates'
import { csrf } from './csrf'
import { logForging } from './logForging'
import { openRedirect } from './openRedirect'

const vulnerabilities = {
  [IssueType_Enum.Csrf as string]: csrf,
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.LogForging as string]: openRedirect,
}

export default vulnerabilities
