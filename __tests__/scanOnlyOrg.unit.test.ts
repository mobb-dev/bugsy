import { describe, expect, it } from 'vitest'

import { GQLClient } from '../src/features/analysis/graphql'
import {
  McpGQLClient,
  MVS_SCAN_ONLY_ERROR,
} from '../src/mcp/services/McpGQLClient'

// organization.is_fix_enabled = false puts an org on "Mobb Scan": issues are
// reported, no fixes are generated. These are the two CLI-side decisions that
// depend on it. The backend enforces the same rule independently.

const ORG_ID = '11111111-1111-1111-1111-111111111111'
const PROJECT_ID = '22222222-2222-2222-2222-222222222222'
const EMAIL = 'dev@mobb.ai'

function stubClient<T extends GQLClient>(client: T, sdk: object): T {
  client._clientSdk = sdk as T['_clientSdk']
  return client
}

function orgAndProjectResponse(isFixEnabled: boolean | null) {
  return {
    user: [
      {
        userOrganizationsAndUserOrganizationRoles: [
          {
            organization: {
              id: ORG_ID,
              enableV2Fixes: true,
              isFixEnabled,
              projects: [{ id: PROJECT_ID, name: 'p' }],
            },
          },
        ],
      },
    ],
  }
}

describe('getLastOrgAndNamedProject isFixEnabled', () => {
  const cases: [string, boolean | null, boolean][] = [
    ['true stays fix-enabled', true, true],
    ['false is scan-only', false, false],
    ['null (unset) stays fix-enabled', null, true],
  ]

  it.each(cases)('%s', async (_name, columnValue, expected) => {
    const client = stubClient(
      new GQLClient({ apiKey: 'key', type: 'apiKey' }),
      {
        Me: async () => ({ me: { email: EMAIL } }),
        getLastOrgAndNamedProject: async () =>
          orgAndProjectResponse(columnValue),
      }
    )

    const res = await client.getLastOrgAndNamedProject({ projectName: 'p' })

    expect(res.isFixEnabled).toBe(expected)
    expect(res.projectId).toBe(PROJECT_ID)
  })
})

describe('MVS availability', () => {
  function mvsClient(isFixEnabled: boolean | null) {
    return stubClient(new McpGQLClient({ apiKey: 'key', type: 'apiKey' }), {
      Me: async () => ({ me: { email: EMAIL } }),
      getLastOrg: async () => ({
        user: [
          {
            userOrganizationsAndUserOrganizationRoles: [
              {
                organization: { id: ORG_ID, enableV2Fixes: true, isFixEnabled },
              },
            ],
          },
        ],
      }),
      getMvsProject: async () => ({ getMvsProject: { projectId: PROJECT_ID } }),
    })
  }

  it('refuses to resolve an MVS project for a scan-only org', async () => {
    await expect(mvsClient(false).getProjectId()).rejects.toThrow(
      MVS_SCAN_ONLY_ERROR
    )
  })

  it.each([[true], [null]])(
    'resolves the MVS project when is_fix_enabled is %s',
    async (columnValue) => {
      await expect(mvsClient(columnValue).getProjectId()).resolves.toBe(
        PROJECT_ID
      )
    }
  )
})
