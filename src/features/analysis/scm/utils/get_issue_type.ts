import { IssueType_Enum } from '../types'

export const getIssueType = (issueType: string | null): string => {
  switch (issueType) {
    case IssueType_Enum.SqlInjection:
      return 'SQL Injection'
    case IssueType_Enum.CmDiRelativePathCommand:
      return 'Relative Path Command Injection'
    case IssueType_Enum.CmDi:
      return 'Command Injection'
    case IssueType_Enum.Xxe:
      return 'XXE'
    case IssueType_Enum.Xss:
      return 'XSS'
    case IssueType_Enum.Pt:
      return 'Path Traversal'
    case IssueType_Enum.ZipSlip:
      return 'Zip Slip'
    case IssueType_Enum.InsecureRandomness:
      return 'Insecure Randomness'
    case IssueType_Enum.Ssrf:
      return 'Server Side Request Forgery'
    case IssueType_Enum.TypeConfusion:
      return 'Type Confusion'
    case IssueType_Enum.RegexInjection:
      return 'Regular Expression Injection'
    case IssueType_Enum.IncompleteUrlSanitization:
      return 'Incomplete URL Sanitization'
    case IssueType_Enum.LocaleDependentComparison:
      return 'Locale Dependent Comparison'
    case IssueType_Enum.LogForging:
      return 'Log Forging'
    case IssueType_Enum.MissingCheckAgainstNull:
      return 'Missing Check against Null'
    case IssueType_Enum.PasswordInComment:
      return 'Password in Comment'
    case IssueType_Enum.OverlyBroadCatch:
      return 'Poor Error Handling: Overly Broad Catch'
    case IssueType_Enum.UseOfSystemOutputStream:
      return 'Use of System.out/System.err'
    case IssueType_Enum.DangerousFunctionOverflow:
      return 'Use of dangerous function'
    case IssueType_Enum.DosStringBuilder:
      return 'Denial of Service: StringBuilder'
    case IssueType_Enum.OpenRedirect:
      return 'Open Redirect'
    case IssueType_Enum.WeakXmlSchemaUnboundedOccurrences:
      return 'Weak XML Schema: Unbounded Occurrences'
    case IssueType_Enum.SystemInformationLeak:
      return 'System Information Leak'
    case IssueType_Enum.SystemInformationLeakExternal:
      return 'External System Information Leak'
    case IssueType_Enum.HttpResponseSplitting:
      return 'HTTP response splitting'
    case IssueType_Enum.HttpOnlyCookie:
      return 'Cookie is not HttpOnly'
    case IssueType_Enum.InsecureCookie:
      return 'Insecure Cookie'
    case IssueType_Enum.TrustBoundaryViolation:
      return 'Trust Boundary Violation'
    case IssueType_Enum.NullDereference:
      return 'Null Dereference'
    case IssueType_Enum.UnsafeDeserialization:
      return 'Unsafe deserialization'
    case IssueType_Enum.InsecureBinderConfiguration:
      return 'Insecure Binder Configuration'
    case IssueType_Enum.UnsafeTargetBlank:
      return 'Unsafe use of target blank'
    case IssueType_Enum.IframeWithoutSandbox:
      return 'Client use of iframe without sandbox'
    case IssueType_Enum.JqueryDeprecatedSymbols:
      return 'jQuery deprecated symbols'
    case IssueType_Enum.MissingAntiforgeryValidation:
      return 'Missing Anti-Forgery Validation'
    case IssueType_Enum.GraphqlDepthLimit:
      return 'GraphQL Depth Limit'
    case IssueType_Enum.UncheckedLoopCondition:
      return 'Unchecked Loop Condition'
    case IssueType_Enum.ImproperResourceShutdownOrRelease:
      return 'Improper Resource Shutdown or Release'
    case IssueType_Enum.ImproperExceptionHandling:
      return 'Improper Exception Handling'
    case IssueType_Enum.DefaultRightsInObjDefinition:
      return 'Default Definer Rights in Package or Object Definition'
    case IssueType_Enum.HtmlCommentInJsp:
      return 'HTML Comment in JSP'
    case IssueType_Enum.ErrorCondtionWithoutAction:
      return 'Error Condition Without Action'
    case IssueType_Enum.DeprecatedFunction:
      return 'Deprecated Function'
    case IssueType_Enum.HardcodedSecrets:
      return 'Hardcoded Secrets'
    case IssueType_Enum.PrototypePollution:
      return 'Prototype Pollution'
    case IssueType_Enum.RaceConditionFormatFlaw:
      return 'Race Condition Format Flaw'
    case IssueType_Enum.NonFinalPublicStaticField:
      return 'Non-final Public Static Field'
    case IssueType_Enum.MissingHstsHeader:
      return 'Missing HSTS Header'
    case IssueType_Enum.DeadCodeUnusedField:
      return 'Dead Code: Unused Field'
    case IssueType_Enum.HeaderManipulation:
      return 'Header Manipulation'
    case IssueType_Enum.MissingEqualsOrHashcode:
      return 'Missing equals or hashcode method'
    case IssueType_Enum.WcfMisconfigurationInsufficientLogging:
      return 'WCF Misconfiguration: Insufficient Logging'
    case IssueType_Enum.WcfMisconfigurationThrottlingNotEnabled:
      return 'WCF Misconfiguration: Throttling Not Enabled'
    case IssueType_Enum.UselessRegexpCharEscape:
      return 'Useless regular-expression character escape'
    case IssueType_Enum.IncompleteHostnameRegex:
      return 'Incomplete Hostname Regex'
    case IssueType_Enum.OverlyLargeRange:
      return 'Regex: Overly Large Range'
    case IssueType_Enum.InsufficientLogging:
      return 'Insufficient Logging of Sensitive Operations'
    case IssueType_Enum.PrivacyViolation:
      return 'Privacy Violation'
    case IssueType_Enum.IncompleteUrlSchemeCheck:
      return 'Incomplete URL Scheme Check'
    case IssueType_Enum.ValueNeverRead:
      return 'Value Never Read'
    case IssueType_Enum.ValueShadowing:
      return 'Value Shadowing'
    default: {
      return issueType ? issueType.replaceAll('_', ' ') : 'Other'
    }
  }
}
