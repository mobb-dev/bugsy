import { IssueType_Enum } from '../../../../generates/client_generates'
import { httpOnlyCookie } from './httpOnlyCookie'
import { insecureBinderConfiguration } from './insecureBinderConfiguration'
import { insecureCookie } from './insecureCookie'
import { insecureRandomness } from './insecureRandomness'
import { insufficientLogging } from './insufficientLogging'
import { logForging } from './logForging'
import { overlyBroadCatch } from './overlyBroadCatch'
import { pt } from './pt'
import { ssrf } from './ssrf'
import { sysLeak } from './sysLeak'
import { trustBoundaryViolation } from './trustBoundaryViolation'
import { useOfSystemOutputStream } from './useOfSystemOutputStream'
import { valueShadowing } from './valueShadowing'
import { wcfMisconfigurationThrottlingNotEnabled } from './wcfMisconfigurationThrottlingNotEnabled'
import { xss } from './xss'
import { xxe } from './xxe'

const vulnerabilities = {
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.Ssrf as string]: ssrf,
  [IssueType_Enum.Xxe as string]: xxe,
  [IssueType_Enum.Xss as string]: xss,
  [IssueType_Enum.UseOfSystemOutputStream as string]: useOfSystemOutputStream,
  [IssueType_Enum.SystemInformationLeak as string]: sysLeak,
  [IssueType_Enum.OverlyBroadCatch as string]: overlyBroadCatch,
  [IssueType_Enum.TrustBoundaryViolation as string]: trustBoundaryViolation,
  [IssueType_Enum.Pt as string]: pt,
  [IssueType_Enum.HttpOnlyCookie as string]: httpOnlyCookie,
  [IssueType_Enum.InsecureCookie as string]: insecureCookie,
  [IssueType_Enum.WcfMisconfigurationThrottlingNotEnabled]:
    wcfMisconfigurationThrottlingNotEnabled,
  [IssueType_Enum.InsecureBinderConfiguration as string]:
    insecureBinderConfiguration,
  [IssueType_Enum.ValueShadowing as string]: valueShadowing,
  [IssueType_Enum.InsecureRandomness as string]: insecureRandomness,
  [IssueType_Enum.InsufficientLogging as string]: insufficientLogging,
}

export default vulnerabilities
