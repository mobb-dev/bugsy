import { IssueType_Enum } from '../../../../generates/client_generates'
import { passwordInComment } from '../passwordInComment'

const vulnerabilities = {
  [IssueType_Enum.PasswordInComment as string]: passwordInComment,
}

export default vulnerabilities
