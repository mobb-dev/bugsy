import { IssueType_Enum } from '../../../../generates/client_generates'
import { passwordInComment } from '../passwordInComment'
// Note: we use a guidance from Python on purpose. CSRF is detected in HTML
// and treated as Python by Semgrep, but as JS by Fortify.
import { csrf } from '../python/csrf'
import { hardcodedSecrets } from './hardcodedSecrets'
import { noLimitsOrThrottling } from './noLimitsOrThrottling'
import { ssrf } from './ssrf'

const vulnerabilities = {
  [IssueType_Enum.Ssrf as string]: ssrf,
  [IssueType_Enum.HardcodedSecrets as string]: hardcodedSecrets,
  [IssueType_Enum.PasswordInComment as string]: passwordInComment,
  [IssueType_Enum.NoLimitsOrThrottling as string]: noLimitsOrThrottling,
  [IssueType_Enum.Csrf as string]: csrf,
}

export default vulnerabilities
