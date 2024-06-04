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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const dotenv = __importStar(require("dotenv"));
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const ado_1 = require("../ado");
dotenv.config({ path: node_path_1.default.join(__dirname, '../../../../../.env') });
const envVariables = zod_1.z
    .object({ ADO_TEST_ACCESS_TOKEN: zod_1.z.string().min(1) })
    .required()
    .parse(process.env);
vitest_1.describe.each([
    {
        ADO_ACCESS_TOKEN: envVariables.ADO_TEST_ACCESS_TOKEN,
        ADO_MOBB_ORG: 'mobbtest',
        ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
        NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
        EXISTING_COMMIT: 'e619caab398d5b75621dc8aab9e480eaee5ce42d',
        NON_EXISTING_BRANCH: 'non-existing-branch',
        EXISTING_TAG: 'test-tag',
        EXISTING_BRANCH: 'main',
    },
    {
        ADO_ACCESS_TOKEN: undefined,
        ADO_MOBB_ORG: undefined,
        ADO_URL: 'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
        NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
        EXISTING_COMMIT: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
        EXISTING_BRANCH: 'pt',
        NON_EXISTING_BRANCH: 'non-existing-branch',
        EXISTING_TAG: 'v2023.8',
    },
])('ado reference', ({ ADO_ACCESS_TOKEN, ADO_MOBB_ORG, ADO_URL, NON_EXISTING_ADO_URL, EXISTING_COMMIT, EXISTING_BRANCH, NON_EXISTING_BRANCH, EXISTING_TAG, }) => {
    (0, vitest_1.it)('test non existing repo', async () => {
        await (0, vitest_1.expect)(() => (0, ado_1.getAdoRepoDefaultBranch)({
            repoUrl: NON_EXISTING_ADO_URL,
            accessToken: ADO_ACCESS_TOKEN,
            tokenOrg: ADO_MOBB_ORG,
        })).rejects.toThrow();
    });
    (0, vitest_1.it)('test existing repo', async () => {
        (0, vitest_1.expect)(await (0, ado_1.getAdoRepoDefaultBranch)({
            repoUrl: ADO_URL,
            accessToken: ADO_ACCESS_TOKEN,
            tokenOrg: ADO_MOBB_ORG,
        })).toEqual('main');
    });
    (0, vitest_1.it)('test if ref is correct for commit', async () => {
        const ref = await (0, ado_1.getAdoReferenceData)({
            repoUrl: ADO_URL,
            ref: EXISTING_COMMIT,
            accessToken: ADO_ACCESS_TOKEN,
            tokenOrg: ADO_MOBB_ORG,
        });
        //date returns the current date for ADO for now as the ADO API doesn't return anything
        //so we can't test for it in the snapshot as it changes for each run
        ref.date = new Date(0);
        (0, vitest_1.expect)(ref).toMatchSnapshot();
    });
    (0, vitest_1.it)('test if ref is correct for branch', async () => {
        const ref = await (0, ado_1.getAdoReferenceData)({
            repoUrl: ADO_URL,
            ref: EXISTING_BRANCH,
            accessToken: ADO_ACCESS_TOKEN,
            tokenOrg: ADO_MOBB_ORG,
        });
        //date returns the current date for ADO for now as the ADO API doesn't return anything
        //so we can't test for it in the snapshot as it changes for each run
        ref.date = new Date(0);
        (0, vitest_1.expect)(ref).toMatchSnapshot();
    });
    (0, vitest_1.it)('test if ref is correct for tag', async () => {
        const ref = await (0, ado_1.getAdoReferenceData)({
            repoUrl: ADO_URL,
            ref: EXISTING_TAG,
            accessToken: ADO_ACCESS_TOKEN,
            tokenOrg: ADO_MOBB_ORG,
        });
        //date returns the current date for ADO for now as the ADO API doesn't return anything
        //so we can't test for it in the snapshot as it changes for each run
        ref.date = new Date(0);
        (0, vitest_1.expect)(ref).toMatchSnapshot();
    });
    (0, vitest_1.it)('test we get an error for incorrect tag', async () => {
        await (0, vitest_1.expect)((0, ado_1.getAdoReferenceData)({
            repoUrl: ADO_URL,
            ref: NON_EXISTING_BRANCH,
            accessToken: ADO_ACCESS_TOKEN,
            tokenOrg: ADO_MOBB_ORG,
        })).rejects.toThrow();
    });
});
vitest_1.describe.each([
    {
        ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
        INVALID_URL: 'https://invalid.com/zj-gitlab',
    },
    {
        ADO_URL: 'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
        INVALID_URL: 'https://invalid.com/zj-gitlab',
    },
])('parsing ado url', ({ ADO_URL, INVALID_URL }) => {
    (0, vitest_1.it)('should parse the url', () => {
        (0, vitest_1.expect)((0, ado_1.parseAdoOwnerAndRepo)(ADO_URL)).toMatchSnapshot();
    });
    (0, vitest_1.it)('should work with trailing slash', () => {
        (0, vitest_1.expect)((0, ado_1.parseAdoOwnerAndRepo)(`${ADO_URL}/`)).toMatchSnapshot();
    });
    (0, vitest_1.it)('fail if the url is invalid', () => {
        (0, vitest_1.expect)(() => (0, ado_1.parseAdoOwnerAndRepo)(INVALID_URL)).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRvLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL19fdGVzdHNfXy9hZG8udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQTRCO0FBRTVCLCtDQUFnQztBQUNoQyxtQ0FBNkM7QUFDN0MsNkJBQXVCO0FBRXZCLGdDQUllO0FBRWYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxtQkFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDcEUsTUFBTSxZQUFZLEdBQUcsT0FBQztLQUNuQixNQUFNLENBQUMsRUFBRSxxQkFBcUIsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDcEQsUUFBUSxFQUFFO0tBQ1YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUVyQixpQkFBUSxDQUFDLElBQUksQ0FBQztJQUNaO1FBQ0UsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLHFCQUFxQjtRQUNwRCxZQUFZLEVBQUUsVUFBVTtRQUN4QixPQUFPLEVBQUUsZ0RBQWdEO1FBQ3pELG9CQUFvQixFQUFFLGdEQUFnRDtRQUN0RSxlQUFlLEVBQUUsMENBQTBDO1FBQzNELG1CQUFtQixFQUFFLHFCQUFxQjtRQUMxQyxZQUFZLEVBQUUsVUFBVTtRQUN4QixlQUFlLEVBQUUsTUFBTTtLQUN4QjtJQUNEO1FBQ0UsZ0JBQWdCLEVBQUUsU0FBUztRQUMzQixZQUFZLEVBQUUsU0FBUztRQUN2QixPQUFPLEVBQUUsNkRBQTZEO1FBQ3RFLG9CQUFvQixFQUFFLGdEQUFnRDtRQUN0RSxlQUFlLEVBQUUsMENBQTBDO1FBQzNELGVBQWUsRUFBRSxJQUFJO1FBQ3JCLG1CQUFtQixFQUFF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WUFDeEIsV0FBVyxFQUFFLGdCQUFnQjtZQUM3QixRQUFRLEVBQUUsWUFBWTtTQUN2QixDQUFDLENBQ0gsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDckIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQ0YsQ0FBQTtBQUVELGlCQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1o7UUFDRSxPQUFPLEVBQUUsZ0RBQWdEO1FBQ3pELFdBQVcsRUFBRSwrQkFBK0I7S0FDN0M7SUFDRDtRQUNFLE9BQU8sRUFBRSw2REFBNkQ7UUFDdEUsV0FBVyxFQUFFLCtCQUErQjtLQUM3QztDQUNGLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUU7SUFDakQsSUFBQSxXQUFFLEVBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLElBQUEsZUFBTSxFQUFDLElBQUEsMEJBQW9CLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUN6RCxDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxJQUFBLDBCQUFvQixFQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO0lBQy9ELENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBQSxXQUFFLEVBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLElBQUEsZUFBTSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsMEJBQW9CLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52J1xuaW1wb3J0IHsgZGVzY3JpYmUsIGV4cGVjdCwgaXQgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJ1xuXG5pbXBvcnQge1xuICBnZXRBZG9SZWZlcmVuY2VEYXRhLFxuICBnZXRBZG9SZXBvRGVmYXVsdEJyYW5jaCxcbiAgcGFyc2VBZG9Pd25lckFuZFJlcG8sXG59IGZyb20gJy4uL2FkbydcblxuZG90ZW52LmNvbmZpZyh7IHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi8uLi8uLi8uZW52JykgfSlcbmNvbnN0IGVudlZhcmlhYmxlcyA9IHpcbiAgLm9iamVjdCh7IEFET19URVNUX0FDQ0VTU19UT0tFTjogei5zdHJpbmcoKS5taW4oMSkgfSlcbiAgLnJlcXVpcmVkKClcbiAgLnBhcnNlKHByb2Nlc3MuZW52KVxuXG5kZXNjcmliZS5lYWNoKFtcbiAge1xuICAgIEFET19BQ0NFU1NfVE9LRU46IGVudlZhcmlhYmxlcy5BRE9fVEVTVF9BQ0NFU1NfVE9LRU4sXG4gICAgQURPX01PQkJfT1JHOiAnbW9iYnRlc3QnLFxuICAgIEFET19VUkw6ICdodHRwczovL2Rldi5henVyZS5jb20vbW9iYnRlc3QvdGVzdC9fZ2l0L3JlcG8xJyxcbiAgICBOT05fRVhJU1RJTkdfQURPX1VSTDogJ2h0dHBzOi8vZGV2LmF6dXJlLmNvbS9tb2JidGVzdC90ZXN0L19naXQvcmVwbzInLFxuICAgIEVYSVNUSU5HX0NPTU1JVDogJ2U2MTljYWFiMzk4ZDViNzU2MjFkYzhhYWI5ZTQ4MGVhZWU1Y2U0MmQnLFxuICAgIE5PTl9FWElTVElOR19CUkFOQ0g6ICdub24tZXhpc3RpbmctYnJhbmNoJyxcbiAgICBFWElTVElOR19UQUc6ICd0ZXN0LXRhZycsXG4gICAgRVhJU1RJTkdfQlJBTkNIOiAnbWFpbicsXG4gIH0sXG4gIHtcbiAgICBBRE9fQUNDRVNTX1RPS0VOOiB1bmRlZmluZWQsXG4gICAgQURPX01PQkJfT1JHOiB1bmRlZmluZWQsXG4gICAgQURPX1VSTDogJ2h0dHBzOi8vZGV2LmF6dXJlLmNvbS9tb2JidGVzdC90ZXN0LXB1YmxpYy9fZ2l0L3JlcG8tcHVibGljJyxcbiAgICBOT05fRVhJU1RJTkdfQURPX1VSTDogJ2h0dHBzOi8vZGV2LmF6dXJlLmNvbS9tb2JidGVzdC90ZXN0L19naXQvcmVwbzInLFxuICAgIEVYSVNUSU5HX0NPTU1JVDogJ2I2N2ViNDQxNDIwNjc1ZTBmMTA3ZTJjMWEzYmEwNDkwMGZjMTEwZmInLFxuICAgIEVYSVNUSU5HX0JSQU5DSDogJ3B0JyxcbiAgICBOT05fRVhJU1RJTkdfQlJBTkNIOiAnbm9uLWV4aXN0aW5nLWJyYW5jaCcsXG4gICAgRVhJU1RJTkdfVEFHOiAndjIwMjMuOCcsXG4gIH0sXG5dKShcbiAgJ2FkbyByZWZlcmVuY2UnLFxuICAoe1xuICAgIEFET19BQ0NFU1NfVE9LRU4sXG4gICAgQURPX01PQkJfT1JHLFxuICAgIEFET19VUkwsXG4gICAgTk9OX0VYSVNUSU5HX0FET19VUkwsXG4gICAgRVhJU1RJTkdfQ09NTUlULFxuICAgIEVYSVNUSU5HX0JSQU5DSCxcbiAgICBOT05fRVhJU1RJTkdfQlJBTkNILFxuICAgIEVYSVNUSU5HX1RBRyxcbiAgfSkgPT4ge1xuICAgIGl0KCd0ZXN0IG5vbiBleGlzdGluZyByZXBvJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZXhwZWN0KCgpID0+XG4gICAgICAgIGdldEFkb1JlcG9EZWZhdWx0QnJhbmNoKHtcbiAgICAgICAgICByZXBvVXJsOiBOT05fRVhJU1RJTkdfQURPX1VSTCxcbiAgICAgICAgICBhY2Nlc3NUb2tlbjogQURPX0FDQ0VTU19UT0tFTixcbiAgICAgICAgICB0b2tlbk9yZzogQURPX01PQkJfT1JHLFxuICAgICAgICB9KVxuICAgICAgKS5yZWplY3RzLnRvVGhyb3coKVxuICAgIH0pXG4gICAgaXQoJ3Rlc3QgZXhpc3RpbmcgcmVwbycsIGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdChcbiAgICAgICAgYXdhaXQgZ2V0QWRvUmVwb0RlZmF1bHRCcmFuY2goe1xuICAgICAgICAgIHJlcG9Vcmw6IEFET19VUkwsXG4gICAgICAgICAgYWNjZXNzVG9rZW46IEFET19BQ0NFU1NfVE9LRU4sXG4gICAgICAgICAgdG9rZW5Pcmc6IEFET19NT0JCX09SRyxcbiAgICAgICAgfSlcbiAgICAgICkudG9FcXVhbCgnbWFpbicpXG4gICAgfSlcbiAgICBpdCgndGVzdCBpZiByZWYgaXMgY29ycmVjdCBmb3IgY29tbWl0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVmID0gYXdhaXQgZ2V0QWRvUmVmZXJlbmNlRGF0YSh7XG4gICAgICAgIHJlcG9Vcmw6IEFET19VUkwsXG4gICAgICAgIHJlZjogRVhJU1RJTkdfQ09NTUlULFxuICAgICAgICBhY2Nlc3NUb2tlbjogQURPX0FDQ0VTU19UT0tFTixcbiAgICAgICAgdG9rZW5Pcmc6IEFET19NT0JCX09SRyxcbiAgICAgIH0pXG4gICAgICAvL2RhdGUgcmV0dXJucyB0aGUgY3VycmVudCBkYXRlIGZvciBBRE8gZm9yIG5vdyBhcyB0aGUgQURPIEFQSSBkb2Vzbid0IHJldHVybiBhbnl0aGluZ1xuICAgICAgLy9zbyB3ZSBjYW4ndCB0ZXN0IGZvciBpdCBpbiB0aGUgc25hcHNob3QgYXMgaXQgY2hhbmdlcyBmb3IgZWFjaCBydW5cbiAgICAgIHJlZi5kYXRlID0gbmV3IERhdGUoMClcbiAgICAgIGV4cGVjdChyZWYpLnRvTWF0Y2hTbmFwc2hvdCgpXG4gICAgfSlcbiAgICBpdCgndGVzdCBpZiByZWYgaXMgY29ycmVjdCBmb3IgYnJhbmNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVmID0gYXdhaXQgZ2V0QWRvUmVmZXJlbmNlRGF0YSh7XG4gICAgICAgIHJlcG9Vcmw6IEFET19VUkwsXG4gICAgICAgIHJlZjogRVhJU1RJTkdfQlJBTkNILFxuICAgICAgICBhY2Nlc3NUb2tlbjogQURPX0FDQ0VTU19UT0tFTixcbiAgICAgICAgdG9rZW5Pcmc6IEFET19NT0JCX09SRyxcbiAgICAgIH0pXG4gICAgICAvL2RhdGUgcmV0dXJucyB0aGUgY3VycmVudCBkYXRlIGZvciBBRE8gZm9yIG5vdyBhcyB0aGUgQURPIEFQSSBkb2Vzbid0IHJldHVybiBhbnl0aGluZ1xuICAgICAgLy9zbyB3ZSBjYW4ndCB0ZXN0IGZvciBpdCBpbiB0aGUgc25hcHNob3QgYXMgaXQgY2hhbmdlcyBmb3IgZWFjaCBydW5cbiAgICAgIHJlZi5kYXRlID0gbmV3IERhdGUoMClcbiAgICAgIGV4cGVjdChyZWYpLnRvTWF0Y2hTbmFwc2hvdCgpXG4gICAgfSlcbiAgICBpdCgndGVzdCBpZiByZWYgaXMgY29ycmVjdCBmb3IgdGFnJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVmID0gYXdhaXQgZ2V0QWRvUmVmZXJlbmNlRGF0YSh7XG4gICAgICAgIHJlcG9Vcmw6IEFET19VUkwsXG4gICAgICAgIHJlZjogRVhJU1RJTkdfVEFHLFxuICAgICAgICBhY2Nlc3NUb2tlbjogQURPX0FDQ0VTU19UT0tFTixcbiAgICAgICAgdG9rZW5Pcmc6IEFET19NT0JCX09SRyxcbiAgICAgIH0pXG4gICAgICAvL2RhdGUgcmV0dXJucyB0aGUgY3VycmVudCBkYXRlIGZvciBBRE8gZm9yIG5vdyBhcyB0aGUgQURPIEFQSSBkb2Vzbid0IHJldHVybiBhbnl0aGluZ1xuICAgICAgLy9zbyB3ZSBjYW4ndCB0ZXN0IGZvciBpdCBpbiB0aGUgc25hcHNob3QgYXMgaXQgY2hhbmdlcyBmb3IgZWFjaCBydW5cbiAgICAgIHJlZi5kYXRlID0gbmV3IERhdGUoMClcbiAgICAgIGV4cGVjdChyZWYpLnRvTWF0Y2hTbmFwc2hvdCgpXG4gICAgfSlcbiAgICBpdCgndGVzdCB3ZSBnZXQgYW4gZXJyb3IgZm9yIGluY29ycmVjdCB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBleHBlY3QoXG4gICAgICAgIGdldEFkb1JlZmVyZW5jZURhdGEoe1xuICAgICAgICAgIHJlcG9Vcmw6IEFET19VUkwsXG4gICAgICAgICAgcmVmOiBOT05fRVhJU1RJTkdfQlJBTkNILFxuICAgICAgICAgIGFjY2Vzc1Rva2VuOiBBRE9fQUNDRVNTX1RPS0VOLFxuICAgICAgICAgIHRva2VuT3JnOiBBRE9fTU9CQl9PUkcsXG4gICAgICAgIH0pXG4gICAgICApLnJlamVjdHMudG9UaHJvdygpXG4gICAgfSlcbiAgfVxuKVxuXG5kZXNjcmliZS5lYWNoKFtcbiAge1xuICAgIEFET19VUkw6ICdodHRwczovL2Rldi5henVyZS5jb20vbW9iYnRlc3QvdGVzdC9fZ2l0L3JlcG8xJyxcbiAgICBJTlZBTElEX1VSTDogJ2h0dHBzOi8vaW52YWxpZC5jb20vemotZ2l0bGFiJyxcbiAgfSxcbiAge1xuICAgIEFET19VUkw6ICdodHRwczovL2Rldi5henVyZS5jb20vbW9iYnRlc3QvdGVzdC1wdWJsaWMvX2dpdC9yZXBvLXB1YmxpYycsXG4gICAgSU5WQUxJRF9VUkw6ICdodHRwczovL2ludmFsaWQuY29tL3pqLWdpdGxhYicsXG4gIH0sXG5dKSgncGFyc2luZyBhZG8gdXJsJywgKHsgQURPX1VSTCwgSU5WQUxJRF9VUkwgfSkgPT4ge1xuICBpdCgnc2hvdWxkIHBhcnNlIHRoZSB1cmwnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHBhcnNlQWRvT3duZXJBbmRSZXBvKEFET19VUkwpKS50b01hdGNoU25hcHNob3QoKVxuICB9KVxuICBpdCgnc2hvdWxkIHdvcmsgd2l0aCB0cmFpbGluZyBzbGFzaCcsICgpID0+IHtcbiAgICBleHBlY3QocGFyc2VBZG9Pd25lckFuZFJlcG8oYCR7QURPX1VSTH0vYCkpLnRvTWF0Y2hTbmFwc2hvdCgpXG4gIH0pXG4gIGl0KCdmYWlsIGlmIHRoZSB1cmwgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gcGFyc2VBZG9Pd25lckFuZFJlcG8oSU5WQUxJRF9VUkwpKS50b1Rocm93KClcbiAgfSlcbn0pXG4iXX0=