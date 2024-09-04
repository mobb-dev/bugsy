import { expect, test } from 'vitest'

import { getAdoClientParams } from './utils'

test('getAdoConnectData', async () => {
  expect(
    await getAdoClientParams({
      accessToken: 'abc',
      tokenOrg: 'org',
      url: 'https://dev.azure.com/org/project/_git/repo',
    })
  ).toMatchInlineSnapshot(`
    {
      "accessToken": "abc",
      "orgName": "org",
      "origin": "https://dev.azure.com",
      "patTokenOrg": "org",
      "tokenType": "PAT",
    }
  `)
  expect(
    await getAdoClientParams({
      accessToken: 'abc',
      tokenOrg: 'org',
      url: 'https://dev.azure.com/tfs/org/project/_git/repo',
    })
  ).toMatchInlineSnapshot(`
    {
      "accessToken": "abc",
      "orgName": "org",
      "origin": "https://dev.azure.com/tfs",
      "patTokenOrg": "org",
      "tokenType": "PAT",
    }
  `)
  expect(
    await getAdoClientParams({
      accessToken: 'abc',
      tokenOrg: 'org',
      url: 'https://ado-on-prem.com/tfs/org/project/_git/repo',
    })
  ).toMatchInlineSnapshot(`
    {
      "accessToken": "abc",
      "orgName": "org",
      "origin": "https://ado-on-prem.com/tfs",
      "patTokenOrg": "org",
      "tokenType": "PAT",
    }
  `)
  expect(
    await getAdoClientParams({
      accessToken: 'oauth.token',
      tokenOrg: 'org',
      url: 'https://ado-on-prem.com/tfs/org/project/_git/repo',
    })
  ).toMatchInlineSnapshot(`
    {
      "accessToken": "oauth.token",
      "orgName": "org",
      "origin": "https://ado-on-prem.com/tfs",
      "tokenType": "OAUTH",
    }
  `)
  expect(
    await getAdoClientParams({
      accessToken: undefined,
      tokenOrg: 'org',
      url: 'https://ado-on-prem.com/tfs/org/project/_git/repo',
    })
  ).toMatchInlineSnapshot(`
    {
      "orgName": "org",
      "origin": "https://ado-on-prem.com/tfs",
      "tokenType": "NONE",
    }
  `)
})
