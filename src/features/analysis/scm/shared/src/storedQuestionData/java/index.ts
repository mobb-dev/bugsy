import { commandInjection } from './commandInjection'
import { confusingNaming } from './confusingNaming'
import { duplicatedStrings } from './duplicatedStrings'
import { erroneousStringCompare } from './erroneousStringCompare'
import { errorConditionWithoutAction } from './errorConditionWithoutAction'
import { httpOnlyCookie } from './httpOnlyCookie'
import { insecureCookie } from './insecureCookie'
import { j2eeGetConnection } from './j2eeGetConnection'
import { leftoverDebugCode } from './leftoverDebugCode'
import { localeDependentComparison } from './localeDependentComparison'
import { logForging } from './logForging'
import { missingCheckAgainstNull } from './missingCheckAgainstNull'
import { openRedirect } from './openRedirect'
import { overlyBroadCatch } from './overlyBroadCatch'
import { privacyViolation } from './privacyViolation'
import { pt } from './pt'
import { relativePathCommand } from './relativePathCommand'
import { sqlInjection } from './sqlInjection'
import { ssrf } from './ssrf'
import { sysLeak } from './sysLeak'
import { trustBoundaryViolation } from './trustBoundaryViolation'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'
import { unsafeReflection } from './unsafeReflection'
import { useOfSystemOutputStream } from './useOfSystemOutputStream'
import { xss } from './xss'
import { xxe } from './xxe'

const vulnerabilities = {
  ['SQL_Injection']: sqlInjection,
  ['CMDi_relative_path_command']: relativePathCommand,
  ['CMDi']: commandInjection,
  ['CONFUSING_NAMING']: confusingNaming,
  ['ERROR_CONDTION_WITHOUT_ACTION']: errorConditionWithoutAction,
  ['XXE']: xxe,
  ['XSS']: xss,
  ['PRIVACY_VIOLATION']: privacyViolation,
  ['PT']: pt,
  ['SSRF']: ssrf,
  ['LOG_FORGING']: logForging,
  ['LOCALE_DEPENDENT_COMPARISON']: localeDependentComparison,
  ['MISSING_CHECK_AGAINST_NULL']: missingCheckAgainstNull,
  ['OPEN_REDIRECT']: openRedirect,
  ['OVERLY_BROAD_CATCH']: overlyBroadCatch,
  ['SYSTEM_INFORMATION_LEAK']: sysLeak,
  ['USE_OF_SYSTEM_OUTPUT_STREAM']: useOfSystemOutputStream,
  ['HTTP_ONLY_COOKIE']: httpOnlyCookie,
  ['UNCHECKED_LOOP_CONDITION']: uncheckedLoopCondition,
  ['INSECURE_COOKIE']: insecureCookie,
  ['TRUST_BOUNDARY_VIOLATION']: trustBoundaryViolation,
  ['UNSAFE_REFLECTION']: unsafeReflection,
  ['J2EE_GET_CONNECTION']: j2eeGetConnection,
  ['LEFTOVER_DEBUG_CODE']: leftoverDebugCode,
  ['ERRONEOUS_STRING_COMPARE']: erroneousStringCompare,
  ['DUPLICATED_STRINGS']: duplicatedStrings,
}

export default vulnerabilities
