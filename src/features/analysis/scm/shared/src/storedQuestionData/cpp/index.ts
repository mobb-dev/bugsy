import { IssueType_Enum } from '../../../../generates/client_generates'
import { commandInjection } from './commandInjection'
import { pathManipulation } from './pathManipulation'

const vulnerabilities = {
  [IssueType_Enum.CmDi as string]: commandInjection,
  [IssueType_Enum.Pt as string]: pathManipulation,
}

export default vulnerabilities
