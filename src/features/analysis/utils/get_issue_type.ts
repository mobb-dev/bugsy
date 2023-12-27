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
    case IssueType_Enum.HttpResponseSplitting:
      return 'HTTP response splitting'
    case IssueType_Enum.HttpOnlyCookie:
      return 'Cookie is not HttpOnly'
    case IssueType_Enum.InsecureCookie:
      return 'Insecure Cookie'
    default: {
      return issueType ? issueType.replaceAll('_', ' ') : 'Other'
    }
  }
}
