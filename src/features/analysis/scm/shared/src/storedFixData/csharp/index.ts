import { IssueType_Enum } from '../../../../generates/client_generates'
import { passwordInComment } from '../passwordInComment'
import { missingAntiForgeryValidation } from './missingAntiForgeryValidation'

const vulnerabilities = {
  [IssueType_Enum.MissingAntiforgeryValidation as string]:
    missingAntiForgeryValidation,
  [IssueType_Enum.PasswordInComment as string]: passwordInComment,
}

export default vulnerabilities
