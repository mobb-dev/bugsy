import { IssueType_Enum } from '../../../../generates/client_generates'
import { logForging } from './logForging'
import { missingSslMinversion } from './missingSslMinversion'

const vulnerabilities = {
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.MissingSslMinversion as string]: missingSslMinversion,
}

export default vulnerabilities
