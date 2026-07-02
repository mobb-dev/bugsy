import { passwordInComment } from '../passwordInComment'
import { insecureDeserialization } from './insecureDeserialization'
import { j2eeGetConnection } from './j2eeGetConnection'
import { systemInformationLeak } from './systemInformationLeak'

const vulnerabilities = {
  ['PASSWORD_IN_COMMENT']: passwordInComment,
  ['INSECURE_DESERIALIZATION']: insecureDeserialization,
  ['J2EE_GET_CONNECTION']: j2eeGetConnection,
  ['SYSTEM_INFORMATION_LEAK']: systemInformationLeak,
}

export default vulnerabilities
