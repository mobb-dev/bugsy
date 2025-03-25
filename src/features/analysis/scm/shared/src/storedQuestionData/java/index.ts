import { IssueType_Enum } from '../../../../generates/client_generates'
import { commandInjection } from './commandInjection'
import { confusingNaming } from './confusingNaming'
import { duplicatedStrings } from './duplicatedStrings'
import { erroneousStringCompare } from './erroneousStringCompare'
import { errorConditionWithoutAction } from './errorConditionWithoutAction'
import { httpOnlyCookie } from './httpOnlyCookie'
import { insecureCookie } from './insecureCookie'
import { leftoverDebugCode } from './leftoverDebugCode'
import { localeDependentComparison } from './localeDependentComparison'
import { logForging } from './logForging'
import { missingCheckAgainstNull } from './missingCheckAgainstNull'
import { overlyBroadCatch } from './overlyBroadCatch'
import { privacyViolation } from './privacyViolation'
import { pt } from './pt'
import { relativePathCommand } from './relativePathCommand'
import { sqlInjection } from './sqlInjection'
import { ssrf } from './ssrf'
import { sysLeak } from './sysLeak'
import { trustBoundaryViolation } from './trustBoundaryViolation'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'
import { useOfSystemOutputStream } from './useOfSystemOutputStream'
import { xss } from './xss'
import { xxe } from './xxe'

const vulnerabilities = {
  [IssueType_Enum.SqlInjection as string]: sqlInjection,
  [IssueType_Enum.CmDiRelativePathCommand as string]: relativePathCommand,
  [IssueType_Enum.CmDi as string]: commandInjection,
  [IssueType_Enum.ConfusingNaming as string]: confusingNaming,
  [IssueType_Enum.ErrorCondtionWithoutAction]: errorConditionWithoutAction,
  [IssueType_Enum.Xxe as string]: xxe,
  [IssueType_Enum.Xss as string]: xss,
  [IssueType_Enum.PrivacyViolation as string]: privacyViolation,
  [IssueType_Enum.Pt as string]: pt,
  [IssueType_Enum.Ssrf as string]: ssrf,
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.LocaleDependentComparison as string]:
    localeDependentComparison,
  [IssueType_Enum.MissingCheckAgainstNull as string]: missingCheckAgainstNull,
  [IssueType_Enum.OverlyBroadCatch as string]: overlyBroadCatch,
  [IssueType_Enum.SystemInformationLeak as string]: sysLeak,
  [IssueType_Enum.UseOfSystemOutputStream as string]: useOfSystemOutputStream,
  [IssueType_Enum.HttpOnlyCookie as string]: httpOnlyCookie,
  [IssueType_Enum.UncheckedLoopCondition as string]: uncheckedLoopCondition,
  [IssueType_Enum.InsecureCookie as string]: insecureCookie,
  [IssueType_Enum.TrustBoundaryViolation as string]: trustBoundaryViolation,
  [IssueType_Enum.LeftoverDebugCode as string]: leftoverDebugCode,
  [IssueType_Enum.ErroneousStringCompare as string]: erroneousStringCompare,
  [IssueType_Enum.DuplicatedStrings as string]: duplicatedStrings,
}

export default vulnerabilities
