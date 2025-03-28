import { IssueType_Enum } from '../../../../generates/client_generates'
import { autoEscapeFalse } from './autoEscapeFalse'
import { csrf } from './csrf'

const vulnerabilities = {
  [IssueType_Enum.AutoEscapeFalse as string]: autoEscapeFalse,
  [IssueType_Enum.Csrf as string]: csrf,
}

export default vulnerabilities
