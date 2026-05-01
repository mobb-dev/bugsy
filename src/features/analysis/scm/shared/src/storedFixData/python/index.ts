import { IssueType_Enum } from '../../../../generates/client_generates'
import { autoEscapeFalse } from './autoEscapeFalse'
import { csrf } from './csrf'
import { improperCertificateValidation } from './improperCertificateValidation'

const vulnerabilities = {
  [IssueType_Enum.AutoEscapeFalse as string]: autoEscapeFalse,
  [IssueType_Enum.Csrf as string]: csrf,
  [IssueType_Enum.ImproperCertificateValidation as string]:
    improperCertificateValidation,
}

export default vulnerabilities
