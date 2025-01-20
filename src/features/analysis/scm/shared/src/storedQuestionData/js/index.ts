import { IssueType_Enum } from '../../../../generates/client_generates'
// Note: we use a guidance from Python on purpose. CSRF is detected in HTML
// and treated as Python by Semgrep, but as JS by Fortify.
import { csrf } from '../python/csrf'
import { commandInjection } from './commandInjection'
import { graphqlDepthLimit } from './graphqlDepthLimit'
import { hardcodedDomainInHtml } from './hardcodedDomainInHtml'
import { hardcodedSecrets } from './hardcodedSecrets'
import { iframeWithoutSandbox } from './iframeWithoutSandbox'
import { incompleteUrlSanitization } from './incompleteUrlSanitization'
import { insecureRandomness } from './insecureRandomness'
import { logForging } from './logForging'
import { cspHeaderValue } from './missingCSPHeader'
import { headerMaxAge } from './missingHSTSHeader'
import { noLimitsOrThrottling } from './noLimitsOrThrottling'
import { openRedirect } from './openRedirect'
import { pt } from './pt'
import { ssrf } from './ssrf'
import { sysLeak } from './sysLeak'
import { sysLeakExternal } from './sysLeakExternal'
import { typeConfusion } from './typeConfusion'
import { uncheckedLoopCondition } from './uncheckedLoopCondition'
import { xss } from './xss'

const vulnerabilities = {
  [IssueType_Enum.CmDi as string]: commandInjection,
  [IssueType_Enum.GraphqlDepthLimit as string]: graphqlDepthLimit,
  [IssueType_Enum.InsecureRandomness as string]: insecureRandomness,
  [IssueType_Enum.Ssrf as string]: ssrf,
  [IssueType_Enum.TypeConfusion as string]: typeConfusion,
  [IssueType_Enum.IncompleteUrlSanitization as string]:
    incompleteUrlSanitization,
  [IssueType_Enum.LogForging as string]: logForging,
  [IssueType_Enum.Xss as string]: xss,
  [IssueType_Enum.OpenRedirect as string]: openRedirect,
  [IssueType_Enum.SystemInformationLeak as string]: sysLeak,
  [IssueType_Enum.SystemInformationLeakExternal as string]: sysLeakExternal,
  [IssueType_Enum.IframeWithoutSandbox as string]: iframeWithoutSandbox,
  [IssueType_Enum.Pt as string]: pt,
  [IssueType_Enum.HardcodedSecrets as string]: hardcodedSecrets,
  [IssueType_Enum.MissingHstsHeader as string]: headerMaxAge,
  [IssueType_Enum.UncheckedLoopCondition as string]: uncheckedLoopCondition,
  [IssueType_Enum.NoLimitsOrThrottling as string]: noLimitsOrThrottling,
  [IssueType_Enum.MissingCspHeader as string]: cspHeaderValue,
  [IssueType_Enum.HardcodedDomainInHtml as string]: hardcodedDomainInHtml,
  [IssueType_Enum.Csrf as string]: csrf,
}

export default vulnerabilities
