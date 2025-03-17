import { IssueType_Enum } from '../../../../generates/client_generates'
import { logForging } from './logForging'
import { missingSslMinversion } from './missingSslMinversion'
import { websocketMissingOriginCheck } from './websocketMissingOriginCheck'

const vulnerabilities = {
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.MissingSslMinversion as string]: missingSslMinversion,
  [IssueType_Enum.WebsocketMissingOriginCheck as string]:
    websocketMissingOriginCheck,
}

export default vulnerabilities
