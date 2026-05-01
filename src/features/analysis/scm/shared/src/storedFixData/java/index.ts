import { IssueType_Enum } from '../../../../generates/client_generates'
import { passwordInComment } from '../passwordInComment'
import { j2eeGetConnection } from './j2eeGetConnection'
import { sqlInjection } from './sqlInjection'
import { systemInformationLeak } from './systemInformationLeak'

const vulnerabilities = {
  [IssueType_Enum.PasswordInComment as string]: passwordInComment,
  [IssueType_Enum.J2EeGetConnection as string]: j2eeGetConnection,
  [IssueType_Enum.SqlInjection as string]: sqlInjection,
  [IssueType_Enum.SystemInformationLeak as string]: systemInformationLeak,
}

export default vulnerabilities
