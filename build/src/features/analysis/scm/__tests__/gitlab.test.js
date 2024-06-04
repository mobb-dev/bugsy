"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const gitlab_1 = require("../gitlab/gitlab");
const GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce';
const NON_EXISTING_GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce1111';
const INVALID_URL = 'https://invalid.com/zj-gitlab';
const EXISTING_COMMIT = '4298a28a993363f4ab6b63c14820492393a3ae94';
const EXISTING_BRANCH = 'zj-commit-caching';
const NON_EXISTING_BRANCH = 'non-existing-branch';
const EXISTING_TAG = 'v8.17.8';
(0, vitest_1.describe)('gitlab reference', () => {
    (0, vitest_1.it)('test non existing repo', async () => {
        await (0, vitest_1.expect)(() => (0, gitlab_1.getGitlabRepoDefaultBranch)(NON_EXISTING_GITLAB_URL)).rejects.toThrow();
    });
    (0, vitest_1.it)('test existing repo', async () => {
        (0, vitest_1.expect)(await (0, gitlab_1.getGitlabRepoDefaultBranch)(GITLAB_URL)).toEqual('master');
    });
    (0, vitest_1.it)('test if date is correct for commit', async () => {
        (0, vitest_1.expect)(await (0, gitlab_1.getGitlabReferenceData)({
            gitlabUrl: GITLAB_URL,
            ref: EXISTING_COMMIT,
        })).toMatchInlineSnapshot(`
      {
        "date": 2019-06-20T10:21:54.000Z,
        "sha": "4298a28a993363f4ab6b63c14820492393a3ae94",
        "type": "COMMIT",
      }
    `);
    });
    (0, vitest_1.it)('test if date is correct for branch', async () => {
        (0, vitest_1.expect)(await (0, gitlab_1.getGitlabReferenceData)({
            gitlabUrl: GITLAB_URL,
            ref: EXISTING_BRANCH,
        })).toMatchInlineSnapshot(`
      {
        "date": 2018-03-21T09:29:35.000Z,
        "sha": "be2f8ccc6b1e25c8bd9bd78f45473930b6d1debb",
        "type": "BRANCH",
      }
    `);
    });
    (0, vitest_1.it)('test if date is correct for tag', async () => {
        (0, vitest_1.expect)(await (0, gitlab_1.getGitlabReferenceData)({ gitlabUrl: GITLAB_URL, ref: EXISTING_TAG })).toMatchInlineSnapshot(`
      {
        "date": 2017-08-09T15:40:49.000Z,
        "sha": "ff7d664bf96a77e09cadb66bb70186aa1a0751d2",
        "type": "TAG",
      }
    `);
    });
    (0, vitest_1.it)('test we get an error for incorrect tag', async () => {
        await (0, vitest_1.expect)((0, gitlab_1.getGitlabReferenceData)({
            gitlabUrl: GITLAB_URL,
            ref: NON_EXISTING_BRANCH,
        })).rejects.toThrow();
    });
});
(0, vitest_1.describe)('parsing gitlab url', () => {
    (0, vitest_1.it)('should parse the url', () => {
        (0, vitest_1.expect)((0, gitlab_1.parseGitlabOwnerAndRepo)(GITLAB_URL)).toMatchInlineSnapshot(`
      {
        "owner": "zj-gitlab",
        "projectPath": "zj-gitlab/gitlab-ce",
        "repo": "gitlab-ce",
      }
    `);
    });
    (0, vitest_1.it)('should work with trailing slash', () => {
        (0, vitest_1.expect)((0, gitlab_1.parseGitlabOwnerAndRepo)(`${GITLAB_URL}/`)).toMatchInlineSnapshot(`
      {
        "owner": "zj-gitlab",
        "projectPath": "zj-gitlab/gitlab-ce",
        "repo": "gitlab-ce",
      }
    `);
    });
    (0, vitest_1.it)('fail if the url is invalid', () => {
        (0, vitest_1.expect)(() => (0, gitlab_1.parseGitlabOwnerAndRepo)(INVALID_URL)).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0bGFiLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL19fdGVzdHNfXy9naXRsYWIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE2QztBQUU3Qyw2Q0FJeUI7QUFFekIsTUFBTSxVQUFVLEdBQUcsd0NBQXdDLENBQUE7QUFDM0QsTUFBTSx1QkFBdUIsR0FBRyw0Q0FBNEMsQ0FBQTtBQUM1RSxNQUFNLFdBQVcsR0FBRywrQkFBK0IsQ0FBQTtBQUNuRCxNQUFNLGVBQWUsR0FBRywwQ0FBMEMsQ0FBQTtBQUNsRSxNQUFNLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQTtBQUMzQyxNQUFNLG1CQUFtQixHQUFHLHFCQUFxQixDQUFBO0FBQ2pELE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQTtBQUU5QixJQUFBLGlCQUFRLEVBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLElBQUEsV0FBRSxFQUFDLHdCQUF3QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RDLE1BQU0sSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFLENBQ2hCLElBQUEsbUNBQTBCLEVBQUMsdUJBQXVCLENBQUMsQ0FDcEQsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDckIsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsQyxJQUFBLGVBQU0sRUFBQyxNQUFNLElBQUEsbUNBQTBCLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDeEUsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRCxJQUFBLGVBQU0sRUFDSixNQUFNLElBQUEsK0JBQXNCLEVBQUM7WUFDM0IsU0FBUyxFQUFFLFVBQVU7WUFDckIsR0FBRyxFQUFFLGVBQWU7U0FDckIsQ0FBQyxDQUNILENBQUMscUJBQXFCLENBQUM7Ozs7OztLQU12QixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xELElBQUEsZUFBTSxFQUNKLE1BQU0sSUFBQSwrQkFBc0IsRUFBQztZQUMzQixTQUFTLEVBQUUsVUFBVTtZQUNyQixHQUFHLEVBQUUsZUFBZTtTQUNyQixDQUFDLENBQ0gsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7O0tBTXZCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBQSxXQUFFLEVBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0MsSUFBQSxlQUFNLEVBQ0osTUFBTSxJQUFBLCtCQUFzQixFQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FDM0UsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7O0tBTXZCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBQSxXQUFFLEVBQUMsd0NBQXdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEQsTUFBTSxJQUFBLGVBQU0sRUFDVixJQUFBLCtCQUFzQixFQUFDO1lBQ3JCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLEdBQUcsRUFBRSxtQkFBbUI7U0FDekIsQ0FBQyxDQUNILENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3JCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFBLGlCQUFRLEVBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUEsV0FBRSxFQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUM5QixJQUFBLGVBQU0sRUFBQyxJQUFBLGdDQUF1QixFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7Ozs7OztLQU1qRSxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxJQUFBLGdDQUF1QixFQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7S0FNdkUsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxnQ0FBdUIsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQzlELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZXNjcmliZSwgZXhwZWN0LCBpdCB9IGZyb20gJ3ZpdGVzdCdcblxuaW1wb3J0IHtcbiAgZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YSxcbiAgZ2V0R2l0bGFiUmVwb0RlZmF1bHRCcmFuY2gsXG4gIHBhcnNlR2l0bGFiT3duZXJBbmRSZXBvLFxufSBmcm9tICcuLi9naXRsYWIvZ2l0bGFiJ1xuXG5jb25zdCBHSVRMQUJfVVJMID0gJ2h0dHBzOi8vZ2l0bGFiLmNvbS96ai1naXRsYWIvZ2l0bGFiLWNlJ1xuY29uc3QgTk9OX0VYSVNUSU5HX0dJVExBQl9VUkwgPSAnaHR0cHM6Ly9naXRsYWIuY29tL3pqLWdpdGxhYi9naXRsYWItY2UxMTExJ1xuY29uc3QgSU5WQUxJRF9VUkwgPSAnaHR0cHM6Ly9pbnZhbGlkLmNvbS96ai1naXRsYWInXG5jb25zdCBFWElTVElOR19DT01NSVQgPSAnNDI5OGEyOGE5OTMzNjNmNGFiNmI2M2MxNDgyMDQ5MjM5M2EzYWU5NCdcbmNvbnN0IEVYSVNUSU5HX0JSQU5DSCA9ICd6ai1jb21taXQtY2FjaGluZydcbmNvbnN0IE5PTl9FWElTVElOR19CUkFOQ0ggPSAnbm9uLWV4aXN0aW5nLWJyYW5jaCdcbmNvbnN0IEVYSVNUSU5HX1RBRyA9ICd2OC4xNy44J1xuXG5kZXNjcmliZSgnZ2l0bGFiIHJlZmVyZW5jZScsICgpID0+IHtcbiAgaXQoJ3Rlc3Qgbm9uIGV4aXN0aW5nIHJlcG8nLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgZXhwZWN0KCgpID0+XG4gICAgICBnZXRHaXRsYWJSZXBvRGVmYXVsdEJyYW5jaChOT05fRVhJU1RJTkdfR0lUTEFCX1VSTClcbiAgICApLnJlamVjdHMudG9UaHJvdygpXG4gIH0pXG4gIGl0KCd0ZXN0IGV4aXN0aW5nIHJlcG8nLCBhc3luYyAoKSA9PiB7XG4gICAgZXhwZWN0KGF3YWl0IGdldEdpdGxhYlJlcG9EZWZhdWx0QnJhbmNoKEdJVExBQl9VUkwpKS50b0VxdWFsKCdtYXN0ZXInKVxuICB9KVxuICBpdCgndGVzdCBpZiBkYXRlIGlzIGNvcnJlY3QgZm9yIGNvbW1pdCcsIGFzeW5jICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICBhd2FpdCBnZXRHaXRsYWJSZWZlcmVuY2VEYXRhKHtcbiAgICAgICAgZ2l0bGFiVXJsOiBHSVRMQUJfVVJMLFxuICAgICAgICByZWY6IEVYSVNUSU5HX0NPTU1JVCxcbiAgICAgIH0pXG4gICAgKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAge1xuICAgICAgICBcImRhdGVcIjogMjAxOS0wNi0yMFQxMDoyMTo1NC4wMDBaLFxuICAgICAgICBcInNoYVwiOiBcIjQyOThhMjhhOTkzMzYzZjRhYjZiNjNjMTQ4MjA0OTIzOTNhM2FlOTRcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiQ09NTUlUXCIsXG4gICAgICB9XG4gICAgYClcbiAgfSlcbiAgaXQoJ3Rlc3QgaWYgZGF0ZSBpcyBjb3JyZWN0IGZvciBicmFuY2gnLCBhc3luYyAoKSA9PiB7XG4gICAgZXhwZWN0KFxuICAgICAgYXdhaXQgZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YSh7XG4gICAgICAgIGdpdGxhYlVybDogR0lUTEFCX1VSTCxcbiAgICAgICAgcmVmOiBFWElTVElOR19CUkFOQ0gsXG4gICAgICB9KVxuICAgICkudG9NYXRjaElubGluZVNuYXBzaG90KGBcbiAgICAgIHtcbiAgICAgICAgXCJkYXRlXCI6IDIwMTgtMDMtMjFUMDk6Mjk6MzUuMDAwWixcbiAgICAgICAgXCJzaGFcIjogXCJiZTJmOGNjYzZiMWUyNWM4YmQ5YmQ3OGY0NTQ3MzkzMGI2ZDFkZWJiXCIsXG4gICAgICAgIFwidHlwZVwiOiBcIkJSQU5DSFwiLFxuICAgICAgfVxuICAgIGApXG4gIH0pXG4gIGl0KCd0ZXN0IGlmIGRhdGUgaXMgY29ycmVjdCBmb3IgdGFnJywgYXN5bmMgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgIGF3YWl0IGdldEdpdGxhYlJlZmVyZW5jZURhdGEoeyBnaXRsYWJVcmw6IEdJVExBQl9VUkwsIHJlZjogRVhJU1RJTkdfVEFHIH0pXG4gICAgKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAge1xuICAgICAgICBcImRhdGVcIjogMjAxNy0wOC0wOVQxNTo0MDo0OS4wMDBaLFxuICAgICAgICBcInNoYVwiOiBcImZmN2Q2NjRiZjk2YTc3ZTA5Y2FkYjY2YmI3MDE4NmFhMWEwNzUxZDJcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiVEFHXCIsXG4gICAgICB9XG4gICAgYClcbiAgfSlcbiAgaXQoJ3Rlc3Qgd2UgZ2V0IGFuIGVycm9yIGZvciBpbmNvcnJlY3QgdGFnJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGV4cGVjdChcbiAgICAgIGdldEdpdGxhYlJlZmVyZW5jZURhdGEoe1xuICAgICAgICBnaXRsYWJVcmw6IEdJVExBQl9VUkwsXG4gICAgICAgIHJlZjogTk9OX0VYSVNUSU5HX0JSQU5DSCxcbiAgICAgIH0pXG4gICAgKS5yZWplY3RzLnRvVGhyb3coKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ3BhcnNpbmcgZ2l0bGFiIHVybCcsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBwYXJzZSB0aGUgdXJsJywgKCkgPT4ge1xuICAgIGV4cGVjdChwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhHSVRMQUJfVVJMKSkudG9NYXRjaElubGluZVNuYXBzaG90KGBcbiAgICAgIHtcbiAgICAgICAgXCJvd25lclwiOiBcInpqLWdpdGxhYlwiLFxuICAgICAgICBcInByb2plY3RQYXRoXCI6IFwiemotZ2l0bGFiL2dpdGxhYi1jZVwiLFxuICAgICAgICBcInJlcG9cIjogXCJnaXRsYWItY2VcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgnc2hvdWxkIHdvcmsgd2l0aCB0cmFpbGluZyBzbGFzaCcsICgpID0+IHtcbiAgICBleHBlY3QocGFyc2VHaXRsYWJPd25lckFuZFJlcG8oYCR7R0lUTEFCX1VSTH0vYCkpLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICB7XG4gICAgICAgIFwib3duZXJcIjogXCJ6ai1naXRsYWJcIixcbiAgICAgICAgXCJwcm9qZWN0UGF0aFwiOiBcInpqLWdpdGxhYi9naXRsYWItY2VcIixcbiAgICAgICAgXCJyZXBvXCI6IFwiZ2l0bGFiLWNlXCIsXG4gICAgICB9XG4gICAgYClcbiAgfSlcbiAgaXQoJ2ZhaWwgaWYgdGhlIHVybCBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBwYXJzZUdpdGxhYk93bmVyQW5kUmVwbyhJTlZBTElEX1VSTCkpLnRvVGhyb3coKVxuICB9KVxufSlcbiJdfQ==