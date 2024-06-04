"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueType = void 0;
const types_1 = require("../types");
const getIssueType = (issueType) => {
    switch (issueType) {
        case types_1.IssueType_Enum.SqlInjection:
            return 'SQL Injection';
        case types_1.IssueType_Enum.CmDiRelativePathCommand:
            return 'Relative Path Command Injection';
        case types_1.IssueType_Enum.CmDi:
            return 'Command Injection';
        case types_1.IssueType_Enum.Xxe:
            return 'XXE';
        case types_1.IssueType_Enum.Xss:
            return 'XSS';
        case types_1.IssueType_Enum.Pt:
            return 'Path Traversal';
        case types_1.IssueType_Enum.ZipSlip:
            return 'Zip Slip';
        case types_1.IssueType_Enum.InsecureRandomness:
            return 'Insecure Randomness';
        case types_1.IssueType_Enum.Ssrf:
            return 'Server Side Request Forgery';
        case types_1.IssueType_Enum.TypeConfusion:
            return 'Type Confusion';
        case types_1.IssueType_Enum.RegexInjection:
            return 'Regular Expression Injection';
        case types_1.IssueType_Enum.IncompleteUrlSanitization:
            return 'Incomplete URL Sanitization';
        case types_1.IssueType_Enum.LogForging:
            return 'Log Forging';
        case types_1.IssueType_Enum.LocaleDependentComparison:
            return 'Locale Dependent Comparison';
        case types_1.IssueType_Enum.MissingCheckAgainstNull:
            return 'Missing Check against Null';
        case types_1.IssueType_Enum.PasswordInComment:
            return 'Password in Comment';
        case types_1.IssueType_Enum.OverlyBroadCatch:
            return 'Poor Error Handling: Overly Broad Catch';
        case types_1.IssueType_Enum.UseOfSystemOutputStream:
            return 'Use of System.out/System.err';
        case types_1.IssueType_Enum.DangerousFunctionOverflow:
            return 'Use of dangerous function';
        case types_1.IssueType_Enum.DosStringBuilder:
            return 'Denial of Service: StringBuilder';
        case types_1.IssueType_Enum.OpenRedirect:
            return 'Open Redirect';
        case types_1.IssueType_Enum.WeakXmlSchemaUnboundedOccurrences:
            return 'Weak XML Schema: Unbounded Occurrences';
        case types_1.IssueType_Enum.SystemInformationLeak:
            return 'System Information Leak';
        case types_1.IssueType_Enum.HttpResponseSplitting:
            return 'HTTP response splitting';
        case types_1.IssueType_Enum.HttpOnlyCookie:
            return 'Cookie is not HttpOnly';
        case types_1.IssueType_Enum.InsecureCookie:
            return 'Insecure Cookie';
        case types_1.IssueType_Enum.TrustBoundaryViolation:
            return 'Trust Boundary Violation';
        case types_1.IssueType_Enum.MissingEqualsOrHashcode:
            return 'Missing equals or hashcode method';
        default: {
            return issueType ? issueType.replaceAll('_', ' ') : 'Other';
        }
    }
};
exports.getIssueType = getIssueType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X2lzc3VlX3R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL3V0aWxzL2dldF9pc3N1ZV90eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9DQUF5QztBQUVsQyxNQUFNLFlBQVksR0FBRyxDQUFDLFNBQXdCLEVBQVUsRUFBRTtJQUMvRCxRQUFRLFNBQVMsRUFBRTtRQUNqQixLQUFLLHNCQUFjLENBQUMsWUFBWTtZQUM5QixPQUFPLGVBQWUsQ0FBQTtRQUN4QixLQUFLLHNCQUFjLENBQUMsdUJBQXVCO1lBQ3pDLE9BQU8saUNBQWlDLENBQUE7UUFDMUMsS0FBSyxzQkFBYyxDQUFDLElBQUk7WUFDdEIsT0FBTyxtQkFBbUIsQ0FBQTtRQUM1QixLQUFLLHNCQUFjLENBQUMsR0FBRztZQUNyQixPQUFPLEtBQUssQ0FBQTtRQUNkLEtBQUssc0JBQWMsQ0FBQyxHQUFHO1lBQ3JCLE9BQU8sS0FBSyxDQUFBO1FBQ2QsS0FBSyxzQkFBYyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxnQkFBZ0IsQ0FBQTtRQUN6QixLQUFLLHNCQUFjLENBQUMsT0FBTztZQUN6QixPQUFPLFVBQVUsQ0FBQTtRQUNuQixLQUFLLHNCQUFjLENBQUMsa0JBQWtCO1lBQ3BDLE9BQU8scUJBQXFCLENBQUE7UUFDOUIsS0FBSyxzQkFBYyxDQUFDLElBQUk7WUFDdEIsT0FBTyw2QkFBNkIsQ0FBQTtRQUN0QyxLQUFLLHNCQUFjLENBQUMsYUFBYTtZQUMvQixPQUFPLGdCQUFnQixDQUFBO1FBQ3pCLEtBQUssc0JBQWMsQ0FBQyxjQUFjO1lBQ2hDLE9BQU8sOEJBQThCLENBQUE7UUFDdkMsS0FBSyxzQkFBYyxDQUFDLHlCQUF5QjtZQUMzQyxPQUFPLDZCQUE2QixDQUFBO1FBQ3RDLEtBQUssc0JBQWMsQ0FBQyxVQUFVO1lBQzVCLE9BQU8sYUFBYSxDQUFBO1FBQ3RCLEtBQUssc0JBQWMsQ0FBQyx5QkFBeUI7WUFDM0MsT0FBTyw2QkFBNkIsQ0FBQTtRQUN0QyxLQUFLLHNCQUFjLENBQUMsdUJBQXVCO1lBQ3pDLE9BQU8sNEJBQTRCLENBQUE7UUFDckMsS0FBSyxzQkFBYyxDQUFDLGlCQUFpQjtZQUNuQyxPQUFPLHFCQUFxQixDQUFBO1FBQzlCLEtBQUssc0JBQWMsQ0FBQyxnQkFBZ0I7WUFDbEMsT0FBTyx5Q0FBeUMsQ0FBQTtRQUNsRCxLQUFLLHNCQUFjLENBQUMsdUJBQXVCO1lBQ3pDLE9BQU8sOEJBQThCLENBQUE7UUFDdkMsS0FBSyxzQkFBYyxDQUFDLHlCQUF5QjtZQUMzQyxPQUFPLDJCQUEyQixDQUFBO1FBQ3BDLEtBQUssc0JBQWMsQ0FBQyxnQkFBZ0I7WUFDbEMsT0FBTyxrQ0FBa0MsQ0FBQTtRQUMzQyxLQUFLLHNCQUFjLENBQUMsWUFBWTtZQUM5QixPQUFPLGVBQWUsQ0FBQTtRQUN4QixLQUFLLHNCQUFjLENBQUMsaUNBQWlDO1lBQ25ELE9BQU8sd0NBQXdDLENBQUE7UUFDakQsS0FBSyxzQkFBYyxDQUFDLHFCQUFxQjtZQUN2QyxPQUFPLHlCQUF5QixDQUFBO1FBQ2xDLEtBQUssc0JBQWMsQ0FBQyxxQkFBcUI7WUFDdkMsT0FBTyx5QkFBeUIsQ0FBQTtRQUNsQyxLQUFLLHNCQUFjLENBQUMsY0FBYztZQUNoQyxPQUFPLHdCQUF3QixDQUFBO1FBQ2pDLEtBQUssc0JBQWMsQ0FBQyxjQUFjO1lBQ2hDLE9BQU8saUJBQWlCLENBQUE7UUFDMUIsS0FBSyxzQkFBYyxDQUFDLHNCQUFzQjtZQUN4QyxPQUFPLDBCQUEwQixDQUFBO1FBQ25DLEtBQUssc0JBQWMsQ0FBQyx1QkFBdUI7WUFDekMsT0FBTyxtQ0FBbUMsQ0FBQTtRQUM1QyxPQUFPLENBQUMsQ0FBQztZQUNQLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1NBQzVEO0tBQ0Y7QUFDSCxDQUFDLENBQUE7QUE5RFksUUFBQSxZQUFZLGdCQThEeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJc3N1ZVR5cGVfRW51bSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgZ2V0SXNzdWVUeXBlID0gKGlzc3VlVHlwZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gIHN3aXRjaCAoaXNzdWVUeXBlKSB7XG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5TcWxJbmplY3Rpb246XG4gICAgICByZXR1cm4gJ1NRTCBJbmplY3Rpb24nXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5DbURpUmVsYXRpdmVQYXRoQ29tbWFuZDpcbiAgICAgIHJldHVybiAnUmVsYXRpdmUgUGF0aCBDb21tYW5kIEluamVjdGlvbidcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLkNtRGk6XG4gICAgICByZXR1cm4gJ0NvbW1hbmQgSW5qZWN0aW9uJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uWHhlOlxuICAgICAgcmV0dXJuICdYWEUnXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5Yc3M6XG4gICAgICByZXR1cm4gJ1hTUydcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLlB0OlxuICAgICAgcmV0dXJuICdQYXRoIFRyYXZlcnNhbCdcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLlppcFNsaXA6XG4gICAgICByZXR1cm4gJ1ppcCBTbGlwJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uSW5zZWN1cmVSYW5kb21uZXNzOlxuICAgICAgcmV0dXJuICdJbnNlY3VyZSBSYW5kb21uZXNzJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uU3NyZjpcbiAgICAgIHJldHVybiAnU2VydmVyIFNpZGUgUmVxdWVzdCBGb3JnZXJ5J1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uVHlwZUNvbmZ1c2lvbjpcbiAgICAgIHJldHVybiAnVHlwZSBDb25mdXNpb24nXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5SZWdleEluamVjdGlvbjpcbiAgICAgIHJldHVybiAnUmVndWxhciBFeHByZXNzaW9uIEluamVjdGlvbidcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLkluY29tcGxldGVVcmxTYW5pdGl6YXRpb246XG4gICAgICByZXR1cm4gJ0luY29tcGxldGUgVVJMIFNhbml0aXphdGlvbidcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLkxvZ0Zvcmdpbmc6XG4gICAgICByZXR1cm4gJ0xvZyBGb3JnaW5nJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uTG9jYWxlRGVwZW5kZW50Q29tcGFyaXNvbjpcbiAgICAgIHJldHVybiAnTG9jYWxlIERlcGVuZGVudCBDb21wYXJpc29uJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uTWlzc2luZ0NoZWNrQWdhaW5zdE51bGw6XG4gICAgICByZXR1cm4gJ01pc3NpbmcgQ2hlY2sgYWdhaW5zdCBOdWxsJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uUGFzc3dvcmRJbkNvbW1lbnQ6XG4gICAgICByZXR1cm4gJ1Bhc3N3b3JkIGluIENvbW1lbnQnXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5PdmVybHlCcm9hZENhdGNoOlxuICAgICAgcmV0dXJuICdQb29yIEVycm9yIEhhbmRsaW5nOiBPdmVybHkgQnJvYWQgQ2F0Y2gnXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5Vc2VPZlN5c3RlbU91dHB1dFN0cmVhbTpcbiAgICAgIHJldHVybiAnVXNlIG9mIFN5c3RlbS5vdXQvU3lzdGVtLmVycidcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLkRhbmdlcm91c0Z1bmN0aW9uT3ZlcmZsb3c6XG4gICAgICByZXR1cm4gJ1VzZSBvZiBkYW5nZXJvdXMgZnVuY3Rpb24nXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5Eb3NTdHJpbmdCdWlsZGVyOlxuICAgICAgcmV0dXJuICdEZW5pYWwgb2YgU2VydmljZTogU3RyaW5nQnVpbGRlcidcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLk9wZW5SZWRpcmVjdDpcbiAgICAgIHJldHVybiAnT3BlbiBSZWRpcmVjdCdcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLldlYWtYbWxTY2hlbWFVbmJvdW5kZWRPY2N1cnJlbmNlczpcbiAgICAgIHJldHVybiAnV2VhayBYTUwgU2NoZW1hOiBVbmJvdW5kZWQgT2NjdXJyZW5jZXMnXG4gICAgY2FzZSBJc3N1ZVR5cGVfRW51bS5TeXN0ZW1JbmZvcm1hdGlvbkxlYWs6XG4gICAgICByZXR1cm4gJ1N5c3RlbSBJbmZvcm1hdGlvbiBMZWFrJ1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uSHR0cFJlc3BvbnNlU3BsaXR0aW5nOlxuICAgICAgcmV0dXJuICdIVFRQIHJlc3BvbnNlIHNwbGl0dGluZydcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLkh0dHBPbmx5Q29va2llOlxuICAgICAgcmV0dXJuICdDb29raWUgaXMgbm90IEh0dHBPbmx5J1xuICAgIGNhc2UgSXNzdWVUeXBlX0VudW0uSW5zZWN1cmVDb29raWU6XG4gICAgICByZXR1cm4gJ0luc2VjdXJlIENvb2tpZSdcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLlRydXN0Qm91bmRhcnlWaW9sYXRpb246XG4gICAgICByZXR1cm4gJ1RydXN0IEJvdW5kYXJ5IFZpb2xhdGlvbidcbiAgICBjYXNlIElzc3VlVHlwZV9FbnVtLk1pc3NpbmdFcXVhbHNPckhhc2hjb2RlOlxuICAgICAgcmV0dXJuICdNaXNzaW5nIGVxdWFscyBvciBoYXNoY29kZSBtZXRob2QnXG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIGlzc3VlVHlwZSA/IGlzc3VlVHlwZS5yZXBsYWNlQWxsKCdfJywgJyAnKSA6ICdPdGhlcidcbiAgICB9XG4gIH1cbn1cbiJdfQ==