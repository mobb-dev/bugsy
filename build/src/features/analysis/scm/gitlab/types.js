"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabTokenRequestTypeEnum = exports.GitlabAuthResultZ = void 0;
const zod_1 = require("zod");
exports.GitlabAuthResultZ = zod_1.z.object({
    access_token: zod_1.z.string(),
    token_type: zod_1.z.string(),
    refresh_token: zod_1.z.string(),
});
var GitlabTokenRequestTypeEnum;
(function (GitlabTokenRequestTypeEnum) {
    GitlabTokenRequestTypeEnum["CODE"] = "code";
    GitlabTokenRequestTypeEnum["REFRESH_TOKEN"] = "refresh_token";
})(GitlabTokenRequestTypeEnum = exports.GitlabTokenRequestTypeEnum || (exports.GitlabTokenRequestTypeEnum = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL2dpdGxhYi90eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUI7QUFFVixRQUFBLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEMsWUFBWSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDeEIsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsYUFBYSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7Q0FDMUIsQ0FBQyxDQUFBO0FBRUYsSUFBWSwwQkFHWDtBQUhELFdBQVksMEJBQTBCO0lBQ3BDLDJDQUFhLENBQUE7SUFDYiw2REFBK0IsQ0FBQTtBQUNqQyxDQUFDLEVBSFcsMEJBQTBCLEdBQTFCLGtDQUEwQixLQUExQixrQ0FBMEIsUUFHckMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB6IH0gZnJvbSAnem9kJ1xuXG5leHBvcnQgY29uc3QgR2l0bGFiQXV0aFJlc3VsdFogPSB6Lm9iamVjdCh7XG4gIGFjY2Vzc190b2tlbjogei5zdHJpbmcoKSxcbiAgdG9rZW5fdHlwZTogei5zdHJpbmcoKSxcbiAgcmVmcmVzaF90b2tlbjogei5zdHJpbmcoKSxcbn0pXG5cbmV4cG9ydCBlbnVtIEdpdGxhYlRva2VuUmVxdWVzdFR5cGVFbnVtIHtcbiAgQ09ERSA9ICdjb2RlJyxcbiAgUkVGUkVTSF9UT0tFTiA9ICdyZWZyZXNoX3Rva2VuJyxcbn1cbiJdfQ==