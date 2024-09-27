import { IssueType_Enum } from '../../../../generates/client_generates'
import { unboundedOccurrences } from './unboundedOccurrences'

const vulnerabilities = {
  [IssueType_Enum.WeakXmlSchemaUnboundedOccurrences as string]:
    unboundedOccurrences,
}

export default vulnerabilities
