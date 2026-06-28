import { httpOnlyCookie } from './httpOnlyCookie'
import { insecureBinderConfiguration } from './insecureBinderConfiguration'
import { insecureCookie } from './insecureCookie'
import { insecureRandomness } from './insecureRandomness'
import { insufficientLogging } from './insufficientLogging'
import { logForging } from './logForging'
import { overlyBroadCatch } from './overlyBroadCatch'
import { pt } from './pt'
import { regexMissingTimeout } from './regexMissingTimeout'
import { requestParametersBoundViaInput } from './requestParametersBoundViaInput'
import { sqlInjection } from './sqlInjection'
import { ssrf } from './ssrf'
import { sysLeak } from './sysLeak'
import { trustBoundaryViolation } from './trustBoundaryViolation'
import { useOfSystemOutputStream } from './useOfSystemOutputStream'
import { valueShadowing } from './valueShadowing'
import { wcfMisconfigurationThrottlingNotEnabled } from './wcfMisconfigurationThrottlingNotEnabled'
import { xss } from './xss'
import { xxe } from './xxe'

const vulnerabilities = {
  ['LOG_FORGING']: logForging,
  ['SSRF']: ssrf,
  ['XXE']: xxe,
  ['XSS']: xss,
  ['USE_OF_SYSTEM_OUTPUT_STREAM']: useOfSystemOutputStream,
  ['SYSTEM_INFORMATION_LEAK']: sysLeak,
  ['OVERLY_BROAD_CATCH']: overlyBroadCatch,
  ['TRUST_BOUNDARY_VIOLATION']: trustBoundaryViolation,
  ['PT']: pt,
  ['REGEX_MISSING_TIMEOUT']: regexMissingTimeout,
  ['HTTP_ONLY_COOKIE']: httpOnlyCookie,
  ['INSECURE_COOKIE']: insecureCookie,
  ['WCF_MISCONFIGURATION_THROTTLING_NOT_ENABLED']:
    wcfMisconfigurationThrottlingNotEnabled,
  ['INSECURE_BINDER_CONFIGURATION']: insecureBinderConfiguration,
  ['VALUE_SHADOWING']: valueShadowing,
  ['INSECURE_RANDOMNESS']: insecureRandomness,
  ['INSUFFICIENT_LOGGING']: insufficientLogging,
  ['SQL_Injection']: sqlInjection,
  ['REQUEST_PARAMETERS_BOUND_VIA_INPUT']: requestParametersBoundViaInput,
}

export default vulnerabilities
