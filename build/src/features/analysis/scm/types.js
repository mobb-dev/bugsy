"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueType_Enum = void 0;
var IssueType_Enum;
(function (IssueType_Enum) {
    /** Command Injection */
    IssueType_Enum["CmDi"] = "CMDi";
    /** Command Injection: relative path command */
    IssueType_Enum["CmDiRelativePathCommand"] = "CMDi_relative_path_command";
    /** Use of dangerous function */
    IssueType_Enum["DangerousFunctionOverflow"] = "DANGEROUS_FUNCTION_OVERFLOW";
    /** A denial of service by exploiting string builder */
    IssueType_Enum["DosStringBuilder"] = "DOS_STRING_BUILDER";
    /** GraphQl Depth Limit */
    IssueType_Enum["GraphqlDepthLimit"] = "GRAPHQL_DEPTH_LIMIT";
    /** HTTP only cookie */
    IssueType_Enum["HttpOnlyCookie"] = "HTTP_ONLY_COOKIE";
    /** HTTP response splitting */
    IssueType_Enum["HttpResponseSplitting"] = "HTTP_RESPONSE_SPLITTING";
    /** A case where the validation on the url is partial */
    IssueType_Enum["IncompleteUrlSanitization"] = "INCOMPLETE_URL_SANITIZATION";
    /** HTTP insecure cookie */
    IssueType_Enum["InsecureCookie"] = "INSECURE_COOKIE";
    /** Insecure Randomness */
    IssueType_Enum["InsecureRandomness"] = "INSECURE_RANDOMNESS";
    /** A string is used in locale dependent comparison which can cause bugs */
    IssueType_Enum["LocaleDependentComparison"] = "LOCALE_DEPENDENT_COMPARISON";
    /** Log Forging / Injection */
    IssueType_Enum["LogForging"] = "LOG_FORGING";
    /** The program might dereference a null-pointer because it does not check the return value of a function that might return null */
    IssueType_Enum["MissingCheckAgainstNull"] = "MISSING_CHECK_AGAINST_NULL";
    /** Missing equals or hashcode method */
    IssueType_Enum["MissingEqualsOrHashcode"] = "MISSING_EQUALS_OR_HASHCODE";
    /** Open Redirect */
    IssueType_Enum["OpenRedirect"] = "OPEN_REDIRECT";
    /** The catch block handles a broad swath of exceptions, potentially trapping dissimilar issues or problems that should not be dealt with at this point in the program */
    IssueType_Enum["OverlyBroadCatch"] = "OVERLY_BROAD_CATCH";
    /** The code has a password stored in a comment */
    IssueType_Enum["PasswordInComment"] = "PASSWORD_IN_COMMENT";
    /** Path Traversal */
    IssueType_Enum["Pt"] = "PT";
    /** Regular Expression Injection */
    IssueType_Enum["RegexInjection"] = "REGEX_INJECTION";
    /** SQL Injection */
    IssueType_Enum["SqlInjection"] = "SQL_Injection";
    /** Server Side Request Forgery */
    IssueType_Enum["Ssrf"] = "SSRF";
    /** Revealing system data or debugging information helps an adversary learn about the system and form a plan of attack */
    IssueType_Enum["SystemInformationLeak"] = "SYSTEM_INFORMATION_LEAK";
    /** Trust Boundary Violation */
    IssueType_Enum["TrustBoundaryViolation"] = "TRUST_BOUNDARY_VIOLATION";
    /** HTTP request parameter may be either an array or a string */
    IssueType_Enum["TypeConfusion"] = "TYPE_CONFUSION";
    /** Unchecked loop condition */
    IssueType_Enum["UncheckedLoopCondition"] = "UNCHECKED_LOOP_CONDITION";
    /** Printing logs in assorted way to the sys out/err */
    IssueType_Enum["UseOfSystemOutputStream"] = "USE_OF_SYSTEM_OUTPUT_STREAM";
    /** Unbounded occurrences can lead to resources exhaustion and ultimately a denial of service */
    IssueType_Enum["WeakXmlSchemaUnboundedOccurrences"] = "WEAK_XML_SCHEMA_UNBOUNDED_OCCURRENCES";
    /** Cross Site Scripting */
    IssueType_Enum["Xss"] = "XSS";
    /** XXE */
    IssueType_Enum["Xxe"] = "XXE";
    /** Zip Slip is a form of directory traversal that can be exploited by extracting files from an archive */
    IssueType_Enum["ZipSlip"] = "ZIP_SLIP";
})(IssueType_Enum = exports.IssueType_Enum || (exports.IssueType_Enum = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQVksY0E2RFg7QUE3REQsV0FBWSxjQUFjO0lBQ3hCLHdCQUF3QjtJQUN4QiwrQkFBYSxDQUFBO0lBQ2IsK0NBQStDO0lBQy9DLHdFQUFzRCxDQUFBO0lBQ3RELGdDQUFnQztJQUNoQywyRUFBeUQsQ0FBQTtJQUN6RCx1REFBdUQ7SUFDdkQseURBQXVDLENBQUE7SUFDdkMsMEJBQTBCO0lBQzFCLDJEQUF5QyxDQUFBO0lBQ3pDLHVCQUF1QjtJQUN2QixxREFBbUMsQ0FBQTtJQUNuQyw4QkFBOEI7SUFDOUIsbUVBQWlELENBQUE7SUFDakQsd0RBQXdEO0lBQ3hELDJFQUF5RCxDQUFBO0lBQ3pELDJCQUEyQjtJQUMzQixvREFBa0MsQ0FBQTtJQUNsQywwQkFBMEI7SUFDMUIsNERBQTBDLENBQUE7SUFDMUMsMkVBQTJFO0lBQzNFLDJFQUF5RCxDQUFBO0lBQ3pELDhCQUE4QjtJQUM5Qiw0Q0FBMEIsQ0FBQTtJQUMxQixtSUFBbUk7SUFDbkksd0VBQXNELENBQUE7SUFDdEQsd0NBQXdDO0lBQ3hDLHdFQUFzRCxDQUFBO0lBQ3RELG9CQUFvQjtJQUNwQixnREFBOEIsQ0FBQTtJQUM5Qix5S0FBeUs7SUFDeksseURBQXVDLENBQUE7SUFDdkMsa0RBQWtEO0lBQ2xELDJEQUF5QyxDQUFBO0lBQ3pDLHFCQUFxQjtJQUNyQiwyQkFBUyxDQUFBO0lBQ1QsbUNBQW1DO0lBQ25DLG9EQUFrQyxDQUFBO0lBQ2xDLG9CQUFvQjtJQUNwQixnREFBOEIsQ0FBQTtJQUM5QixrQ0FBa0M7SUFDbEMsK0JBQWEsQ0FBQTtJQUNiLHlIQUF5SDtJQUN6SCxtRUFBaUQsQ0FBQTtJQUNqRCwrQkFBK0I7SUFDL0IscUVBQW1ELENBQUE7SUFDbkQsZ0VBQWdFO0lBQ2hFLGtEQUFnQyxDQUFBO0lBQ2hDLCtCQUErQjtJQUMvQixxRUFBbUQsQ0FBQTtJQUNuRCx1REFBdUQ7SUFDdkQseUVBQXVELENBQUE7SUFDdkQsZ0dBQWdHO0lBQ2hHLDZGQUEyRSxDQUFBO0lBQzNFLDJCQUEyQjtJQUMzQiw2QkFBVyxDQUFBO0lBQ1gsVUFBVTtJQUNWLDZCQUFXLENBQUE7SUFDWCwwR0FBMEc7SUFDMUcsc0NBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQTdEVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQTZEekIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBJc3N1ZVR5cGVfRW51bSB7XG4gIC8qKiBDb21tYW5kIEluamVjdGlvbiAqL1xuICBDbURpID0gJ0NNRGknLFxuICAvKiogQ29tbWFuZCBJbmplY3Rpb246IHJlbGF0aXZlIHBhdGggY29tbWFuZCAqL1xuICBDbURpUmVsYXRpdmVQYXRoQ29tbWFuZCA9ICdDTURpX3JlbGF0aXZlX3BhdGhfY29tbWFuZCcsXG4gIC8qKiBVc2Ugb2YgZGFuZ2Vyb3VzIGZ1bmN0aW9uICovXG4gIERhbmdlcm91c0Z1bmN0aW9uT3ZlcmZsb3cgPSAnREFOR0VST1VTX0ZVTkNUSU9OX09WRVJGTE9XJyxcbiAgLyoqIEEgZGVuaWFsIG9mIHNlcnZpY2UgYnkgZXhwbG9pdGluZyBzdHJpbmcgYnVpbGRlciAqL1xuICBEb3NTdHJpbmdCdWlsZGVyID0gJ0RPU19TVFJJTkdfQlVJTERFUicsXG4gIC8qKiBHcmFwaFFsIERlcHRoIExpbWl0ICovXG4gIEdyYXBocWxEZXB0aExpbWl0ID0gJ0dSQVBIUUxfREVQVEhfTElNSVQnLFxuICAvKiogSFRUUCBvbmx5IGNvb2tpZSAqL1xuICBIdHRwT25seUNvb2tpZSA9ICdIVFRQX09OTFlfQ09PS0lFJyxcbiAgLyoqIEhUVFAgcmVzcG9uc2Ugc3BsaXR0aW5nICovXG4gIEh0dHBSZXNwb25zZVNwbGl0dGluZyA9ICdIVFRQX1JFU1BPTlNFX1NQTElUVElORycsXG4gIC8qKiBBIGNhc2Ugd2hlcmUgdGhlIHZhbGlkYXRpb24gb24gdGhlIHVybCBpcyBwYXJ0aWFsICovXG4gIEluY29tcGxldGVVcmxTYW5pdGl6YXRpb24gPSAnSU5DT01QTEVURV9VUkxfU0FOSVRJWkFUSU9OJyxcbiAgLyoqIEhUVFAgaW5zZWN1cmUgY29va2llICovXG4gIEluc2VjdXJlQ29va2llID0gJ0lOU0VDVVJFX0NPT0tJRScsXG4gIC8qKiBJbnNlY3VyZSBSYW5kb21uZXNzICovXG4gIEluc2VjdXJlUmFuZG9tbmVzcyA9ICdJTlNFQ1VSRV9SQU5ET01ORVNTJyxcbiAgLyoqIEEgc3RyaW5nIGlzIHVzZWQgaW4gbG9jYWxlIGRlcGVuZGVudCBjb21wYXJpc29uIHdoaWNoIGNhbiBjYXVzZSBidWdzICovXG4gIExvY2FsZURlcGVuZGVudENvbXBhcmlzb24gPSAnTE9DQUxFX0RFUEVOREVOVF9DT01QQVJJU09OJyxcbiAgLyoqIExvZyBGb3JnaW5nIC8gSW5qZWN0aW9uICovXG4gIExvZ0ZvcmdpbmcgPSAnTE9HX0ZPUkdJTkcnLFxuICAvKiogVGhlIHByb2dyYW0gbWlnaHQgZGVyZWZlcmVuY2UgYSBudWxsLXBvaW50ZXIgYmVjYXVzZSBpdCBkb2VzIG5vdCBjaGVjayB0aGUgcmV0dXJuIHZhbHVlIG9mIGEgZnVuY3Rpb24gdGhhdCBtaWdodCByZXR1cm4gbnVsbCAqL1xuICBNaXNzaW5nQ2hlY2tBZ2FpbnN0TnVsbCA9ICdNSVNTSU5HX0NIRUNLX0FHQUlOU1RfTlVMTCcsXG4gIC8qKiBNaXNzaW5nIGVxdWFscyBvciBoYXNoY29kZSBtZXRob2QgKi9cbiAgTWlzc2luZ0VxdWFsc09ySGFzaGNvZGUgPSAnTUlTU0lOR19FUVVBTFNfT1JfSEFTSENPREUnLFxuICAvKiogT3BlbiBSZWRpcmVjdCAqL1xuICBPcGVuUmVkaXJlY3QgPSAnT1BFTl9SRURJUkVDVCcsXG4gIC8qKiBUaGUgY2F0Y2ggYmxvY2sgaGFuZGxlcyBhIGJyb2FkIHN3YXRoIG9mIGV4Y2VwdGlvbnMsIHBvdGVudGlhbGx5IHRyYXBwaW5nIGRpc3NpbWlsYXIgaXNzdWVzIG9yIHByb2JsZW1zIHRoYXQgc2hvdWxkIG5vdCBiZSBkZWFsdCB3aXRoIGF0IHRoaXMgcG9pbnQgaW4gdGhlIHByb2dyYW0gKi9cbiAgT3Zlcmx5QnJvYWRDYXRjaCA9ICdPVkVSTFlfQlJPQURfQ0FUQ0gnLFxuICAvKiogVGhlIGNvZGUgaGFzIGEgcGFzc3dvcmQgc3RvcmVkIGluIGEgY29tbWVudCAqL1xuICBQYXNzd29yZEluQ29tbWVudCA9ICdQQVNTV09SRF9JTl9DT01NRU5UJyxcbiAgLyoqIFBhdGggVHJhdmVyc2FsICovXG4gIFB0ID0gJ1BUJyxcbiAgLyoqIFJlZ3VsYXIgRXhwcmVzc2lvbiBJbmplY3Rpb24gKi9cbiAgUmVnZXhJbmplY3Rpb24gPSAnUkVHRVhfSU5KRUNUSU9OJyxcbiAgLyoqIFNRTCBJbmplY3Rpb24gKi9cbiAgU3FsSW5qZWN0aW9uID0gJ1NRTF9JbmplY3Rpb24nLFxuICAvKiogU2VydmVyIFNpZGUgUmVxdWVzdCBGb3JnZXJ5ICovXG4gIFNzcmYgPSAnU1NSRicsXG4gIC8qKiBSZXZlYWxpbmcgc3lzdGVtIGRhdGEgb3IgZGVidWdnaW5nIGluZm9ybWF0aW9uIGhlbHBzIGFuIGFkdmVyc2FyeSBsZWFybiBhYm91dCB0aGUgc3lzdGVtIGFuZCBmb3JtIGEgcGxhbiBvZiBhdHRhY2sgKi9cbiAgU3lzdGVtSW5mb3JtYXRpb25MZWFrID0gJ1NZU1RFTV9JTkZPUk1BVElPTl9MRUFLJyxcbiAgLyoqIFRydXN0IEJvdW5kYXJ5IFZpb2xhdGlvbiAqL1xuICBUcnVzdEJvdW5kYXJ5VmlvbGF0aW9uID0gJ1RSVVNUX0JPVU5EQVJZX1ZJT0xBVElPTicsXG4gIC8qKiBIVFRQIHJlcXVlc3QgcGFyYW1ldGVyIG1heSBiZSBlaXRoZXIgYW4gYXJyYXkgb3IgYSBzdHJpbmcgKi9cbiAgVHlwZUNvbmZ1c2lvbiA9ICdUWVBFX0NPTkZVU0lPTicsXG4gIC8qKiBVbmNoZWNrZWQgbG9vcCBjb25kaXRpb24gKi9cbiAgVW5jaGVja2VkTG9vcENvbmRpdGlvbiA9ICdVTkNIRUNLRURfTE9PUF9DT05ESVRJT04nLFxuICAvKiogUHJpbnRpbmcgbG9ncyBpbiBhc3NvcnRlZCB3YXkgdG8gdGhlIHN5cyBvdXQvZXJyICovXG4gIFVzZU9mU3lzdGVtT3V0cHV0U3RyZWFtID0gJ1VTRV9PRl9TWVNURU1fT1VUUFVUX1NUUkVBTScsXG4gIC8qKiBVbmJvdW5kZWQgb2NjdXJyZW5jZXMgY2FuIGxlYWQgdG8gcmVzb3VyY2VzIGV4aGF1c3Rpb24gYW5kIHVsdGltYXRlbHkgYSBkZW5pYWwgb2Ygc2VydmljZSAqL1xuICBXZWFrWG1sU2NoZW1hVW5ib3VuZGVkT2NjdXJyZW5jZXMgPSAnV0VBS19YTUxfU0NIRU1BX1VOQk9VTkRFRF9PQ0NVUlJFTkNFUycsXG4gIC8qKiBDcm9zcyBTaXRlIFNjcmlwdGluZyAqL1xuICBYc3MgPSAnWFNTJyxcbiAgLyoqIFhYRSAqL1xuICBYeGUgPSAnWFhFJyxcbiAgLyoqIFppcCBTbGlwIGlzIGEgZm9ybSBvZiBkaXJlY3RvcnkgdHJhdmVyc2FsIHRoYXQgY2FuIGJlIGV4cGxvaXRlZCBieSBleHRyYWN0aW5nIGZpbGVzIGZyb20gYW4gYXJjaGl2ZSAqL1xuICBaaXBTbGlwID0gJ1pJUF9TTElQJyxcbn1cbiJdfQ==