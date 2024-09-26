import { z } from 'zod'

import { IssueType_Enum } from '../../generates/client_generates'

export const issueTypeMap: Record<IssueType_Enum, string> = {
  [IssueType_Enum.NoLimitsOrThrottling]: 'Missing Rate Limiting',
  [IssueType_Enum.SqlInjection]: 'SQL Injection',
  [IssueType_Enum.CmDiRelativePathCommand]: 'Relative Path Command Injection',
  [IssueType_Enum.CmDi]: 'Command Injection',
  [IssueType_Enum.ConfusingNaming]: 'Confusing Naming',
  [IssueType_Enum.Xxe]: 'XXE',
  [IssueType_Enum.Xss]: 'XSS',
  [IssueType_Enum.Pt]: 'Path Traversal',
  [IssueType_Enum.ZipSlip]: 'Zip Slip',
  [IssueType_Enum.InsecureRandomness]: 'Insecure Randomness',
  [IssueType_Enum.Ssrf]: 'Server Side Request Forgery',
  [IssueType_Enum.TypeConfusion]: 'Type Confusion',
  [IssueType_Enum.RegexInjection]: 'Regular Expression Injection',
  [IssueType_Enum.IncompleteUrlSanitization]: 'Incomplete URL Sanitization',
  [IssueType_Enum.LocaleDependentComparison]: 'Locale Dependent Comparison',
  [IssueType_Enum.LogForging]: 'Log Forging',
  [IssueType_Enum.MissingCheckAgainstNull]: 'Missing Check against Null',
  [IssueType_Enum.PasswordInComment]: 'Password in Comment',
  [IssueType_Enum.OverlyBroadCatch]: 'Poor Error Handling: Overly Broad Catch',
  [IssueType_Enum.UseOfSystemOutputStream]: 'Use of System.out/System.err',
  [IssueType_Enum.DangerousFunctionOverflow]: 'Use of dangerous function',
  [IssueType_Enum.DosStringBuilder]: 'Denial of Service: StringBuilder',
  [IssueType_Enum.OpenRedirect]: 'Open Redirect',
  [IssueType_Enum.WeakXmlSchemaUnboundedOccurrences]:
    'Weak XML Schema: Unbounded Occurrences',
  [IssueType_Enum.SystemInformationLeak]: 'System Information Leak',
  [IssueType_Enum.SystemInformationLeakExternal]:
    'External System Information Leak',
  [IssueType_Enum.HttpResponseSplitting]: 'HTTP response splitting',
  [IssueType_Enum.HttpOnlyCookie]: 'Cookie is not HttpOnly',
  [IssueType_Enum.InsecureCookie]: 'Insecure Cookie',
  [IssueType_Enum.TrustBoundaryViolation]: 'Trust Boundary Violation',
  [IssueType_Enum.NullDereference]: 'Null Dereference',
  [IssueType_Enum.UnsafeDeserialization]: 'Unsafe deserialization',
  [IssueType_Enum.InsecureBinderConfiguration]: 'Insecure Binder Configuration',
  [IssueType_Enum.UnsafeTargetBlank]: 'Unsafe use of target blank',
  [IssueType_Enum.IframeWithoutSandbox]: 'Client use of iframe without sandbox',
  [IssueType_Enum.JqueryDeprecatedSymbols]: 'jQuery deprecated symbols',
  [IssueType_Enum.MissingAntiforgeryValidation]:
    'Missing Anti-Forgery Validation',
  [IssueType_Enum.GraphqlDepthLimit]: 'GraphQL Depth Limit',
  [IssueType_Enum.UncheckedLoopCondition]: 'Unchecked Loop Condition',
  [IssueType_Enum.ImproperResourceShutdownOrRelease]:
    'Improper Resource Shutdown or Release',
  [IssueType_Enum.ImproperExceptionHandling]: 'Improper Exception Handling',
  [IssueType_Enum.DefaultRightsInObjDefinition]:
    'Default Definer Rights in Package or Object Definition',
  [IssueType_Enum.HtmlCommentInJsp]: 'HTML Comment in JSP',
  [IssueType_Enum.ErrorCondtionWithoutAction]: 'Error Condition Without Action',
  [IssueType_Enum.DeprecatedFunction]: 'Deprecated Function',
  [IssueType_Enum.HardcodedSecrets]: 'Hardcoded Secrets',
  [IssueType_Enum.PrototypePollution]: 'Prototype Pollution',
  [IssueType_Enum.RaceConditionFormatFlaw]: 'Race Condition Format Flaw',
  [IssueType_Enum.NonFinalPublicStaticField]: 'Non-final Public Static Field',
  [IssueType_Enum.MissingHstsHeader]: 'Missing HSTS Header',
  [IssueType_Enum.DeadCodeUnusedField]: 'Dead Code: Unused Field',
  [IssueType_Enum.HeaderManipulation]: 'Header Manipulation',
  [IssueType_Enum.MissingEqualsOrHashcode]: 'Missing equals or hashcode method',
  [IssueType_Enum.WcfMisconfigurationInsufficientLogging]:
    'WCF Misconfiguration: Insufficient Logging',
  [IssueType_Enum.WcfMisconfigurationThrottlingNotEnabled]:
    'WCF Misconfiguration: Throttling Not Enabled',
  [IssueType_Enum.UselessRegexpCharEscape]:
    'Useless regular-expression character escape',
  [IssueType_Enum.IncompleteHostnameRegex]: 'Incomplete Hostname Regex',
  [IssueType_Enum.OverlyLargeRange]: 'Regex: Overly Large Range',
  [IssueType_Enum.InsufficientLogging]:
    'Insufficient Logging of Sensitive Operations',
  [IssueType_Enum.PrivacyViolation]: 'Privacy Violation',
  [IssueType_Enum.IncompleteUrlSchemeCheck]: 'Incomplete URL Scheme Check',
  [IssueType_Enum.ValueNeverRead]: 'Value Never Read',
  [IssueType_Enum.ValueShadowing]: 'Value Shadowing',
  [IssueType_Enum.NoEquivalenceMethod]:
    'Class Does Not Implement Equivalence Method',
  [IssueType_Enum.InformationExposureViaHeaders]:
    'Information Exposure via Headers',
  [IssueType_Enum.DebugEnabled]: 'Debug Enabled',
  [IssueType_Enum.LeftoverDebugCode]: 'Leftover Debug Code',
  [IssueType_Enum.PoorErrorHandlingEmptyCatchBlock]:
    'Poor Error Handling: Empty Catch Block',
  [IssueType_Enum.ErroneousStringCompare]: 'Erroneous String Compare',
  [IssueType_Enum.UnvalidatedPublicMethodArgument]:
    'Unvalidated Public Method Argument',
  [IssueType_Enum.AutoEscapeFalse]: 'Auto-escape False',
} as const

const issueTypeZ = z.nativeEnum(IssueType_Enum)
export const getIssueType = (issueType: string | null | undefined): string => {
  const issueTypeZParseRes = issueTypeZ.safeParse(issueType)
  if (!issueTypeZParseRes.success) {
    return issueType ? issueType.replaceAll('_', ' ') : 'Other'
  }
  return issueTypeMap[issueTypeZParseRes.data]
}
