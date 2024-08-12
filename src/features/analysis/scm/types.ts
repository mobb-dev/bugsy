export enum IssueType_Enum {
  /** Command Injection */
  CmDi = 'CMDi',
  /** Command Injection: relative path command */
  CmDiRelativePathCommand = 'CMDi_relative_path_command',
  /** Use of dangerous function */
  DangerousFunctionOverflow = 'DANGEROUS_FUNCTION_OVERFLOW',
  /** Dead Code: Unused Field */
  DeadCodeUnusedField = 'DEAD_CODE_UNUSED_FIELD',
  /** Default definer rights in package or object definition */
  DefaultRightsInObjDefinition = 'DEFAULT_RIGHTS_IN_OBJ_DEFINITION',
  /** Deprecated Function */
  DeprecatedFunction = 'DEPRECATED_FUNCTION',
  /** A denial of service by exploiting string builder */
  DosStringBuilder = 'DOS_STRING_BUILDER',
  /** Error Condition Without Action */
  ErrorCondtionWithoutAction = 'ERROR_CONDTION_WITHOUT_ACTION',
  /** GraphQl Depth Limit */
  GraphqlDepthLimit = 'GRAPHQL_DEPTH_LIMIT',
  /** Hardcoded Secrets */
  HardcodedSecrets = 'HARDCODED_SECRETS',
  /** Header Manipulation */
  HeaderManipulation = 'HEADER_MANIPULATION',
  /** System Information Leak: HTML Comment in JSP */
  HtmlCommentInJsp = 'HTML_COMMENT_IN_JSP',
  /** HTTP only cookie */
  HttpOnlyCookie = 'HTTP_ONLY_COOKIE',
  /** HTTP response splitting */
  HttpResponseSplitting = 'HTTP_RESPONSE_SPLITTING',
  /** Client use of iframe without sandbox */
  IframeWithoutSandbox = 'IFRAME_WITHOUT_SANDBOX',
  /** Improper Exception Handling */
  ImproperExceptionHandling = 'IMPROPER_EXCEPTION_HANDLING',
  /** A resource was defined without proper release */
  ImproperResourceShutdownOrRelease = 'IMPROPER_RESOURCE_SHUTDOWN_OR_RELEASE',
  /** Incomplete Hostname Regex */
  IncompleteHostnameRegex = 'INCOMPLETE_HOSTNAME_REGEX',
  /** A case where the validation on the url is partial */
  IncompleteUrlSanitization = 'INCOMPLETE_URL_SANITIZATION',
  /** Incomplete URL Scheme Check */
  IncompleteUrlSchemeCheck = 'INCOMPLETE_URL_SCHEME_CHECK',
  /** Insecure Binder Configuration */
  InsecureBinderConfiguration = 'INSECURE_BINDER_CONFIGURATION',
  /** HTTP insecure cookie */
  InsecureCookie = 'INSECURE_COOKIE',
  /** Insecure Randomness */
  InsecureRandomness = 'INSECURE_RANDOMNESS',
  /** Insufficient Logging of Sensitive Operations */
  InsufficientLogging = 'INSUFFICIENT_LOGGING',
  /** Client jQuery deprecated symbols */
  JqueryDeprecatedSymbols = 'JQUERY_DEPRECATED_SYMBOLS',
  /** A string is used in locale dependent comparison which can cause bugs */
  LocaleDependentComparison = 'LOCALE_DEPENDENT_COMPARISON',
  /** Log Forging / Injection */
  LogForging = 'LOG_FORGING',
  /** Missing Anti-Forgery Validation */
  MissingAntiforgeryValidation = 'MISSING_ANTIFORGERY_VALIDATION',
  /** The program might dereference a null-pointer because it does not check the return value of a function that might return null */
  MissingCheckAgainstNull = 'MISSING_CHECK_AGAINST_NULL',
  /** Missing equals or hashcode method */
  MissingEqualsOrHashcode = 'MISSING_EQUALS_OR_HASHCODE',
  /** Missing HSTS Header */
  MissingHstsHeader = 'MISSING_HSTS_HEADER',
  /** Non-final public static field */
  NonFinalPublicStaticField = 'NON_FINAL_PUBLIC_STATIC_FIELD',
  /** Null Dereference */
  NullDereference = 'NULL_DEREFERENCE',
  /** Open Redirect */
  OpenRedirect = 'OPEN_REDIRECT',
  /** The catch block handles a broad swath of exceptions, potentially trapping dissimilar issues or problems that should not be dealt with at this point in the program */
  OverlyBroadCatch = 'OVERLY_BROAD_CATCH',
  /** Overly Large Range */
  OverlyLargeRange = 'OVERLY_LARGE_RANGE',
  /** The code has a password stored in a comment */
  PasswordInComment = 'PASSWORD_IN_COMMENT',
  /** Privacy Violation */
  PrivacyViolation = 'PRIVACY_VIOLATION',
  /** Prototype Pollution */
  PrototypePollution = 'PROTOTYPE_POLLUTION',
  /** Path Traversal */
  Pt = 'PT',
  /** Race Condition: Format Flaw */
  RaceConditionFormatFlaw = 'RACE_CONDITION_FORMAT_FLAW',
  /** Regular Expression Injection */
  RegexInjection = 'REGEX_INJECTION',
  /** SQL Injection */
  SqlInjection = 'SQL_Injection',
  /** Server Side Request Forgery */
  Ssrf = 'SSRF',
  /** Revealing system data or debugging information helps an adversary learn about the system and form a plan of attack */
  SystemInformationLeak = 'SYSTEM_INFORMATION_LEAK',
  /** Revealing system data or debugging information helps an adversary learn about the system and form a plan of attack */
  SystemInformationLeakExternal = 'SYSTEM_INFORMATION_LEAK_EXTERNAL',
  /** Trust Boundary Violation */
  TrustBoundaryViolation = 'TRUST_BOUNDARY_VIOLATION',
  /** HTTP request parameter may be either an array or a string */
  TypeConfusion = 'TYPE_CONFUSION',
  /** Unchecked loop condition */
  UncheckedLoopCondition = 'UNCHECKED_LOOP_CONDITION',
  /** Unsafe deserialization of untrusted data */
  UnsafeDeserialization = 'UNSAFE_DESERIALIZATION',
  /** Unsafe use of target blank */
  UnsafeTargetBlank = 'UNSAFE_TARGET_BLANK',
  /** Useless regular-expression character escape */
  UselessRegexpCharEscape = 'USELESS_REGEXP_CHAR_ESCAPE',
  /** Printing logs in assorted way to the sys out/err */
  UseOfSystemOutputStream = 'USE_OF_SYSTEM_OUTPUT_STREAM',
  /** A variable is assigned a value that is never read */
  ValueNeverRead = 'VALUE_NEVER_READ',
  /** Value Shadowing */
  ValueShadowing = 'VALUE_SHADOWING',
  /** WCF Misconfiguration: Insufficient Logging */
  WcfMisconfigurationInsufficientLogging = 'WCF_MISCONFIGURATION_INSUFFICIENT_LOGGING',
  /** WCF Misconfiguration: Throttling Not Enabled */
  WcfMisconfigurationThrottlingNotEnabled = 'WCF_MISCONFIGURATION_THROTTLING_NOT_ENABLED',
  /** Unbounded occurrences can lead to resources exhaustion and ultimately a denial of service */
  WeakXmlSchemaUnboundedOccurrences = 'WEAK_XML_SCHEMA_UNBOUNDED_OCCURRENCES',
  /** Cross Site Scripting */
  Xss = 'XSS',
  /** XXE */
  Xxe = 'XXE',
  /** Zip Slip is a form of directory traversal that can be exploited by extracting files from an archive */
  ZipSlip = 'ZIP_SLIP',
}

export enum ReferenceType {
  BRANCH = 'BRANCH',
  COMMIT = 'COMMIT',
  TAG = 'TAG',
}

export type GetReferenceDataResponse = {
  type: ReferenceType
  sha: string
  date: Date | undefined
}

export type GetGitBlameReponse = {
  startingLine: number
  endingLine: number
  name: string
  login: string
  email: string
}[]

export const scmSubmitRequestStatus = {
  MERGED: 'merged',
  OPEN: 'open',
  CLOSED: 'closed',
  DRAFT: 'draft',
} as const
export type ScmSubmitRequestStatus =
  (typeof scmSubmitRequestStatus)[keyof typeof scmSubmitRequestStatus]

export enum ScmLibScmType {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  ADO = 'ADO',
  BITBUCKET = 'BITBUCKET',
}

export type ScmRepoInfo = {
  repoName: string
  repoUrl: string
  repoOwner: string
  repoLanguages: string[]
  repoIsPublic: boolean
  repoUpdatedAt: string
}

export const scmCloudUrl = {
  GitLab: 'https://gitlab.com',
  GitHub: 'https://github.com',
  Ado: 'https://dev.azure.com',
  Bitbucket: 'https://bitbucket.org',
} as const

export enum ScmType {
  GitHub = 'GitHub',
  GitLab = 'GitLab',
  Ado = 'Ado',
  Bitbucket = 'Bitbucket',
}
