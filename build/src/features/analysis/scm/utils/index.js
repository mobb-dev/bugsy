"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitUrl = exports.getFixUrl = exports.getFixUrlWithRedirect = void 0;
__exportStar(require("./get_issue_type"), exports);
function getFixUrlWithRedirect(params) {
    const { fixId, projectId, organizationId, analysisId, redirectUrl, appBaseUrl, commentId, } = params;
    const searchParams = new URLSearchParams();
    searchParams.append('commit_redirect_url', redirectUrl);
    searchParams.append('comment_id', commentId.toString());
    return `${getFixUrl({
        appBaseUrl,
        fixId,
        projectId,
        organizationId,
        analysisId,
    })}?${searchParams.toString()}`;
}
exports.getFixUrlWithRedirect = getFixUrlWithRedirect;
function getFixUrl({ appBaseUrl, fixId, projectId, organizationId, analysisId, }) {
    return `${appBaseUrl}/organization/${organizationId}/project/${projectId}/report/${analysisId}/fix/${fixId}`;
}
exports.getFixUrl = getFixUrl;
function getCommitUrl(params) {
    const { fixId, projectId, organizationId, analysisId, redirectUrl, appBaseUrl, commentId, } = params;
    const searchParams = new URLSearchParams();
    searchParams.append('redirect_url', redirectUrl);
    searchParams.append('comment_id', commentId.toString());
    return `${getFixUrl({
        appBaseUrl,
        fixId,
        projectId,
        organizationId,
        analysisId,
    })}/commit?${searchParams.toString()}`;
}
exports.getCommitUrl = getCommitUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbURBQWdDO0FBVWhDLFNBQWdCLHFCQUFxQixDQUFDLE1BQXlCO0lBQzdELE1BQU0sRUFDSixLQUFLLEVBQ0wsU0FBUyxFQUNULGNBQWMsRUFDZCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFVBQVUsRUFDVixTQUFTLEdBQ1YsR0FBRyxNQUFNLENBQUE7SUFDVixNQUFNLFlBQVksR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFBO0lBQzFDLFlBQVksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDdkQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFDdkQsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUNsQixVQUFVO1FBQ1YsS0FBSztRQUNMLFNBQVM7UUFDVCxjQUFjO1FBQ2QsVUFBVTtLQUNYLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQTtBQUNqQyxDQUFDO0FBcEJELHNEQW9CQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxFQUN4QixVQUFVLEVBQ1YsS0FBSyxFQUNMLFNBQVMsRUFDVCxjQUFjLEVBQ2QsVUFBVSxHQUNLO0lBQ2YsT0FBTyxHQUFHLFVBQVUsaUJBQWlCLGNBQWMsWUFBWSxTQUFTLFdBQVcsVUFBVSxRQUFRLEtBQUssRUFBRSxDQUFBO0FBQzlHLENBQUM7QUFSRCw4QkFRQztBQU1ELFNBQWdCLFlBQVksQ0FBQyxNQUF5QjtJQUNwRCxNQUFNLEVBQ0osS0FBSyxFQUNMLFNBQVMsRUFDVCxjQUFjLEVBQ2QsVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsU0FBUyxHQUNWLEdBQUcsTUFBTSxDQUFBO0lBQ1YsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQTtJQUMxQyxZQUFZLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUNoRCxZQUFZLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUN2RCxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ2xCLFVBQVU7UUFDVixLQUFLO1FBQ0wsU0FBUztRQUNULGNBQWM7UUFDZCxVQUFVO0tBQ1gsQ0FBQyxXQUFXLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFBO0FBQ3hDLENBQUM7QUFwQkQsb0NBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9nZXRfaXNzdWVfdHlwZSdcblxudHlwZSBHZXRGaXhVcmxQYXJhbSA9IHtcbiAgYXBwQmFzZVVybDogc3RyaW5nXG4gIGZpeElkOiBzdHJpbmdcbiAgcHJvamVjdElkOiBzdHJpbmdcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZ1xuICBhbmFseXNpc0lkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpeFVybFdpdGhSZWRpcmVjdChwYXJhbXM6IEdldENvbW1pdFVybFBhcmFtKSB7XG4gIGNvbnN0IHtcbiAgICBmaXhJZCxcbiAgICBwcm9qZWN0SWQsXG4gICAgb3JnYW5pemF0aW9uSWQsXG4gICAgYW5hbHlzaXNJZCxcbiAgICByZWRpcmVjdFVybCxcbiAgICBhcHBCYXNlVXJsLFxuICAgIGNvbW1lbnRJZCxcbiAgfSA9IHBhcmFtc1xuICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKClcbiAgc2VhcmNoUGFyYW1zLmFwcGVuZCgnY29tbWl0X3JlZGlyZWN0X3VybCcsIHJlZGlyZWN0VXJsKVxuICBzZWFyY2hQYXJhbXMuYXBwZW5kKCdjb21tZW50X2lkJywgY29tbWVudElkLnRvU3RyaW5nKCkpXG4gIHJldHVybiBgJHtnZXRGaXhVcmwoe1xuICAgIGFwcEJhc2VVcmwsXG4gICAgZml4SWQsXG4gICAgcHJvamVjdElkLFxuICAgIG9yZ2FuaXphdGlvbklkLFxuICAgIGFuYWx5c2lzSWQsXG4gIH0pfT8ke3NlYXJjaFBhcmFtcy50b1N0cmluZygpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpeFVybCh7XG4gIGFwcEJhc2VVcmwsXG4gIGZpeElkLFxuICBwcm9qZWN0SWQsXG4gIG9yZ2FuaXphdGlvbklkLFxuICBhbmFseXNpc0lkLFxufTogR2V0Rml4VXJsUGFyYW0pIHtcbiAgcmV0dXJuIGAke2FwcEJhc2VVcmx9L29yZ2FuaXphdGlvbi8ke29yZ2FuaXphdGlvbklkfS9wcm9qZWN0LyR7cHJvamVjdElkfS9yZXBvcnQvJHthbmFseXNpc0lkfS9maXgvJHtmaXhJZH1gXG59XG5cbnR5cGUgR2V0Q29tbWl0VXJsUGFyYW0gPSBHZXRGaXhVcmxQYXJhbSAmIHtcbiAgcmVkaXJlY3RVcmw6IHN0cmluZ1xuICBjb21tZW50SWQ6IG51bWJlclxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdFVybChwYXJhbXM6IEdldENvbW1pdFVybFBhcmFtKSB7XG4gIGNvbnN0IHtcbiAgICBmaXhJZCxcbiAgICBwcm9qZWN0SWQsXG4gICAgb3JnYW5pemF0aW9uSWQsXG4gICAgYW5hbHlzaXNJZCxcbiAgICByZWRpcmVjdFVybCxcbiAgICBhcHBCYXNlVXJsLFxuICAgIGNvbW1lbnRJZCxcbiAgfSA9IHBhcmFtc1xuICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKClcbiAgc2VhcmNoUGFyYW1zLmFwcGVuZCgncmVkaXJlY3RfdXJsJywgcmVkaXJlY3RVcmwpXG4gIHNlYXJjaFBhcmFtcy5hcHBlbmQoJ2NvbW1lbnRfaWQnLCBjb21tZW50SWQudG9TdHJpbmcoKSlcbiAgcmV0dXJuIGAke2dldEZpeFVybCh7XG4gICAgYXBwQmFzZVVybCxcbiAgICBmaXhJZCxcbiAgICBwcm9qZWN0SWQsXG4gICAgb3JnYW5pemF0aW9uSWQsXG4gICAgYW5hbHlzaXNJZCxcbiAgfSl9L2NvbW1pdD8ke3NlYXJjaFBhcmFtcy50b1N0cmluZygpfWBcbn1cbiJdfQ==