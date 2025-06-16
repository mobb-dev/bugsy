import { z } from 'zod'

import {
  IssueType_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
} from '../../generates/client_generates'
import { IssuePartsFp } from './types/issue'

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
  [IssueType_Enum.MissingCspHeader]: 'Missing CSP Header',
  [IssueType_Enum.HardcodedDomainInHtml]: 'Hardcoded Domain in HTML',
  [IssueType_Enum.HeapInspection]: 'Heap Inspection',
  [IssueType_Enum.ClientDomStoredCodeInjection]: 'Client Code Injection',
  [IssueType_Enum.StringFormatMisuse]: 'String Format Misuse',
  [IssueType_Enum.NonReadonlyField]: 'Non Readonly Field',
  [IssueType_Enum.Csrf]: 'Cross-Site Request Forgery (CSRF)',
  [IssueType_Enum.WeakEncryption]: 'Weak Encryption Mechanism',
  [IssueType_Enum.CodeInComment]: 'Code in Comment',
  [IssueType_Enum.RegexMissingTimeout]: 'Regex Missing Timeout',
  [IssueType_Enum.FrameableLoginPage]: 'Frameable Login Page',
  [IssueType_Enum.UseOfHardCodedCryptographicKey]:
    'Use of Hardcoded Cryptographic Key',
  [IssueType_Enum.MissingSslMinversion]: 'Missing SSL MinVersion',
  [IssueType_Enum.WebsocketMissingOriginCheck]:
    'Missing Websocket Origin Check',
  [IssueType_Enum.DuplicatedStrings]:
    'String Literals Should not Be Duplicated',
  [IssueType_Enum.InsecureUuidVersion]: 'Insecure UUID Version',
  [IssueType_Enum.GhActionsShellInjection]: 'GitHub Actions Shell Injection',
  [IssueType_Enum.ModifiedDefaultParam]: 'Modified Default Param',
  [IssueType_Enum.UnsafeWebThread]: 'Unsafe Web Thread',
  [IssueType_Enum.NoVar]: 'Prefer "let" or "const"',
  [IssueType_Enum.InsecureTmpFile]: 'Insecure Temporary File',
  [IssueType_Enum.ReturnShouldNotBeInvariant]: 'Return Should Not Be Invariant',
  [IssueType_Enum.SystemExitShouldReraise]: 'SystemExit Should Reraise',
  [IssueType_Enum.NoReturnInFinally]: 'No Return in Finally Block',
  [IssueType_Enum.WildcardImports]: 'Wildcard Imports should not be used',
  [IssueType_Enum.AvoidIdentityComparisonCachedTypes]:
    'Avoid Identity Comparison of Cached Types',
  [IssueType_Enum.AvoidBuiltinShadowing]: 'Avoid Builtin Shadowing',
  [IssueType_Enum.ImproperStringFormatting]: 'Improper String Formatting',
  [IssueType_Enum.TarSlip]: 'Tar Slip',
  [IssueType_Enum.MissingWhitespace]: 'Missing Whitespace',
  [IssueType_Enum.NoPrintStatement]: 'Python 2 "print" Statement Is Obsolete',
  [IssueType_Enum.NoOpOverhead]: 'Expensive Arguments in Conditional Methods',
  [IssueType_Enum.DoNotRaiseException]: 'Do Not Raise Exception',
  [IssueType_Enum.DeclareVariableExplicitly]: 'Declare Variable Explicitly',
  [IssueType_Enum.NoNestedTry]: 'No Nested Try',
  [IssueType_Enum.UnnecessaryImports]: 'Unnecessary Imports',
  [IssueType_Enum.Redos]: 'Regular Expression Denial of Service',
  [IssueType_Enum.DoNotThrowGenericException]: 'Do Not Throw Generic Exception',
} as const

const issueTypeZ = z.nativeEnum(IssueType_Enum)
export const getIssueTypeFriendlyString = (
  issueType: string | null | undefined
): string => {
  const issueTypeZParseRes = issueTypeZ.safeParse(issueType)
  if (!issueTypeZParseRes.success) {
    return issueType ? issueType.replaceAll('_', ' ') : 'Other'
  }
  return issueTypeMap[issueTypeZParseRes.data]
}

export function prettyName(val: string) {
  return (
    String(val).charAt(0).toUpperCase() +
    String(val).replaceAll('_', ' ').slice(1).toLowerCase()
  )
}

export function getTagTooltip(tag: string) {
  switch (tag) {
    case 'FALSE_POSITIVE':
      return 'Issue was found to be a false positive'
    case 'TEST_CODE':
      return 'Issue found in test files, not production code'
    case 'VENDOR_CODE':
      return 'Issue is in external libraries or dependencies not owned or maintained by your team'
    case 'AUTOGENERATED_CODE':
      return 'Code created by tools or frameworks, not manually written'
    case 'AUXILIARY_CODE':
      return "Issue found in supporting files that don't impact core functionality"
    case 'Filtered':
      return 'Issue was filtered by user in the Fix Policy'
    default:
      return tag
  }
}

export const issueDescription: Record<
  Vulnerability_Report_Issue_Tag_Enum,
  string
> = {
  [Vulnerability_Report_Issue_Tag_Enum.AutogeneratedCode]:
    'The flagged code is generated automatically by tools or frameworks as part of the build or runtime process. This categorization highlights that **the issue resides in non-manual code**, which often requires tool-specific solutions or exemptions.',
  [Vulnerability_Report_Issue_Tag_Enum.AuxiliaryCode]:
    "The flagged code is auxiliary or supporting code, such as configuration files, build scripts, or other non-application logic. This categorization indicates that the issue is not directly related to the application's core functionality.",
  [Vulnerability_Report_Issue_Tag_Enum.FalsePositive]:
    "The flagged code **does not represent an actual vulnerability within the application's context.** This categorization indicates that the issue is either misidentified by the scanner or deemed irrelevant to the application's functionality.",
  [Vulnerability_Report_Issue_Tag_Enum.TestCode]:
    'The flagged code resides in a test-specific path or context. This categorization indicates that **it supports testing scenarios and is isolated from production use**.',
  [Vulnerability_Report_Issue_Tag_Enum.Unfixable]:
    'The flagged code cannot be fixed',
  [Vulnerability_Report_Issue_Tag_Enum.VendorCode]:
    "The flagged code originates from a third-party library or dependency maintained externally. This categorization suggests that **the issue lies outside the application's direct control** and should be addressed by the vendor if necessary.",
}

type FalsePositiveData = IssuePartsFp['getFalsePositive']

function replaceKeysWithValues(
  fixDescription: string,
  extraContext: { key: string; value: string }[]
): string {
  let result = fixDescription
  extraContext.forEach(({ key, value }) => {
    result = result.replace(`\${${key}}`, value)
  })
  return result
}

export function getParsedFalsePositiveMessage(data: FalsePositiveData): {
  description: string
  contextString: string | null
} {
  const { fixDescription, extraContext } = data

  const containsTemplate = extraContext.some((context) =>
    fixDescription.includes(`\${${context.key}}`)
  )

  const description = containsTemplate
    ? replaceKeysWithValues(fixDescription, extraContext)
    : fixDescription

  const contextString = containsTemplate
    ? null
    : `\`\`\`${extraContext.map(({ value }) => value).join(' ')} \`\`\``

  return { description, contextString }
}
