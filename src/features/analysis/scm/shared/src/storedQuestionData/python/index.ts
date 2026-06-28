import { csrf } from './csrf'
import { duplicatedStrings } from './duplicatedStrings'
import { logForging } from './logForging'
import { missingEncoding } from './missingEncoding'
import { openRedirect } from './openRedirect'
import { ssrf } from './ssrf'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'

const vulnerabilities = {
  ['CSRF']: csrf,
  ['LOG_FORGING']: logForging,
  ['OPEN_REDIRECT']: openRedirect,
  ['UNCHECKED_LOOP_CONDITION']: uncheckedLoopCondition,
  ['DUPLICATED_STRINGS']: duplicatedStrings,
  ['MISSING_ENCODING_FILE_OPEN']: missingEncoding,
  ['SSRF']: ssrf,
}

export default vulnerabilities
