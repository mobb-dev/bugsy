import { IssueType_Enum } from '../../../../generates/client_generates'
import { autoEscapeFalse } from './autoEscapeFalse'

const vulnerabilities = {
  [IssueType_Enum.AutoEscapeFalse as string]: autoEscapeFalse,
}

export default vulnerabilities
