import { IssueType_Enum } from '../../generates/client_generates'

type FixDetailsData =
  | {
      issueDescription: string
      fixInstructions: string
    }
  | undefined

export const fixDetailsData: Record<IssueType_Enum, FixDetailsData> = {
  [IssueType_Enum.Pt]: {
    issueDescription:
      'Path Traversal AKA Directory Traversal occurs when a path coming from user input is not properly sanitized, allowing an attacker to navigate through directories beyond the intended scope. Attackers can exploit this to access sensitive files or execute arbitrary code.',
    fixInstructions:
      'Sanitize user-supplied paths, ensuring that they are restricted to a predefined directory structure.',
  },
  [IssueType_Enum.ZipSlip]: {
    issueDescription:
      'Zip Slip is a form of directory traversal that can be exploited by extracting files from an archive. Attackers can manipulate archive files to overwrite sensitive files or execute arbitrary code.',
    fixInstructions:
      'Ensure that extracted files are relative and within the intended directory structure.',
  },
  [IssueType_Enum.Xss]: {
    issueDescription:
      'Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users. This can lead to theft of session cookies, redirection to malicious websites, or defacement of the webpage.',
    fixInstructions:
      'Implement input validation and output encoding. This includes sanitizing user input and escaping special characters to prevent execution of injected scripts.',
  },
  [IssueType_Enum.Xxe]: {
    issueDescription:
      'XML External Entity (XXE) allows attackers to exploit vulnerable XML processors by including external entities, leading to disclosure of confidential data, denial of service, or server-side request forgery.',
    fixInstructions:
      'Disable external entity processing in XML parsers or update to versions that mitigate XXE vulnerabilities. Input validation should be implemented to ensure that XML input does not contain external entity references.',
  },
  [IssueType_Enum.CmDi]: {
    issueDescription:
      'Command Injection (CMDI) allows attackers inject malicious commands into vulnerable applications, that can result in execution of arbitrary commands on the underlying operating system.',
    fixInstructions:
      'Validate or sanitize user input to prevent executing arbitrary commands.',
  },
  [IssueType_Enum.SqlInjection]: {
    issueDescription:
      'SQL Injection allows attackers to execute malicious SQL queries by manipulating input data. This can result in unauthorized access to sensitive data, data manipulation, or even complete database compromise.',
    fixInstructions:
      'Use parameterized queries or prepared statements to sanitize user input and prevent manipulation of the SQL query.',
  },
  [IssueType_Enum.Ssrf]: {
    issueDescription:
      'Server-Side Request Forgery (SSRF) allows attackers to make unauthorized requests from a vulnerable server, potentially accessing internal systems, services, or data.',
    fixInstructions:
      'Validate or sanitize user-supplied URLs, ensuring that they are restricted to trusted domains. Implementing proper input validation and using whitelists for acceptable URLs can prevent SSRF attacks.',
  },
  [IssueType_Enum.LogForging]: {
    issueDescription:
      'Log Forging allows attackers to manipulate log files by injecting malicious content. This can be used to obfuscate attack traces or forge log entries to conceal unauthorized activities.',
    fixInstructions:
      'Implement proper input sanitization to remove new lines for values going to the log.',
  },
  [IssueType_Enum.HttpOnlyCookie]: {
    issueDescription:
      "Cookie without the 'HttpOnly' attribute can be accessed by client-side scripts, exposing them to potential XSS attacks.",
    fixInstructions:
      "Ensure that sensitive cookies are marked with the 'HttpOnly' attribute to prevent client-side scripts from accessing them.",
  },
  [IssueType_Enum.SystemInformationLeak]: {
    issueDescription:
      'System Information Leak occurs when sensitive system information is inadvertently disclosed to external entities, potentially aiding attackers in identifying vulnerabilities or targets.',
    fixInstructions:
      'Review and restrict the amount of system information exposed through error messages, debug logs, or response headers.',
  },
  [IssueType_Enum.UncheckedLoopCondition]: {
    issueDescription:
      'Unchecked Loop Condition can lead to infinite loops or unexpected behavior in software applications. Attackers can exploit this vulnerability to cause denial of service or consume excessive system resources.',
    fixInstructions:
      'Carefully review loop conditions to ensure that they are properly validated and bounded.',
  },
  [IssueType_Enum.TrustBoundaryViolation]: {
    issueDescription:
      'Trust Boundary Violation occurs when untrusted data is added to a trusted context, potentially leading to security vulnerabilities. Attackers can exploit this to bypass security controls or execute unauthorized actions.',
    fixInstructions:
      'Clearly define and enforce trust boundaries within applications, ensuring that untrusted data is properly validated and sanitized before being used in a trusted context.',
  },
  [IssueType_Enum.RegexInjection]: {
    issueDescription:
      'Regex Injection occurs when attackers manipulate regular expressions to perform unintended actions or bypass security controls. This can lead to security vulnerabilities such as denial of service or injection attacks.',
    fixInstructions:
      'Avoid constructing regular expressions from user-supplied input whenever possible. If dynamic regular expressions are necessary, input should be properly validated and sanitized to prevent injection attacks.',
  },
  [IssueType_Enum.ErrorCondtionWithoutAction]: {
    issueDescription:
      'Error Condition Without Action refers to situations where error conditions are identified but not appropriately handled or mitigated. This can lead to unexpected behavior, system crashes, or security vulnerabilities.',
    fixInstructions:
      'Implement error handling mechanisms to gracefully handle unexpected conditions and prevent system crashes.',
  },
  [IssueType_Enum.HttpResponseSplitting]: {
    issueDescription:
      'HTTP Response Splitting occurs when attackers manipulate HTTP responses to inject additional headers or content. This can lead to security vulnerabilities such as cache poisoning, session fixation, or XSS attacks.',
    fixInstructions:
      'Properly sanitize user input before including it in HTTP response headers or content.',
  },
  [IssueType_Enum.InsecureCookie]: {
    issueDescription:
      "Cookies lacking the 'Secure' attribute may be transmitted over unencrypted channels. This makes them vulnerable to interception or manipulation by attackers.",
    fixInstructions:
      "Ensure that sensitive cookies are transmitted over secure channels (e.g., HTTPS) and are marked with the 'Secure' attributes.",
  },
  [IssueType_Enum.CmDiRelativePathCommand]: {
    issueDescription:
      'Command Injection via Relative Path may allow attackers to manipulate file paths to execute arbitrary commands on the underlying system.',
    fixInstructions:
      'Paths coming from the input should be properly sanitized to ensure that only expected characters and paths are allowed.',
  },
  [IssueType_Enum.MissingCheckAgainstNull]: {
    issueDescription:
      'Missing Check Against Null occurs when null or uninitialized variables are not properly handled, leading to unexpected behavior or security vulnerabilities.',
    fixInstructions:
      'Implement proper null checks and error handling mechanisms to prevent null dereference vulnerabilities. Null values should be handled gracefully to avoid unexpected behavior or security issues.',
  },
  [IssueType_Enum.PasswordInComment]: {
    issueDescription:
      'Password in Comment refers to situations where sensitive information such as passwords or API keys are hardcoded or embedded in code comments. This can lead to inadvertent exposure of credentials and potential security breaches if the code is shared or leaked.',
    fixInstructions:
      'Remove hardcoded sensitive information from code comments.',
  },
  [IssueType_Enum.OverlyBroadCatch]: {
    issueDescription:
      'Overly Broad Catch occurs when exceptions are caught indiscriminately without proper handling or logging. This can lead to silent failures, masking potential security issues or allowing attackers to conduct reconnaissance.',
    fixInstructions:
      'Implement specific exception handling for different error scenarios to ensure proper diagnosis and mitigation of issues. Catch blocks should log relevant information and handle exceptions gracefully to prevent silent failures.',
  },
  [IssueType_Enum.UseOfSystemOutputStream]: {
    issueDescription:
      'Use of System Output Stream refers to situations where sensitive information is written to standard output streams such as System.out. This can lead to inadvertent exposure of sensitive data, especially in production environments.',
    fixInstructions:
      'Avoid writing sensitive information to standard output streams and instead use secure logging mechanisms or dedicated logging frameworks. Output streams should be properly configured to prevent leakage of sensitive data.',
  },
  [IssueType_Enum.DosStringBuilder]: {
    issueDescription:
      'Denial of Service (DoS) via String Builder may allow attackers to manipulate string concatenation operations to consume excessive memory or CPU resources. This can lead to degradation of system performance or unresponsiveness.',
    fixInstructions:
      'Use StringBuilder or similar efficient data structures for string concatenation operations to minimize memory overhead. Input validation should be performed to limit the size and complexity of input strings, preventing abuse by attackers.',
  },
  [IssueType_Enum.HtmlCommentInJsp]: {
    issueDescription:
      'HTML Comment in JSP occurs when developers inadvertently expose sensitive information or internal implementation details in HTML comments within JavaServer Pages (JSP) files. This can lead to inadvertent disclosure of credentials, configuration details, or security vulnerabilities.',
    fixInstructions:
      'Review JSP files to ensure that sensitive information or internal details are not exposed in HTML comments. Comments containing sensitive information should be removed or replaced with generic placeholders.',
  },
  [IssueType_Enum.OpenRedirect]: {
    issueDescription:
      'Open Redirect vulnerabilities may allow attackers to manipulate URL parameters to redirect users to malicious websites or phishing pages. This can lead to theft of sensitive information or unauthorized access to user accounts.',
    fixInstructions:
      'Redirect URLs validation should be performed to ensure that redirect URLs point to trusted domains.',
  },
  [IssueType_Enum.UnsafeTargetBlank]: {
    issueDescription:
      "Unsafe Target Blank occurs when developers use the target='_blank' attribute without the rel='noopener' attribute in anchor tags. This can lead to security vulnerabilities such as tabnabbing or reverse tabnabbing, allowing attackers to hijack user sessions or perform phishing attacks.",
    fixInstructions:
      "Ensure that anchor tags with target='_blank' attribute include the rel='noopener' attribute to prevent potential security vulnerabilities. This prevents the newly opened page from accessing the window.opener property, mitigating the risk of tabnabbing or reverse tabnabbing attacks.",
  },
  [IssueType_Enum.IframeWithoutSandbox]: {
    issueDescription:
      "IFrame Without Sandbox occurs when <iframe> elements are used without the 'sandbox' attribute, allowing potentially malicious content to execute in the context of the parent page.",
    fixInstructions:
      "Use the 'sandbox' attribute to restrict the capabilities of <iframe> elements, isolating potentially untrusted content from the parent page. This helps mitigate the risk of malicious code execution and prevents attacks such as clickjacking.",
  },
  [IssueType_Enum.JqueryDeprecatedSymbols]: {
    issueDescription:
      'JQuery Deprecated Symbols refers to the use of deprecated or removed functions, methods, or symbols in jQuery libraries. This can lead to compatibility issues, security vulnerabilities, or performance degradation in applications.',
    fixInstructions:
      'Replace deprecated symbols with recommended alternatives.',
  },
  [IssueType_Enum.DeprecatedFunction]: {
    issueDescription:
      'Deprecated Function refers to the use of functions, methods, or features that have been deprecated in programming languages or frameworks. This can lead to compatibility issues, security vulnerabilities, or performance degradation in applications.',
    fixInstructions:
      'Update code to replace deprecated functions with recommended alternatives provided by the language or framework.',
  },
  [IssueType_Enum.HardcodedSecrets]: {
    issueDescription:
      'Hardcoded Secrets refers to the practice of embedding sensitive information such as passwords, API keys, or cryptographic keys directly into source code or configuration files. This can lead to inadvertent exposure of credentials and potential security breaches if the code is shared or leaked.',
    fixInstructions:
      'Remove hardcoded sensitive information in source code or configuration files. Instead, sensitive data should be stored securely using encryption or secure credential management solutions.',
  },
  [IssueType_Enum.GraphqlDepthLimit]: {
    issueDescription:
      'GraphQL Depth Limit refers to the lack of restrictions on query depth in GraphQL implementations, allowing attackers to execute complex and resource-intensive queries. This can lead to denial of service or excessive resource consumption.',
    fixInstructions:
      'Implement depth limits and query complexity thresholds in GraphQL schemas to restrict the complexity of incoming queries.',
  },
  [IssueType_Enum.SystemInformationLeakExternal]: {
    issueDescription:
      'System Information Leak occurs when sensitive system information is inadvertently disclosed to external entities, potentially aiding attackers in identifying vulnerabilities or targets.',
    fixInstructions:
      'Review and restrict the amount of system information exposed to external entities such as third-party APIs or integrations.',
  },
  [IssueType_Enum.InsecureRandomness]: {
    issueDescription:
      'Insecure Randomness refers to the use of insecure or predictable random number generation algorithms, leading to weak cryptographic keys, session tokens, or initialization vectors. This can facilitate brute-force attacks or cryptographic exploits.',
    fixInstructions:
      'Use secure random number generation algorithms provided by cryptographic libraries or frameworks.',
  },
  [IssueType_Enum.TypeConfusion]: {
    issueDescription:
      'Type Confusion occurs in programming languages with weak typing systems when an attacker manipulates object types to bypass type checks or exploit memory corruption vulnerabilities. This can lead to arbitrary code execution or unauthorized access to sensitive data.',
    fixInstructions:
      'Implement strict type checking and validation to prevent type confusion vulnerabilities.',
  },
  [IssueType_Enum.IncompleteUrlSanitization]: {
    issueDescription:
      'Incomplete URL Sanitization occurs when user-supplied URLs are not properly sanitized, allowing attackers to inject malicious content or bypass security controls. This can lead to security vulnerabilities such as XSS attacks, open redirect, or SSRF.',
    fixInstructions:
      'Implement thorough URL validation and/or sanitization to ensure that user-supplied URLs conform to expected formats and do not contain malicious content.',
  },
  [IssueType_Enum.UnsafeDeserialization]: {
    issueDescription:
      'Unsafe Deserialization occurs when attackers manipulate serialized objects to execute arbitrary code or bypass security controls. This can lead to remote code execution, privilege escalation, or data tampering.',
    fixInstructions:
      'Implement strict validation and integrity checks on serialized objects.',
  },
  [IssueType_Enum.ImproperResourceShutdownOrRelease]: {
    issueDescription:
      'Improper Resource Shutdown or Release refers to situations where system resources such as file handles, database connections, or network sockets are not properly closed or released after use. This can lead to resource exhaustion, denial of service, or memory leaks.',
    fixInstructions:
      'Ensure that system resources are consistently closed or released after use. Using try-with resources blocks, finalizers, or dedicated resource management libraries can help mitigate the risk of improper resource shutdown or release vulnerabilities.',
  },
  [IssueType_Enum.ImproperExceptionHandling]: {
    issueDescription:
      'Improper Exception Handling occurs when exceptions are not handled or propagated correctly, leading to unexpected behavior, security vulnerabilities, or application crashes.',
    fixInstructions:
      'Implement exception handling to gracefully handle unexpected errors.',
  },
  [IssueType_Enum.MissingAntiforgeryValidation]: {
    issueDescription:
      'Missing Anti-Forgery Validation occurs when web applications do not properly validate or enforce anti-forgery tokens, allowing attackers to forge or replay requests from authenticated users.',
    fixInstructions:
      'Implement anti-forgery measures to validate the authenticity of user-submitted requests.',
  },
  [IssueType_Enum.InsecureBinderConfiguration]: {
    issueDescription:
      'Insecure Binder Configuration refers to misconfigurations in application frameworks or dependency injection containers, leading to security vulnerabilities such as injection attacks or privilege escalation.',
    fixInstructions:
      'Secure binder configurations to prevent injection attacks and enforce least privilege principles. Configurations should be restricted to trusted sources and sanitized to prevent unauthorized access or manipulation.',
  },
  [IssueType_Enum.NullDereference]: {
    issueDescription:
      'Null Dereference occurs when null or uninitialized pointers are dereferenced, leading to application crashes or security vulnerabilities. Attackers can exploit this to cause denial of service or execute arbitrary code.',
    fixInstructions:
      'Implement proper null checks and error handling mechanisms. Null values should be handled gracefully to avoid unexpected behavior or security issues.',
  },
  [IssueType_Enum.DangerousFunctionOverflow]: {
    issueDescription:
      'Dangerous Function Overflow occurs when functions or methods are called with parameters that exceed predefined limits, leading to buffer overflows or memory corruption vulnerabilities.',
    fixInstructions:
      'Implement proper input validation and bounds checking to prevent dangerous function overflows. Functions should be designed to handle input within safe limits and gracefully reject or truncate input that exceeds these limits.',
  },
  [IssueType_Enum.DefaultRightsInObjDefinition]: {
    issueDescription:
      'Default Rights in Object Definition refers to situations where SQL objects are created with default or excessive permissions, leading to security vulnerabilities such as privilege escalation or unauthorized access.',
    fixInstructions:
      'Restrict default permissions in object definitions to enforce least privilege principles. Objects should be created with the minimum necessary permissions required for their intended functionality.',
  },
  [IssueType_Enum.WeakXmlSchemaUnboundedOccurrences]: {
    issueDescription:
      'Weak XML Schema Unbounded Occurrences refers to the lack of restrictions on the maximum number of occurrences for elements or attributes in XML schemas. This can lead to denial of service or resource exhaustion attacks by causing excessive memory consumption or processing overhead.',
    fixInstructions:
      'Impose limits on the maximum number of occurrences for elements or attributes in XML schemas to prevent resource exhaustion attacks.',
  },
  [IssueType_Enum.DeadCodeUnusedField]: undefined,
  [IssueType_Enum.LocaleDependentComparison]: undefined,
  [IssueType_Enum.MissingHstsHeader]: undefined,
  [IssueType_Enum.NonFinalPublicStaticField]: undefined,
  [IssueType_Enum.PrototypePollution]: undefined,
  [IssueType_Enum.RaceConditionFormatFlaw]: undefined,
  [IssueType_Enum.HeaderManipulation]: undefined,
  [IssueType_Enum.MissingEqualsOrHashcode]: {
    issueDescription:
      'Missing equals or hashcode method can lead to unexpected behavior in collections. If two objects are equal, they should have the same hashcode.',
    fixInstructions:
      'Add the missing methods to ensure proper behavior in collections.',
  },
  [IssueType_Enum.ValueNeverRead]: {
    issueDescription:
      "The variable's value is not used. After the assignment, the variable is either assigned another value or goes out of scope.",
    fixInstructions: 'Remove the assignment to the variable.',
  },
  [IssueType_Enum.WcfMisconfigurationInsufficientLogging]: undefined,
  [IssueType_Enum.WcfMisconfigurationThrottlingNotEnabled]: undefined,
  [IssueType_Enum.UselessRegexpCharEscape]: undefined,
  [IssueType_Enum.IncompleteHostnameRegex]: undefined,
  [IssueType_Enum.OverlyLargeRange]: undefined,
  [IssueType_Enum.PrivacyViolation]: undefined,
  [IssueType_Enum.ValueShadowing]: undefined,
  [IssueType_Enum.IncompleteUrlSchemeCheck]: undefined,
  [IssueType_Enum.InsufficientLogging]: undefined,
  [IssueType_Enum.NoEquivalenceMethod]: undefined,
  [IssueType_Enum.InformationExposureViaHeaders]: undefined,
  [IssueType_Enum.DebugEnabled]: undefined,
  [IssueType_Enum.ConfusingNaming]: {
    issueDescription:
      'A data member and a function have the same name which can be confusing to the developer.',
    fixInstructions: 'Rename the data member to avoid confusion.',
  },
  [IssueType_Enum.LeftoverDebugCode]: undefined,
  [IssueType_Enum.UnvalidatedPublicMethodArgument]: undefined,
  [IssueType_Enum.ErroneousStringCompare]: undefined,
  [IssueType_Enum.PoorErrorHandlingEmptyCatchBlock]: undefined,
  [IssueType_Enum.AutoEscapeFalse]: {
    issueDescription:
      'Auto Escape False occurs when automatic escaping is disabled in template engines, allowing untrusted data to be rendered without proper encoding. This can lead to Cross-Site Scripting (XSS) vulnerabilities.',
    fixInstructions: 'Set auto escape to true.',
  },
  [IssueType_Enum.NoLimitsOrThrottling]: {
    issueDescription:
      'The lack of a rate limit can allow denial-of-service attacks, in which an attacker can cause the application to crash or become unresponsive by issuing a large number of requests simultaneously.',
    fixInstructions: 'Use express-rate-limit npm package to set a rate limit.',
  },
  [IssueType_Enum.MissingCspHeader]: undefined,
  [IssueType_Enum.HardcodedDomainInHtml]: undefined,
  [IssueType_Enum.HeapInspection]: {
    issueDescription:
      'All variables stored by the application in unencrypted memory can be read by an attacker. This can lead to the exposure of sensitive information, such as passwords, credit card numbers, and personal data.',
    fixInstructions: 'Use secure storage methods to store secrets in memory.',
  },
  [IssueType_Enum.ClientDomStoredCodeInjection]: {
    issueDescription:
      'Client DOM Stored Code Injection is a client-side security vulnerability where malicious JavaScript code gets stored in the DOM and later executed when retrieved by legitimate scripts.',
    fixInstructions:
      'Update the code to avoid the possibility for malicious JavaScript code to get stored in the DOM.',
  },
  [IssueType_Enum.StringFormatMisuse]: undefined,
  [IssueType_Enum.NonReadonlyField]: undefined,
  [IssueType_Enum.Csrf]: {
    issueDescription:
      'Cross Site Request Forgery is an attack that forces an end user to execute unwanted actions on a web application in which they’re currently authenticated.',
    fixInstructions:
      'Configure a CSRF protection mechanism, such as a CSRF token, in your application.',
  },
  [IssueType_Enum.WeakEncryption]: undefined,
  [IssueType_Enum.CodeInComment]: undefined,
  [IssueType_Enum.RegexMissingTimeout]: undefined,
  [IssueType_Enum.FrameableLoginPage]: undefined,
}
