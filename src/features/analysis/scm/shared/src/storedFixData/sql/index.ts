import { IssueType_Enum } from '../../../../generates/client_generates'
import { defaultRightsInObjDefinition } from './defaultRightsInObjDefinition'

const vulnerabilities = {
  [IssueType_Enum.DefaultRightsInObjDefinition as string]:
    defaultRightsInObjDefinition,
}

export default vulnerabilities
