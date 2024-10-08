"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitFixesResponseMessageZ = exports.SubmitFixesToDifferentBranchResponseMessageZ = exports.SubmitFixesToSameBranchResponseMessageZ = exports.SubmitFixesBaseResponseMessageZ = exports.SubmitFixesMessageZ = exports.SubmitFixesToDifferentBranchParamsZ = exports.CommitToSameBranchParamsZ = exports.submitToScmMessageType = void 0;
const zod_1 = require("zod");
const BaseSubmitToScmMessageZ = zod_1.z.object({
    submitFixRequestId: zod_1.z.string().uuid(),
    fixes: zod_1.z.array(zod_1.z.object({
        fixId: zod_1.z.string().uuid(),
        diff: zod_1.z.string(),
    })),
    commitHash: zod_1.z.string(),
    repoUrl: zod_1.z.string(),
});
exports.submitToScmMessageType = {
    commitToSameBranch: 'commitToSameBranch',
    submitFixesForDifferentBranch: 'submitFixesForDifferentBranch',
};
exports.CommitToSameBranchParamsZ = BaseSubmitToScmMessageZ.merge(zod_1.z.object({
    type: zod_1.z.literal(exports.submitToScmMessageType.commitToSameBranch),
    branch: zod_1.z.string(),
    commitMessage: zod_1.z.string(),
    commitDescription: zod_1.z.string().nullish(),
    githubCommentId: zod_1.z.number().nullish(),
}));
exports.SubmitFixesToDifferentBranchParamsZ = zod_1.z
    .object({
    type: zod_1.z.literal(exports.submitToScmMessageType.submitFixesForDifferentBranch),
    submitBranch: zod_1.z.string(),
    baseBranch: zod_1.z.string(),
})
    .merge(BaseSubmitToScmMessageZ);
exports.SubmitFixesMessageZ = zod_1.z.union([
    exports.CommitToSameBranchParamsZ,
    exports.SubmitFixesToDifferentBranchParamsZ,
]);
const FixResponseArrayZ = zod_1.z.array(zod_1.z.object({
    fixId: zod_1.z.string().uuid(),
}));
exports.SubmitFixesBaseResponseMessageZ = zod_1.z.object({
    submitFixRequestId: zod_1.z.string().uuid(),
    submitBranches: zod_1.z.array(zod_1.z.object({
        branchName: zod_1.z.string(),
        fixes: FixResponseArrayZ,
    })),
    error: zod_1.z
        .object({
        type: zod_1.z.enum([
            'InitialRepoAccessError',
            'PushBranchError',
            'UnknownError',
        ]),
        info: zod_1.z.object({
            message: zod_1.z.string(),
            pushBranchName: zod_1.z.string().optional(),
        }),
    })
        .optional(),
});
exports.SubmitFixesToSameBranchResponseMessageZ = zod_1.z
    .object({
    type: zod_1.z.literal(exports.submitToScmMessageType.commitToSameBranch),
    githubCommentId: zod_1.z.number().nullish(),
})
    .merge(exports.SubmitFixesBaseResponseMessageZ);
exports.SubmitFixesToDifferentBranchResponseMessageZ = zod_1.z
    .object({
    type: zod_1.z.literal(exports.submitToScmMessageType.submitFixesForDifferentBranch),
    githubCommentId: zod_1.z.number().optional(),
})
    .merge(exports.SubmitFixesBaseResponseMessageZ);
exports.SubmitFixesResponseMessageZ = zod_1.z.discriminatedUnion('type', [
    exports.SubmitFixesToSameBranchResponseMessageZ,
    exports.SubmitFixesToDifferentBranchResponseMessageZ,
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL3NjbVN1Ym1pdC90eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUI7QUFFdkIsTUFBTSx1QkFBdUIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLGtCQUFrQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUU7SUFDckMsS0FBSyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQ1osT0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNQLEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFO1FBQ3hCLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0tBQ2pCLENBQUMsQ0FDSDtJQUNELFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQ3RCLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0NBQ3BCLENBQUMsQ0FBQTtBQUVXLFFBQUEsc0JBQXNCLEdBQUc7SUFDcEMsa0JBQWtCLEVBQUUsb0JBQW9CO0lBQ3hDLDZCQUE2QixFQUFFLCtCQUErQjtDQUN0RCxDQUFBO0FBRUcsUUFBQSx5QkFBeUIsR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQ3BFLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsT0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQztJQUMxRCxNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNsQixhQUFhLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUN6QixpQkFBaUIsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFO0lBQ3ZDLGVBQWUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFO0NBQ3RDLENBQUMsQ0FDSCxDQUFBO0FBRVksUUFBQSxtQ0FBbUMsR0FBRyxPQUFDO0tBQ2pELE1BQU0sQ0FBQztJQUNOLElBQUksRUFBRSxPQUFDLENBQUMsT0FBTyxDQUFDLDhCQUFzQixDQUFDLDZCQUE2QixDQUFDO0lBQ3JFLFlBQVksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQ3hCLFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0NBQ3ZCLENBQUM7S0FDRCxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNwQixRQUFBLG1CQUFtQixHQUFHLE9BQUMsQ0FBQyxLQUFLLENBQUM7SUFDekMsaUNBQXlCO0lBQ3pCLDJDQUFtQztDQUNwQyxDQUFDLENBQUE7QUFPRixNQUFNLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxLQUFLLENBQy9CLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDUCxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRTtDQUN6QixDQUFDLENBQ0gsQ0FBQTtBQUdZLFFBQUEsK0JBQStCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0RCxrQkFBa0IsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFO0lBQ3JDLGNBQWMsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUNyQixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDdEIsS0FBSyxFQUFFLGlCQUFpQjtLQUN6QixDQUFDLENBQ0g7SUFDRCxLQUFLLEVBQUUsT0FBQztTQUNMLE1BQU0sQ0FBQztRQUNOLElBQUksRUFBRSxPQUFDLENBQUMsSUFBSSxDQUFDO1lBQ1gsd0JBQXdCO1lBQ3hCLGlCQUFpQjtZQUNqQixjQUFjO1NBQ2YsQ0FBQztRQUNGLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDO1lBQ2IsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7WUFDbkIsY0FBYyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7U0FDdEMsQ0FBQztLQUNILENBQUM7U0FDRCxRQUFRLEVBQUU7Q0FDZCxDQUFDLENBQUE7QUFFVyxRQUFBLHVDQUF1QyxHQUFHLE9BQUM7S0FDckQsTUFBTSxDQUFDO0lBQ04sSUFBSSxFQUFFLE9BQUMsQ0FBQyxPQUFPLENBQUMsOEJBQXNCLENBQUMsa0JBQWtCLENBQUM7SUFDMUQsZUFBZSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUU7Q0FDdEMsQ0FBQztLQUNELEtBQUssQ0FBQyx1Q0FBK0IsQ0FBQyxDQUFBO0FBSzVCLFFBQUEsNENBQTRDLEdBQUcsT0FBQztLQUMxRCxNQUFNLENBQUM7SUFDTixJQUFJLEVBQUUsT0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBc0IsQ0FBQyw2QkFBNkIsQ0FBQztJQUNyRSxlQUFlLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUN2QyxDQUFDO0tBQ0QsS0FBSyxDQUFDLHVDQUErQixDQUFDLENBQUE7QUFNNUIsUUFBQSwyQkFBMkIsR0FBRyxPQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO0lBQ3RFLCtDQUF1QztJQUN2QyxvREFBNEM7Q0FDN0MsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcblxuY29uc3QgQmFzZVN1Ym1pdFRvU2NtTWVzc2FnZVogPSB6Lm9iamVjdCh7XG4gIHN1Ym1pdEZpeFJlcXVlc3RJZDogei5zdHJpbmcoKS51dWlkKCksXG4gIGZpeGVzOiB6LmFycmF5KFxuICAgIHoub2JqZWN0KHtcbiAgICAgIGZpeElkOiB6LnN0cmluZygpLnV1aWQoKSxcbiAgICAgIGRpZmY6IHouc3RyaW5nKCksXG4gICAgfSlcbiAgKSxcbiAgY29tbWl0SGFzaDogei5zdHJpbmcoKSxcbiAgcmVwb1VybDogei5zdHJpbmcoKSxcbn0pXG5cbmV4cG9ydCBjb25zdCBzdWJtaXRUb1NjbU1lc3NhZ2VUeXBlID0ge1xuICBjb21taXRUb1NhbWVCcmFuY2g6ICdjb21taXRUb1NhbWVCcmFuY2gnLFxuICBzdWJtaXRGaXhlc0ZvckRpZmZlcmVudEJyYW5jaDogJ3N1Ym1pdEZpeGVzRm9yRGlmZmVyZW50QnJhbmNoJyxcbn0gYXMgY29uc3RcblxuZXhwb3J0IGNvbnN0IENvbW1pdFRvU2FtZUJyYW5jaFBhcmFtc1ogPSBCYXNlU3VibWl0VG9TY21NZXNzYWdlWi5tZXJnZShcbiAgei5vYmplY3Qoe1xuICAgIHR5cGU6IHoubGl0ZXJhbChzdWJtaXRUb1NjbU1lc3NhZ2VUeXBlLmNvbW1pdFRvU2FtZUJyYW5jaCksXG4gICAgYnJhbmNoOiB6LnN0cmluZygpLFxuICAgIGNvbW1pdE1lc3NhZ2U6IHouc3RyaW5nKCksXG4gICAgY29tbWl0RGVzY3JpcHRpb246IHouc3RyaW5nKCkubnVsbGlzaCgpLFxuICAgIGdpdGh1YkNvbW1lbnRJZDogei5udW1iZXIoKS5udWxsaXNoKCksXG4gIH0pXG4pXG5cbmV4cG9ydCBjb25zdCBTdWJtaXRGaXhlc1RvRGlmZmVyZW50QnJhbmNoUGFyYW1zWiA9IHpcbiAgLm9iamVjdCh7XG4gICAgdHlwZTogei5saXRlcmFsKHN1Ym1pdFRvU2NtTWVzc2FnZVR5cGUuc3VibWl0Rml4ZXNGb3JEaWZmZXJlbnRCcmFuY2gpLFxuICAgIHN1Ym1pdEJyYW5jaDogei5zdHJpbmcoKSxcbiAgICBiYXNlQnJhbmNoOiB6LnN0cmluZygpLFxuICB9KVxuICAubWVyZ2UoQmFzZVN1Ym1pdFRvU2NtTWVzc2FnZVopXG5leHBvcnQgY29uc3QgU3VibWl0Rml4ZXNNZXNzYWdlWiA9IHoudW5pb24oW1xuICBDb21taXRUb1NhbWVCcmFuY2hQYXJhbXNaLFxuICBTdWJtaXRGaXhlc1RvRGlmZmVyZW50QnJhbmNoUGFyYW1zWixcbl0pXG5leHBvcnQgdHlwZSBTdWJtaXRGaXhlc01lc3NhZ2UgPSB6LmluZmVyPHR5cGVvZiBTdWJtaXRGaXhlc01lc3NhZ2VaPlxuZXhwb3J0IHR5cGUgQ29tbWl0VG9TYW1lQnJhbmNoUGFyYW1zID0gei5pbmZlcjx0eXBlb2YgQ29tbWl0VG9TYW1lQnJhbmNoUGFyYW1zWj5cbmV4cG9ydCB0eXBlIFN1Ym1pdEZpeGVzVG9EaWZmZXJlbnRCcmFuY2hQYXJhbXMgPSB6LmluZmVyPFxuICB0eXBlb2YgU3VibWl0Rml4ZXNUb0RpZmZlcmVudEJyYW5jaFBhcmFtc1pcbj5cblxuY29uc3QgRml4UmVzcG9uc2VBcnJheVogPSB6LmFycmF5KFxuICB6Lm9iamVjdCh7XG4gICAgZml4SWQ6IHouc3RyaW5nKCkudXVpZCgpLFxuICB9KVxuKVxuZXhwb3J0IHR5cGUgRml4UmVzcG9uc2VBcnJheSA9IHouaW5mZXI8dHlwZW9mIEZpeFJlc3BvbnNlQXJyYXlaPlxuXG5leHBvcnQgY29uc3QgU3VibWl0Rml4ZXNCYXNlUmVzcG9uc2VNZXNzYWdlWiA9IHoub2JqZWN0KHtcbiAgc3VibWl0Rml4UmVxdWVzdElkOiB6LnN0cmluZygpLnV1aWQoKSxcbiAgc3VibWl0QnJhbmNoZXM6IHouYXJyYXkoXG4gICAgei5vYmplY3Qoe1xuICAgICAgYnJhbmNoTmFtZTogei5zdHJpbmcoKSxcbiAgICAgIGZpeGVzOiBGaXhSZXNwb25zZUFycmF5WixcbiAgICB9KVxuICApLFxuICBlcnJvcjogelxuICAgIC5vYmplY3Qoe1xuICAgICAgdHlwZTogei5lbnVtKFtcbiAgICAgICAgJ0luaXRpYWxSZXBvQWNjZXNzRXJyb3InLFxuICAgICAgICAnUHVzaEJyYW5jaEVycm9yJyxcbiAgICAgICAgJ1Vua25vd25FcnJvcicsXG4gICAgICBdKSxcbiAgICAgIGluZm86IHoub2JqZWN0KHtcbiAgICAgICAgbWVzc2FnZTogei5zdHJpbmcoKSxcbiAgICAgICAgcHVzaEJyYW5jaE5hbWU6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgIH0pLFxuICAgIH0pXG4gICAgLm9wdGlvbmFsKCksXG59KVxuXG5leHBvcnQgY29uc3QgU3VibWl0Rml4ZXNUb1NhbWVCcmFuY2hSZXNwb25zZU1lc3NhZ2VaID0gelxuICAub2JqZWN0KHtcbiAgICB0eXBlOiB6LmxpdGVyYWwoc3VibWl0VG9TY21NZXNzYWdlVHlwZS5jb21taXRUb1NhbWVCcmFuY2gpLFxuICAgIGdpdGh1YkNvbW1lbnRJZDogei5udW1iZXIoKS5udWxsaXNoKCksXG4gIH0pXG4gIC5tZXJnZShTdWJtaXRGaXhlc0Jhc2VSZXNwb25zZU1lc3NhZ2VaKVxuXG5leHBvcnQgdHlwZSBTdWJtaXRGaXhlc1RvU2FtZUJyYW5jaFJlc3BvbnNlTWVzc2FnZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBTdWJtaXRGaXhlc1RvU2FtZUJyYW5jaFJlc3BvbnNlTWVzc2FnZVpcbj5cbmV4cG9ydCBjb25zdCBTdWJtaXRGaXhlc1RvRGlmZmVyZW50QnJhbmNoUmVzcG9uc2VNZXNzYWdlWiA9IHpcbiAgLm9iamVjdCh7XG4gICAgdHlwZTogei5saXRlcmFsKHN1Ym1pdFRvU2NtTWVzc2FnZVR5cGUuc3VibWl0Rml4ZXNGb3JEaWZmZXJlbnRCcmFuY2gpLFxuICAgIGdpdGh1YkNvbW1lbnRJZDogei5udW1iZXIoKS5vcHRpb25hbCgpLFxuICB9KVxuICAubWVyZ2UoU3VibWl0Rml4ZXNCYXNlUmVzcG9uc2VNZXNzYWdlWilcblxuZXhwb3J0IHR5cGUgU3VibWl0Rml4ZXNUb0RpZmZlcmVudEJyYW5jaFJlc3BvbnNlTWVzc2FnZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBTdWJtaXRGaXhlc1RvRGlmZmVyZW50QnJhbmNoUmVzcG9uc2VNZXNzYWdlWlxuPlxuXG5leHBvcnQgY29uc3QgU3VibWl0Rml4ZXNSZXNwb25zZU1lc3NhZ2VaID0gei5kaXNjcmltaW5hdGVkVW5pb24oJ3R5cGUnLCBbXG4gIFN1Ym1pdEZpeGVzVG9TYW1lQnJhbmNoUmVzcG9uc2VNZXNzYWdlWixcbiAgU3VibWl0Rml4ZXNUb0RpZmZlcmVudEJyYW5jaFJlc3BvbnNlTWVzc2FnZVosXG5dKVxuXG5leHBvcnQgdHlwZSBTdWJtaXRGaXhlc1Jlc3BvbnNlTWVzc2FnZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBTdWJtaXRGaXhlc1Jlc3BvbnNlTWVzc2FnZVpcbj5cbiJdfQ==