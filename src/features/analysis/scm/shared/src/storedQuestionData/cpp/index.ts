import { IssueType_Enum } from '../../../../generates/client_generates'
import { commandInjection } from './commandInjection'

const vulnerabilities = {
  [IssueType_Enum.CmDi as string]: commandInjection,
}

export default vulnerabilities
