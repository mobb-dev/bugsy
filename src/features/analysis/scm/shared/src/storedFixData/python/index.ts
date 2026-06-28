import { autoEscapeFalse } from './autoEscapeFalse'
import { csrf } from './csrf'
import { improperCertificateValidation } from './improperCertificateValidation'

const vulnerabilities = {
  ['AUTO_ESCAPE_FALSE']: autoEscapeFalse,
  ['CSRF']: csrf,
  ['IMPROPER_CERTIFICATE_VALIDATION']: improperCertificateValidation,
}

export default vulnerabilities
