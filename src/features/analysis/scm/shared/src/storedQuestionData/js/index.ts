// Note: we use a guidance from Python on purpose. CSRF is detected in HTML
// and treated as Python by Semgrep, but as JS by Fortify.
import { csrf } from '../python/csrf'
import { commandInjection } from './commandInjection'
import { graphqlDepthLimit } from './graphqlDepthLimit'
import { hardcodedDomainInHtml } from './hardcodedDomainInHtml'
import { hardcodedSecrets } from './hardcodedSecrets'
import { iframeWithoutSandbox } from './iframeWithoutSandbox'
import { incompleteUrlSanitization } from './incompleteUrlSanitization'
import { insecureRandomness } from './insecureRandomness'
import { logForging } from './logForging'
import { cspHeaderValue } from './missingCSPHeader'
import { headerMaxAge } from './missingHSTSHeader'
import { xFrameOptionsValue } from './missingXFrameOptions'
import { noLimitsOrThrottling } from './noLimitsOrThrottling'
import { openRedirect } from './openRedirect'
import { pt } from './pt'
import { ssrf } from './ssrf'
import { sysLeak } from './sysLeak'
import { sysLeakExternal } from './sysLeakExternal'
import { typeConfusion } from './typeConfusion'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'
import { xss } from './xss'

const vulnerabilities = {
  ['CMDi']: commandInjection,
  ['GRAPHQL_DEPTH_LIMIT']: graphqlDepthLimit,
  ['INSECURE_RANDOMNESS']: insecureRandomness,
  ['SSRF']: ssrf,
  ['TYPE_CONFUSION']: typeConfusion,
  ['INCOMPLETE_URL_SANITIZATION']: incompleteUrlSanitization,
  ['LOG_FORGING']: logForging,
  ['XSS']: xss,
  ['OPEN_REDIRECT']: openRedirect,
  ['SYSTEM_INFORMATION_LEAK']: sysLeak,
  ['SYSTEM_INFORMATION_LEAK_EXTERNAL']: sysLeakExternal,
  ['IFRAME_WITHOUT_SANDBOX']: iframeWithoutSandbox,
  ['PT']: pt,
  ['HARDCODED_SECRETS']: hardcodedSecrets,
  ['MISSING_HSTS_HEADER']: headerMaxAge,
  ['UNCHECKED_LOOP_CONDITION']: uncheckedLoopCondition,
  ['NO_LIMITS_OR_THROTTLING']: noLimitsOrThrottling,
  ['MISSING_CSP_HEADER']: cspHeaderValue,
  ['MISSING_X_FRAME_OPTIONS']: xFrameOptionsValue,
  ['HARDCODED_DOMAIN_IN_HTML']: hardcodedDomainInHtml,
  ['CSRF']: csrf,
}

export default vulnerabilities
