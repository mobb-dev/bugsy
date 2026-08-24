import path from 'node:path'

import { CLI_LOCAL_ENV_OVERWRITE, run, SCRIPTS_DIR_PATH } from './utils.mjs'

/**
 * Wrapper to interact with Mobb API. All GraphQL queries here are copy-paste
 * from the browser requests tab. We should keep this class as simple as
 * possible.
 */
export class MobbApi {
  #auth0Token

  /**
   * Acquire an auth0 token and initialize user account.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.#auth0Token = (
      await run(path.join(SCRIPTS_DIR_PATH, 'login_auth0.sh'))
    )
      .split('\n')[0]
      .trim()
    await this.#initUser()
  }

  async #initUser() {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: '{"query":"\\n    mutation InitOrganizationAndProject {\\n  initOrganizationAndProject {\\n    __typename\\n    ... on InitOrganizationAndProjectGoodResponse {\\n      projectId\\n      userId\\n    }\\n    ... on UserAlreadyInProjectError {\\n      error\\n      status\\n    }\\n    ... on UserHasNoPermissionInProjectError {\\n      error\\n      status\\n    }\\n  }\\n}\\n    ","variables":{},"operationName":"InitOrganizationAndProject"}',
      method: 'POST',
    })
    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to perform user init ${JSON.stringify(body, null, 2)}`
      )
    }
  }

  /**
   * Perform CLI login (generate a new API token and update the CLI login table).
   *
   * @param {string} loginId
   * @returns {Promise<void>}
   */
  async cliLogin(loginId) {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: `{"query":"\\n    mutation performCliLogin($loginId: String!, $hostname: String, $computerUser: String, $clientVersion: String) {\\n  performCliLogin(loginId: $loginId, hostname: $hostname, computerUser: $computerUser, clientVersion: $clientVersion) {\\n    status\\n  }\\n}\\n    ","variables":{"loginId":"${loginId}","hostname":"example-hostname"},"operationName":"performCliLogin"}`,
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to perform CLI login ${JSON.stringify(body, null, 2)}`
      )
    }
  }

  /**
   * T-493 — flip the per-org quarantine toggle on every org the caller
   * owns (`update_permissions` on the column already restricts updates to
   * owners, so `where: {}` is safe — it narrows server-side). Used by the
   * quarantine e2e to opt the test org in before asserting on-disk
   * enforcement.
   *
   * @param {boolean} enabled
   * @returns {Promise<void>}
   */
  async setQuarantineEnabled(enabled) {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: `{"query":"\\n    mutation SetQuarantineEnabled($enabled: Boolean!) {\\n  update_organization(where: {}, _set: {quarantineEnabled: $enabled}) {\\n    affected_rows\\n  }\\n}\\n    ","variables":{"enabled":${JSON.stringify(enabled)}},"operationName":"SetQuarantineEnabled"}`,
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to set quarantine flag ${JSON.stringify(body, null, 2)}`
      )
    }
  }

  /**
   * MOBB-3810 — the id of the caller's organization. The e2e user is created by
   * initOrganizationAndProject, so it is the owner of exactly one org; Hasura's
   * user-role filter scopes the select to it.
   *
   * @returns {Promise<string>}
   */
  async getOrganizationId() {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query GetOrganizationId {\n  organization {\n    id\n  }\n}',
        variables: {},
        operationName: 'GetOrganizationId',
      }),
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors || !body.data?.organization?.length) {
      throw new Error(
        `Failed to resolve organization id ${JSON.stringify(body, null, 2)}`
      )
    }

    return body.data.organization[0].id
  }

  /**
   * MOBB-3810 — replace the org's Scan & Gate Policy deviations (owner-only
   * mutation). Pass null to clear the policy back to the gate-on-by-default
   * baseline. Returns the success payload so callers can assert on `warnings`
   * (an "unknown rule id" warning means the backend has no rules_manifest.json
   * — run scripts/opengrep_init.sh).
   *
   * @param {string} organizationId
   * @param {string | null} policyJson - JSON-encoded ScanPolicyDoc or null.
   * @returns {Promise<{storedPolicyJson: string | null, warnings: string[]}>}
   */
  async updateOrgScanPolicy(organizationId, policyJson) {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query:
          'mutation UpdateOrgScanPolicy($organizationId: String!, $policyJson: String) {\n  updateOrganizationScanPolicy(\n    organizationId: $organizationId\n    policyJson: $policyJson\n  ) {\n    __typename\n    ... on ScanPolicyUpdateSuccess {\n      storedPolicyJson\n      warnings\n    }\n    ... on ScanPolicyValidationError {\n      error\n    }\n  }\n}',
        variables: { organizationId, policyJson },
        operationName: 'UpdateOrgScanPolicy',
      }),
      method: 'POST',
    })

    const body = await response.json()
    const result = body.data?.updateOrganizationScanPolicy

    if (body.errors || result?.__typename !== 'ScanPolicyUpdateSuccess') {
      throw new Error(
        `Failed to update org scan policy ${JSON.stringify(body, null, 2)}`
      )
    }

    return result
  }

  /**
   * MOBB-3816 — replace a project's Scan & Gate Policy overrides. The project
   * doc is a per-control overlay on the org-effective policy (absent = inherit,
   * false = off, true = on); project entries win over the org for gates. Pass
   * null to clear the project's overrides so it inherits the org again. Returns
   * the success payload so callers can assert on `warnings`.
   *
   * The query is byte-identical to the app's `updateProjectScanPolicy` mutation
   * (services/app/src/graphql/mutations.graphql) — including `status` — so it
   * matches that already-allowlisted operation instead of needing a separate
   * (test-only) entry in the shipped CLI schema.
   *
   * @param {string} projectId
   * @param {string | null} policyJson - JSON-encoded ScanPolicyDoc or null.
   * @returns {Promise<{storedPolicyJson: string | null, warnings: string[]}>}
   */
  async updateProjectScanPolicy(projectId, policyJson) {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query:
          'mutation updateProjectScanPolicy($projectId: String!, $policyJson: String) {\n  updateProjectScanPolicy(projectId: $projectId, policyJson: $policyJson) {\n    __typename\n    ... on ScanPolicyUpdateSuccess {\n      status\n      storedPolicyJson\n      warnings\n    }\n    ... on ScanPolicyValidationError {\n      status\n      error\n    }\n    ... on ScanPolicyRelaxLockError {\n      status\n      error\n      violationsJson\n    }\n  }\n}',
        variables: { projectId, policyJson },
        operationName: 'updateProjectScanPolicy',
      }),
      method: 'POST',
    })

    const body = await response.json()
    const result = body.data?.updateProjectScanPolicy

    if (body.errors || result?.__typename !== 'ScanPolicyUpdateSuccess') {
      throw new Error(
        `Failed to update project scan policy ${JSON.stringify(body, null, 2)}`
      )
    }

    return result
  }

  /**
   * MOBB-3810 — the distinct OpenGrep rule ids of a report's findings, read
   * from each issue's extra_data.rule_id (persisted by the engine under
   * --no-rewrite-rule-ids). Findings without a rule id are skipped.
   *
   * @param {string} fixReportId
   * @returns {Promise<string[]>}
   */
  async getReportFindingRuleIds(fixReportId) {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query:
          'query GetReportFindingRuleIds($fixReportId: uuid!) {\n  fixReport_by_pk(id: $fixReportId) {\n    vulnerabilityReport {\n      vulnerabilityReportIssues {\n        extraData(path: "rule_id")\n      }\n    }\n  }\n}',
        variables: { fixReportId },
        operationName: 'GetReportFindingRuleIds',
      }),
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to read report finding rule ids ${JSON.stringify(body, null, 2)}`
      )
    }

    const issues =
      body.data?.fixReport_by_pk?.vulnerabilityReport
        ?.vulnerabilityReportIssues ?? []
    return [
      ...new Set(
        issues
          .map((issue) => issue.extraData)
          .filter((ruleId) => typeof ruleId === 'string' && ruleId.length > 0)
      ),
    ]
  }

  /**
   * Create new Mobb API token.
   *
   * @returns {Promise<string>}
   */
  async createApiToken() {
    const response = await fetch(CLI_LOCAL_ENV_OVERWRITE.API_URL, {
      headers: {
        authorization: `Bearer ${this.#auth0Token}`,
        'content-type': 'application/json',
      },
      body: '{"query":"\\n    mutation CreateToken($tokenName: String!) {\\n  createToken(tokenName: $tokenName) {\\n    token\\n    name\\n  }\\n}\\n    ","variables":{"tokenName":"test"},"operationName":"CreateToken"}',
      method: 'POST',
    })

    const body = await response.json()

    if (body.errors) {
      throw new Error(
        `Failed to create API token ${JSON.stringify(body, null, 2)}`
      )
    }

    return body.data.createToken.token
  }
}

export const mobbApi = new MobbApi()
