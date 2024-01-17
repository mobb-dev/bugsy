export enum IssueType_Enum {
  /** Command Injection */
  CmDi = 'CMDi',
  /** Command Injection: relative path command */
  CmDiRelativePathCommand = 'CMDi_relative_path_command',
  /** Use of dangerous function */
  DangerousFunctionOverflow = 'DANGEROUS_FUNCTION_OVERFLOW',
  /** A denial of service by exploiting string builder */
  DosStringBuilder = 'DOS_STRING_BUILDER',
  /** GraphQl Depth Limit */
  GraphqlDepthLimit = 'GRAPHQL_DEPTH_LIMIT',
  /** HTTP only cookie */
  HttpOnlyCookie = 'HTTP_ONLY_COOKIE',
  /** HTTP response splitting */
  HttpResponseSplitting = 'HTTP_RESPONSE_SPLITTING',
  /** A case where the validation on the url is partial */
  IncompleteUrlSanitization = 'INCOMPLETE_URL_SANITIZATION',
  /** HTTP insecure cookie */
  InsecureCookie = 'INSECURE_COOKIE',
  /** Insecure Randomness */
  InsecureRandomness = 'INSECURE_RANDOMNESS',
  /** Log Forging / Injection */
  LogForging = 'LOG_FORGING',
  /** The program might dereference a null-pointer because it does not check the return value of a function that might return null */
  MissingCheckAgainstNull = 'MISSING_CHECK_AGAINST_NULL',
  /** Open Redirect */
  OpenRedirect = 'OPEN_REDIRECT',
  /** The catch block handles a broad swath of exceptions, potentially trapping dissimilar issues or problems that should not be dealt with at this point in the program */
  OverlyBroadCatch = 'OVERLY_BROAD_CATCH',
  /** The code has a password stored in a comment */
  PasswordInComment = 'PASSWORD_IN_COMMENT',
  /** Path Traversal */
  Pt = 'PT',
  /** Regular Expression Injection */
  RegexInjection = 'REGEX_INJECTION',
  /** SQL Injection */
  SqlInjection = 'SQL_Injection',
  /** Server Side Request Forgery */
  Ssrf = 'SSRF',
  /** Revealing system data or debugging information helps an adversary learn about the system and form a plan of attack */
  SystemInformationLeak = 'SYSTEM_INFORMATION_LEAK',
  /** Trust Boundary Violation */
  TrustBoundaryViolation = 'TRUST_BOUNDARY_VIOLATION',
  /** HTTP request parameter may be either an array or a string */
  TypeConfusion = 'TYPE_CONFUSION',
  /** Unchecked loop condition */
  UncheckedLoopCondition = 'UNCHECKED_LOOP_CONDITION',
  /** Printing logs in assorted way to the sys out/err */
  UseOfSystemOutputStream = 'USE_OF_SYSTEM_OUTPUT_STREAM',
  /** Unbounded occurrences can lead to resources exhaustion and ultimately a denial of service */
  WeakXmlSchemaUnboundedOccurrences = 'WEAK_XML_SCHEMA_UNBOUNDED_OCCURRENCES',
  /** Cross Site Scripting */
  Xss = 'XSS',
  /** XXE */
  Xxe = 'XXE',
}
