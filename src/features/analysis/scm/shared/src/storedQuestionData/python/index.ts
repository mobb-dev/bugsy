import { IssueType_Enum } from '../../../../generates/client_generates'
import { csrf } from './csrf'
import { duplicatedStrings } from './duplicatedStrings'
import { logForging } from './logForging'
import { missingEncoding } from './missingEncoding'
import { openRedirect } from './openRedirect'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'

const vulnerabilities = {
  [IssueType_Enum.Csrf as string]: csrf,
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.OpenRedirect as string]: openRedirect,
  [IssueType_Enum.UncheckedLoopCondition as string]: uncheckedLoopCondition,
  [IssueType_Enum.DuplicatedStrings as string]: duplicatedStrings,
  [IssueType_Enum.MissingEncodingFileOpen as string]: missingEncoding,
}

export default vulnerabilities
