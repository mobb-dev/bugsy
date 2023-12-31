'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const vitest_1 = require('vitest')
const gitlab_1 = require('../gitlab')

const GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce'
const NON_EXISTING_GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce1111'
const INVALID_URL = 'https://invalid.com/zj-gitlab'
const EXISTING_COMMIT = '4298a28a993363f4ab6b63c14820492393a3ae94'
const EXISTING_BRANCH = 'zj-commit-caching'
const NON_EXISTING_BRANCH = 'non-existing-branch'
const EXISTING_TAG = 'v8.17.8'
;(0, vitest_1.describe)('gitlab reference', () => {
  ;(0, vitest_1.it)('test non existing repo', async () => {
    await (0, vitest_1.expect)(() =>
      (0, gitlab_1.getGitlabRepoDefaultBranch)(NON_EXISTING_GITLAB_URL)
    ).rejects.toThrow()
  })
  ;(0, vitest_1.it)('test existing repo', async () => {
    ;(0, vitest_1.expect)(
      await (0, gitlab_1.getGitlabRepoDefaultBranch)(GITLAB_URL)
    ).toEqual('master')
  })
  ;(0, vitest_1.it)('test if date is correct for commit', async () => {
    ;(0, vitest_1.expect)(
      await (0, gitlab_1.getGitlabReferenceData)({
        gitlabUrl: GITLAB_URL,
        ref: EXISTING_COMMIT,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2019-06-20T10:21:54.000Z,
        "sha": "4298a28a993363f4ab6b63c14820492393a3ae94",
        "type": "COMMIT",
      }
    `)
  })
  ;(0, vitest_1.it)('test if date is correct for branch', async () => {
    ;(0, vitest_1.expect)(
      await (0, gitlab_1.getGitlabReferenceData)({
        gitlabUrl: GITLAB_URL,
        ref: EXISTING_BRANCH,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2018-03-21T09:29:35.000Z,
        "sha": "be2f8ccc6b1e25c8bd9bd78f45473930b6d1debb",
        "type": "BRANCH",
      }
    `)
  })
  ;(0, vitest_1.it)('test if date is correct for tag', async () => {
    ;(0, vitest_1.expect)(
      await (0, gitlab_1.getGitlabReferenceData)({
        gitlabUrl: GITLAB_URL,
        ref: EXISTING_TAG,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2017-08-09T15:40:49.000Z,
        "sha": "ff7d664bf96a77e09cadb66bb70186aa1a0751d2",
        "type": "TAG",
      }
    `)
  })
  ;(0, vitest_1.it)('test we get an error for incorrect tag', async () => {
    await (0, vitest_1.expect)(
      (0, gitlab_1.getGitlabReferenceData)({
        gitlabUrl: GITLAB_URL,
        ref: NON_EXISTING_BRANCH,
      })
    ).rejects.toThrow()
  })
})
;(0, vitest_1.describe)('parsing gitlab url', () => {
  ;(0, vitest_1.it)('should parse the url', () => {
    ;(0, vitest_1.expect)((0, gitlab_1.parseOwnerAndRepo)(GITLAB_URL))
      .toMatchInlineSnapshot(`
      {
        "owner": "zj-gitlab",
        "projectPath": "zj-gitlab/gitlab-ce",
        "repo": "gitlab-ce",
      }
    `)
  })
  ;(0, vitest_1.it)('should work with trailing slash', () => {
    ;(0, vitest_1.expect)((0, gitlab_1.parseOwnerAndRepo)(`${GITLAB_URL}/`))
      .toMatchInlineSnapshot(`
      {
        "owner": "zj-gitlab",
        "projectPath": "zj-gitlab/gitlab-ce",
        "repo": "gitlab-ce",
      }
    `)
  })
  ;(0, vitest_1.it)('fail if the url is invalid', () => {
    ;(0, vitest_1.expect)(() =>
      (0, gitlab_1.parseOwnerAndRepo)(INVALID_URL)
    ).toThrow()
  })
})
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0bGFiLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL19fdGVzdHNfXy9naXRsYWIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE2QztBQUU3QyxzQ0FJa0I7QUFFbEIsTUFBTSxVQUFVLEdBQUcsd0NBQXdDLENBQUE7QUFDM0QsTUFBTSx1QkFBdUIsR0FBRyw0Q0FBNEMsQ0FBQTtBQUM1RSxNQUFNLFdBQVcsR0FBRywrQkFBK0IsQ0FBQTtBQUNuRCxNQUFNLGVBQWUsR0FBRywwQ0FBMEMsQ0FBQTtBQUNsRSxNQUFNLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQTtBQUMzQyxNQUFNLG1CQUFtQixHQUFHLHFCQUFxQixDQUFBO0FBQ2pELE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQTtBQUU5QixJQUFBLGlCQUFRLEVBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLElBQUEsV0FBRSxFQUFDLHdCQUF3QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RDLE1BQU0sSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFLENBQ2hCLElBQUEsbUNBQTBCLEVBQUMsdUJBQXVCLENBQUMsQ0FDcEQsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDckIsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsQyxJQUFBLGVBQU0sRUFBQyxNQUFNLElBQUEsbUNBQTBCLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDeEUsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRCxJQUFBLGVBQU0sRUFDSixNQUFNLElBQUEsK0JBQXNCLEVBQUM7WUFDM0IsU0FBUyxFQUFFLFVBQVU7WUFDckIsR0FBRyxFQUFFLGVBQWU7U0FDckIsQ0FBQyxDQUNILENBQUMscUJBQXFCLENBQUM7Ozs7OztLQU12QixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xELElBQUEsZUFBTSxFQUNKLE1BQU0sSUFBQSwrQkFBc0IsRUFBQztZQUMzQixTQUFTLEVBQUUsVUFBVTtZQUNyQixHQUFHLEVBQUUsZUFBZTtTQUNyQixDQUFDLENBQ0gsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7O0tBTXZCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBQSxXQUFFLEVBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0MsSUFBQSxlQUFNLEVBQ0osTUFBTSxJQUFBLCtCQUFzQixFQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FDM0UsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7O0tBTXZCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBQSxXQUFFLEVBQUMsd0NBQXdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEQsTUFBTSxJQUFBLGVBQU0sRUFDVixJQUFBLCtCQUFzQixFQUFDO1lBQ3JCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLEdBQUcsRUFBRSxtQkFBbUI7U0FDekIsQ0FBQyxDQUNILENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3JCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFBLGlCQUFRLEVBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUEsV0FBRSxFQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUM5QixJQUFBLGVBQU0sRUFBQyxJQUFBLDBCQUFpQixFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7Ozs7OztLQU0zRCxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxJQUFBLDBCQUFpQixFQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7S0FNakUsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSwwQkFBaUIsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3hELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZXNjcmliZSwgZXhwZWN0LCBpdCB9IGZyb20gJ3ZpdGVzdCdcblxuaW1wb3J0IHtcbiAgZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YSxcbiAgZ2V0R2l0bGFiUmVwb0RlZmF1bHRCcmFuY2gsXG4gIHBhcnNlT3duZXJBbmRSZXBvLFxufSBmcm9tICcuLi9naXRsYWInXG5cbmNvbnN0IEdJVExBQl9VUkwgPSAnaHR0cHM6Ly9naXRsYWIuY29tL3pqLWdpdGxhYi9naXRsYWItY2UnXG5jb25zdCBOT05fRVhJU1RJTkdfR0lUTEFCX1VSTCA9ICdodHRwczovL2dpdGxhYi5jb20vemotZ2l0bGFiL2dpdGxhYi1jZTExMTEnXG5jb25zdCBJTlZBTElEX1VSTCA9ICdodHRwczovL2ludmFsaWQuY29tL3pqLWdpdGxhYidcbmNvbnN0IEVYSVNUSU5HX0NPTU1JVCA9ICc0Mjk4YTI4YTk5MzM2M2Y0YWI2YjYzYzE0ODIwNDkyMzkzYTNhZTk0J1xuY29uc3QgRVhJU1RJTkdfQlJBTkNIID0gJ3pqLWNvbW1pdC1jYWNoaW5nJ1xuY29uc3QgTk9OX0VYSVNUSU5HX0JSQU5DSCA9ICdub24tZXhpc3RpbmctYnJhbmNoJ1xuY29uc3QgRVhJU1RJTkdfVEFHID0gJ3Y4LjE3LjgnXG5cbmRlc2NyaWJlKCdnaXRsYWIgcmVmZXJlbmNlJywgKCkgPT4ge1xuICBpdCgndGVzdCBub24gZXhpc3RpbmcgcmVwbycsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBleHBlY3QoKCkgPT5cbiAgICAgIGdldEdpdGxhYlJlcG9EZWZhdWx0QnJhbmNoKE5PTl9FWElTVElOR19HSVRMQUJfVVJMKVxuICAgICkucmVqZWN0cy50b1Rocm93KClcbiAgfSlcbiAgaXQoJ3Rlc3QgZXhpc3RpbmcgcmVwbycsIGFzeW5jICgpID0+IHtcbiAgICBleHBlY3QoYXdhaXQgZ2V0R2l0bGFiUmVwb0RlZmF1bHRCcmFuY2goR0lUTEFCX1VSTCkpLnRvRXF1YWwoJ21hc3RlcicpXG4gIH0pXG4gIGl0KCd0ZXN0IGlmIGRhdGUgaXMgY29ycmVjdCBmb3IgY29tbWl0JywgYXN5bmMgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgIGF3YWl0IGdldEdpdGxhYlJlZmVyZW5jZURhdGEoe1xuICAgICAgICBnaXRsYWJVcmw6IEdJVExBQl9VUkwsXG4gICAgICAgIHJlZjogRVhJU1RJTkdfQ09NTUlULFxuICAgICAgfSlcbiAgICApLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICB7XG4gICAgICAgIFwiZGF0ZVwiOiAyMDE5LTA2LTIwVDEwOjIxOjU0LjAwMFosXG4gICAgICAgIFwic2hhXCI6IFwiNDI5OGEyOGE5OTMzNjNmNGFiNmI2M2MxNDgyMDQ5MjM5M2EzYWU5NFwiLFxuICAgICAgICBcInR5cGVcIjogXCJDT01NSVRcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgndGVzdCBpZiBkYXRlIGlzIGNvcnJlY3QgZm9yIGJyYW5jaCcsIGFzeW5jICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICBhd2FpdCBnZXRHaXRsYWJSZWZlcmVuY2VEYXRhKHtcbiAgICAgICAgZ2l0bGFiVXJsOiBHSVRMQUJfVVJMLFxuICAgICAgICByZWY6IEVYSVNUSU5HX0JSQU5DSCxcbiAgICAgIH0pXG4gICAgKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAge1xuICAgICAgICBcImRhdGVcIjogMjAxOC0wMy0yMVQwOToyOTozNS4wMDBaLFxuICAgICAgICBcInNoYVwiOiBcImJlMmY4Y2NjNmIxZTI1YzhiZDliZDc4ZjQ1NDczOTMwYjZkMWRlYmJcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiQlJBTkNIXCIsXG4gICAgICB9XG4gICAgYClcbiAgfSlcbiAgaXQoJ3Rlc3QgaWYgZGF0ZSBpcyBjb3JyZWN0IGZvciB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgZXhwZWN0KFxuICAgICAgYXdhaXQgZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YSh7IGdpdGxhYlVybDogR0lUTEFCX1VSTCwgcmVmOiBFWElTVElOR19UQUcgfSlcbiAgICApLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICB7XG4gICAgICAgIFwiZGF0ZVwiOiAyMDE3LTA4LTA5VDE1OjQwOjQ5LjAwMFosXG4gICAgICAgIFwic2hhXCI6IFwiZmY3ZDY2NGJmOTZhNzdlMDljYWRiNjZiYjcwMTg2YWExYTA3NTFkMlwiLFxuICAgICAgICBcInR5cGVcIjogXCJUQUdcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgndGVzdCB3ZSBnZXQgYW4gZXJyb3IgZm9yIGluY29ycmVjdCB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgZXhwZWN0KFxuICAgICAgZ2V0R2l0bGFiUmVmZXJlbmNlRGF0YSh7XG4gICAgICAgIGdpdGxhYlVybDogR0lUTEFCX1VSTCxcbiAgICAgICAgcmVmOiBOT05fRVhJU1RJTkdfQlJBTkNILFxuICAgICAgfSlcbiAgICApLnJlamVjdHMudG9UaHJvdygpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgncGFyc2luZyBnaXRsYWIgdXJsJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHBhcnNlIHRoZSB1cmwnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHBhcnNlT3duZXJBbmRSZXBvKEdJVExBQl9VUkwpKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAge1xuICAgICAgICBcIm93bmVyXCI6IFwiemotZ2l0bGFiXCIsXG4gICAgICAgIFwicHJvamVjdFBhdGhcIjogXCJ6ai1naXRsYWIvZ2l0bGFiLWNlXCIsXG4gICAgICAgIFwicmVwb1wiOiBcImdpdGxhYi1jZVwiLFxuICAgICAgfVxuICAgIGApXG4gIH0pXG4gIGl0KCdzaG91bGQgd29yayB3aXRoIHRyYWlsaW5nIHNsYXNoJywgKCkgPT4ge1xuICAgIGV4cGVjdChwYXJzZU93bmVyQW5kUmVwbyhgJHtHSVRMQUJfVVJMfS9gKSkudG9NYXRjaElubGluZVNuYXBzaG90KGBcbiAgICAgIHtcbiAgICAgICAgXCJvd25lclwiOiBcInpqLWdpdGxhYlwiLFxuICAgICAgICBcInByb2plY3RQYXRoXCI6IFwiemotZ2l0bGFiL2dpdGxhYi1jZVwiLFxuICAgICAgICBcInJlcG9cIjogXCJnaXRsYWItY2VcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgnZmFpbCBpZiB0aGUgdXJsIGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHBhcnNlT3duZXJBbmRSZXBvKElOVkFMSURfVVJMKSkudG9UaHJvdygpXG4gIH0pXG59KVxuIl19
