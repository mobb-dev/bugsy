import { IssueType_Enum } from '../../../../generates/client_generates'
import { logForging } from './logForging'

const vulnerabilities = {
  [IssueType_Enum.LogForging as string]: logForging,
}

export default vulnerabilities
