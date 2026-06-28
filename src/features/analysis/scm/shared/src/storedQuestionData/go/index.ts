import { logForging } from './logForging'
import { missingSslMinversion } from './missingSslMinversion'
import { websocketMissingOriginCheck } from './websocketMissingOriginCheck'

const vulnerabilities = {
  ['LOG_FORGING']: logForging,
  ['MISSING_SSL_MINVERSION']: missingSslMinversion,
  ['WEBSOCKET_MISSING_ORIGIN_CHECK']: websocketMissingOriginCheck,
}

export default vulnerabilities
