import { IssueType_Enum } from '../../../../generates/client_generates'
import { passwordInComment } from '../passwordInComment'
import { hardcodedSecrets } from './hardcodedSecrets'
import { noLimitsOrThrottling } from './noLimitsOrThrottling'
import { ssrf } from './ssrf'

const vulnerabilities = {
  [IssueType_Enum.Ssrf as string]: ssrf,
  [IssueType_Enum.HardcodedSecrets as string]: hardcodedSecrets,
  [IssueType_Enum.PasswordInComment as string]: passwordInComment,
  [IssueType_Enum.NoLimitsOrThrottling as string]: noLimitsOrThrottling,
}

export default vulnerabilities
