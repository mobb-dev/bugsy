"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_A_REPOSITORY_PUBLIC_KEY = exports.CREATE_OR_UPDATE_A_REPOSITORY_SECRET = exports.GET_COMMENT_PATH = exports.DELETE_GENERAL_PR_COMMENT = exports.GET_GENERAL_PR_COMMENTS = exports.POST_GENERAL_PR_COMMENT = exports.GET_PR = exports.REPLY_TO_CODE_REVIEW_COMMENT_PATH = exports.GET_PR_COMMENT_PATH = exports.GET_PR_COMMENTS_PATH = exports.UPDATE_COMMENT_PATH = exports.DELETE_COMMENT_PATH = exports.POST_COMMENT_PATH = void 0;
exports.POST_COMMENT_PATH = 'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments';
exports.DELETE_COMMENT_PATH = 'DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}';
exports.UPDATE_COMMENT_PATH = 'PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}';
exports.GET_PR_COMMENTS_PATH = 'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments';
exports.GET_PR_COMMENT_PATH = 'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}';
exports.REPLY_TO_CODE_REVIEW_COMMENT_PATH = 'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies';
exports.GET_PR = 'GET /repos/{owner}/{repo}/pulls/{pull_number}';
exports.POST_GENERAL_PR_COMMENT = 'POST /repos/{owner}/{repo}/issues/{issue_number}/comments';
exports.GET_GENERAL_PR_COMMENTS = 'GET /repos/{owner}/{repo}/issues/{issue_number}/comments';
exports.DELETE_GENERAL_PR_COMMENT = 'DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}';
exports.GET_COMMENT_PATH = 'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}';
exports.CREATE_OR_UPDATE_A_REPOSITORY_SECRET = 'PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}';
exports.GET_A_REPOSITORY_PUBLIC_KEY = 'GET /repos/{owner}/{repo}/actions/secrets/public-key';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2FuYWx5c2lzL3NjbS9naXRodWIvY29uc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsaUJBQWlCLEdBQzVCLHlEQUF5RCxDQUFBO0FBRTlDLFFBQUEsbUJBQW1CLEdBQzlCLDBEQUEwRCxDQUFBO0FBRS9DLFFBQUEsbUJBQW1CLEdBQzlCLHlEQUF5RCxDQUFBO0FBRTlDLFFBQUEsb0JBQW9CLEdBQy9CLHdEQUF3RCxDQUFBO0FBQzdDLFFBQUEsbUJBQW1CLEdBQzlCLHVEQUF1RCxDQUFBO0FBRTVDLFFBQUEsaUNBQWlDLEdBQzVDLDhFQUE4RSxDQUFBO0FBRW5FLFFBQUEsTUFBTSxHQUFHLCtDQUErQyxDQUFBO0FBQ3hELFFBQUEsdUJBQXVCLEdBQ2xDLDJEQUEyRCxDQUFBO0FBRWhELFFBQUEsdUJBQXVCLEdBQ2xDLDBEQUEwRCxDQUFBO0FBRS9DLFFBQUEseUJBQXlCLEdBQ3BDLDJEQUEyRCxDQUFBO0FBRWhELFFBQUEsZ0JBQWdCLEdBQzNCLHVEQUF1RCxDQUFBO0FBRTVDLFFBQUEsb0NBQW9DLEdBQy9DLHlEQUF5RCxDQUFBO0FBRTlDLFFBQUEsMkJBQTJCLEdBQ3RDLHNEQUFzRCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFBPU1RfQ09NTUVOVF9QQVRIID1cbiAgJ1BPU1QgL3JlcG9zL3tvd25lcn0ve3JlcG99L3B1bGxzL3twdWxsX251bWJlcn0vY29tbWVudHMnXG5cbmV4cG9ydCBjb25zdCBERUxFVEVfQ09NTUVOVF9QQVRIID1cbiAgJ0RFTEVURSAvcmVwb3Mve293bmVyfS97cmVwb30vcHVsbHMvY29tbWVudHMve2NvbW1lbnRfaWR9J1xuXG5leHBvcnQgY29uc3QgVVBEQVRFX0NPTU1FTlRfUEFUSCA9XG4gICdQQVRDSCAvcmVwb3Mve293bmVyfS97cmVwb30vcHVsbHMvY29tbWVudHMve2NvbW1lbnRfaWR9J1xuXG5leHBvcnQgY29uc3QgR0VUX1BSX0NPTU1FTlRTX1BBVEggPVxuICAnR0VUIC9yZXBvcy97b3duZXJ9L3tyZXBvfS9wdWxscy97cHVsbF9udW1iZXJ9L2NvbW1lbnRzJ1xuZXhwb3J0IGNvbnN0IEdFVF9QUl9DT01NRU5UX1BBVEggPVxuICAnR0VUIC9yZXBvcy97b3duZXJ9L3tyZXBvfS9wdWxscy9jb21tZW50cy97Y29tbWVudF9pZH0nXG5cbmV4cG9ydCBjb25zdCBSRVBMWV9UT19DT0RFX1JFVklFV19DT01NRU5UX1BBVEggPVxuICAnUE9TVCAvcmVwb3Mve293bmVyfS97cmVwb30vcHVsbHMve3B1bGxfbnVtYmVyfS9jb21tZW50cy97Y29tbWVudF9pZH0vcmVwbGllcydcblxuZXhwb3J0IGNvbnN0IEdFVF9QUiA9ICdHRVQgL3JlcG9zL3tvd25lcn0ve3JlcG99L3B1bGxzL3twdWxsX251bWJlcn0nXG5leHBvcnQgY29uc3QgUE9TVF9HRU5FUkFMX1BSX0NPTU1FTlQgPVxuICAnUE9TVCAvcmVwb3Mve293bmVyfS97cmVwb30vaXNzdWVzL3tpc3N1ZV9udW1iZXJ9L2NvbW1lbnRzJ1xuXG5leHBvcnQgY29uc3QgR0VUX0dFTkVSQUxfUFJfQ09NTUVOVFMgPVxuICAnR0VUIC9yZXBvcy97b3duZXJ9L3tyZXBvfS9pc3N1ZXMve2lzc3VlX251bWJlcn0vY29tbWVudHMnXG5cbmV4cG9ydCBjb25zdCBERUxFVEVfR0VORVJBTF9QUl9DT01NRU5UID1cbiAgJ0RFTEVURSAvcmVwb3Mve293bmVyfS97cmVwb30vaXNzdWVzL2NvbW1lbnRzL3tjb21tZW50X2lkfSdcblxuZXhwb3J0IGNvbnN0IEdFVF9DT01NRU5UX1BBVEggPVxuICAnR0VUIC9yZXBvcy97b3duZXJ9L3tyZXBvfS9wdWxscy9jb21tZW50cy97Y29tbWVudF9pZH0nXG5cbmV4cG9ydCBjb25zdCBDUkVBVEVfT1JfVVBEQVRFX0FfUkVQT1NJVE9SWV9TRUNSRVQgPVxuICAnUFVUIC9yZXBvcy97b3duZXJ9L3tyZXBvfS9hY3Rpb25zL3NlY3JldHMve3NlY3JldF9uYW1lfSdcblxuZXhwb3J0IGNvbnN0IEdFVF9BX1JFUE9TSVRPUllfUFVCTElDX0tFWSA9XG4gICdHRVQgL3JlcG9zL3tvd25lcn0ve3JlcG99L2FjdGlvbnMvc2VjcmV0cy9wdWJsaWMta2V5J1xuIl19