import { passwordInComment } from '../passwordInComment'
// Note: we use a guidance from Python on purpose. CSRF is detected in HTML
// and treated as Python by Semgrep, but as JS by Fortify.
import { csrf } from '../python/csrf'
import { hardcodedSecrets } from './hardcodedSecrets'
import { noLimitsOrThrottling } from './noLimitsOrThrottling'
import { ssrf } from './ssrf'

const vulnerabilities = {
  ['SSRF']: ssrf,
  ['HARDCODED_SECRETS']: hardcodedSecrets,
  ['PASSWORD_IN_COMMENT']: passwordInComment,
  ['NO_LIMITS_OR_THROTTLING']: noLimitsOrThrottling,
  ['CSRF']: csrf,
}

export default vulnerabilities
