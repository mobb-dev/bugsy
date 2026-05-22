/* eslint-disable simple-import-sort/imports, no-trailing-spaces */
import { test } from 'node:test'
import path from 'path'
import { expect } from 'expect'
import { SnapshotState, toMatchSnapshot } from 'jest-snapshot'
import { dumpLogs } from './helpers/dumpLogs.mjs'
import { assert, assertDeepEqual } from './helpers/assertions.mjs'

import {
  addSpaceToSpecificFiles,
  cleanupRepository,
  cloneRepository,
} from './helpers/GitHubHelper.mjs'
import { MCPClient } from './helpers/MCPClient.mjs'
import { mobbApi } from './MobbApi.mjs'
import { npm } from './Npm.mjs'
import { registry } from './Registry.mjs'
import { CLI_LOCAL_ENV_OVERWRITE, SVJP_CX_REPORT } from './utils.mjs'

const MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES = 'check_for_new_available_fixes'

const MCP_TOOL_FETCH_AVAILABLE_FIXES = 'fetch_available_fixes'

const MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES = 'scan_and_fix_vulnerabilities'

// configure snapshot state once per file
const snapshotFile = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '__snapshots__',
  path.basename(new URL(import.meta.url).pathname) + '.snap'
)
const snapshotState = new SnapshotState(snapshotFile, {
  updateSnapshot: process.env.UPDATE_SNAPSHOTS ? 'all' : 'new',
})

expect.extend({ toMatchSnapshot })

// persist snapshots when node:test finishes
process.on('exit', () => {
  snapshotState.save()
})

test('Bugsy MCP E2E tests', async (t) => {
  let client
  let serverProcess
  let tempDir
  let tempDirExistingReport
  /** @type {LoggerServer} */

  await t.before(async () => {
    // Clone WebGoat repository to a temporary directory
    tempDir = await cloneRepository('https://github.com/WebGoat/WebGoat.git')
    tempDirExistingReport = await cloneRepository(
      'https://github.com/mobb-dev/simple-vulnerable-java-project.git'
    )

    console.log('tempDirExistingReport', tempDirExistingReport)
    console.log('tempDir', tempDir)
    // Define specific Java files to modify
    const targetFiles = [
      'JWTVotesEndpoint.java',
      'SpoofCookieAssignment.java',
      'HijackSessionAssignment.java',
      'EncodingAssignment.java',
      'HashingAssignment.java',
      'ImageServlet.java',
      'HijackSessionAuthenticationProvider.java',
      'JWTSecretKeyEndpoint.java',
    ]

    // Find and modify only the specified files
    await addSpaceToSpecificFiles(tempDir, targetFiles)

    // Get and display git status
    // const status = getGitStatus(tempDir)
    // console.log('Git status after modifying Java files:')
    // console.log(status)

    await mobbApi.init()
    // Start local Verdaccio registry
    await registry.start()
    await npm.init()
  })

  await t.beforeEach(async () => {
    client = new MCPClient()
    const apiKey = await mobbApi.createApiToken()
    console.log(
      'apiKey',
      String(apiKey.slice(0, 10)).replace(/\n|\r/g, '') + '...'
    )
    serverProcess = await client.connect(
      'node',
      [path.join(process.cwd(), '..', 'dist', 'index.mjs'), 'mcp'],
      {
        API_URL: 'http://localhost:8080/v1/graphql',
        MOBB_API_KEY: apiKey,
      }
    )
    console.log('connected to MCP server')
    await npm.cleanConfigstore()
  })

  await t.afterEach(async () => {
    if (client) {
      await client.disconnect()
    }
    if (serverProcess) {
      serverProcess.kill('SIGTERM')
    }
  })

  await t.after(async () => {
    // Clean up temp directory
    await cleanupRepository(tempDir)
    await registry.stop()
    await npm.destroy()
  })

  await t.test('MCP: list tools', async () => {
    try {
      console.log('listing tools')
      const response = await client.listTools()

      // First perform basic structure assertions
      assert(response, 'Response should exist')
      assert(response.tools, 'Response should have tools property')
      assert(Array.isArray(response.tools), 'Tools should be an array')

      // Assert expected response structure with detailed error reporting
      const expectedResponse = {
        tools: [
          {
            name: MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
            description: `Scans a given local repository for security vulnerabilities, applies the auto-fixable ones, and surfaces any fix that needs your input as an "Interactive fix". Re-invoke with "interactiveAnswers" to apply those.

Two modes of operation:

A) SCAN MODE (default — interactiveAnswers omitted)
   - Scans changed/recent files at "path"
   - Auto-applies fixes that need no input
   - Returns "Interactive fix" entries for fixes that need decisions; you (the AI) decide answers from the surrounding code

B) APPLY-WITH-ANSWERS MODE (interactiveAnswers field supplied — array may be empty or partial)
   - SKIPS scanning entirely (does NOT fall back to scan mode just because some fixes were skipped)
   - Include ONLY fixes where answers are justified by code/context; omit fix IDs you are not confident about
   - Empty array []: abstain from applying ALL interactive fixes (no patches fetched — summarize skips for the user)

When to invoke:
• Mode A — when the user asks to "scan for vulnerabilities", "run a security check", or after they make code changes.
• Mode B — immediately after Mode A returns interactive fixes; pass confident answers only; use [] only when abstaining from every interactive fix.

How to invoke:
• Required argument:
  – path (string): absolute path to the repository root.
• Optional arguments:
  – offset (number): pagination offset used when the result set is large.
  – limit (number): maximum number of fixes to include in the response.
  – maxFiles (number): maximum number of files to scan (default: 10). Provide this value to increase the scope of the scan.
  – rescan (boolean): true to force a complete rescan even if cached results exist.
  – interactiveAnswers (array): triggers Mode B. Each entry: { fixId, answers: [{ key, value }] }. SELECT values MUST be exact strings from the option list. Omit fixes you cannot answer confidently. Use [] to abstain from all interactive fixes without rescanning.

Behaviour (Mode A):
• If the directory is a valid Git repository, the tool scans the changed files in the repository. If there are no changes, it scans the files included in the last commit.
• If the directory is not a valid Git repository, the tool falls back to scanning recently changed files in the folder.
• If maxFiles is provided, the tool scans the maxFiles most recently changed files in the repository.
• The tool NEVER commits or pushes changes.

Return value:
A "content" array with one text element. Either a human-readable summary of fixes/patches, an interactive-fix prompt, an apply-with-answers result, or an error message.

Example payload (Mode A):
{ "path": "/home/user/my-project", "limit": 20, "maxFiles": 50 }

Example payload (Mode B — subset or abstain):
{
  "path": "/home/user/my-project",
  "interactiveAnswers": [
    { "fixId": "abc-123", "answers": [{ "key": "isServerSideCode", "value": "yes" }] }
  ]
}

Example payload (Mode B — abstain from every interactive fix, no rescan):
{
  "path": "/home/user/my-project",
  "interactiveAnswers": []
}`,
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description:
                    'Full local path to repository to scan and fix vulnerabilities',
                },
                offset: {
                  type: 'number',
                  description: '[Optional] offset for pagination',
                },
                limit: {
                  type: 'number',
                  description: '[Optional] maximum number of results to return',
                },
                maxFiles: {
                  type: 'number',
                  description:
                    '[Optional] maximum number of files to scan (default: 10). Use higher values for more comprehensive scans or lower values for faster performance.',
                },
                rescan: {
                  type: 'boolean',
                  description: '[Optional] whether to rescan the repository',
                },
                scanRecentlyChangedFiles: {
                  type: 'boolean',
                  description:
                    '[Optional] whether to automatically scan recently changed files when no changed files are found in git status. If false, the tool will prompt the user instead.',
                },
                interactiveAnswers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      fixId: {
                        type: 'string',
                        description:
                          'Fix id from a previous "Interactive fix" prompt.',
                      },
                      answers: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            key: {
                              type: 'string',
                              description: 'FixQuestion key.',
                            },
                            value: {
                              type: 'string',
                              description:
                                'Decided value (SELECT must match an option exactly).',
                            },
                          },
                          required: ['key', 'value'],
                        },
                      },
                    },
                    required: ['fixId', 'answers'],
                  },
                  description:
                    '[Optional] When supplied (including []), skips scanning. Non-empty: apply interactive fixes with answers. Empty []: abstain from all interactive fixes without rescanning. Omit for scan mode.',
                },
              },
              required: ['path'],
            },
          },
          {
            name: MCP_TOOL_FETCH_AVAILABLE_FIXES,
            description: `Check the MOBB backend for pre-generated fixes (patch sets) that correspond to vulnerabilities detected in the supplied Git repository.

Use when:
• You already have a local clone of a Git repository and want to know if MOBB has fixes available for it.
• A vulnerability scan has been run previously and uploaded to the MOBB backend and you want to fetch the list or count of ready-to-apply fixes before triggering a full scan-and-fix flow.

Required argument:
• path – absolute path to the local Git repository clone.

Optional arguments:
• offset – pagination offset (integer).
• limit  – maximum number of fixes to return (integer).
• fileFilter – list of file paths relative to the path parameter to filter fixes by. Only fixes affecting these files will be returned. INCOMPATIBLE with fetchFixesFromAnyFile.
• fetchFixesFromAnyFile – if true, fetches fixes for all files in the repository. If false or not set (default), filters fixes to only those affecting files with changes in git status. INCOMPATIBLE with fileFilter.

The tool will:
1. Validate that the provided path is secure and exists.
2. Verify that the directory is a valid Git repository with an "origin" remote.
3. Apply file filtering based on parameters (see below).
4. Query the MOBB service by the origin remote URL and return a textual summary of available fixes (total and by severity) or a message if none are found.

File Filtering Behavior:
• If fetchFixesFromAnyFile is true: Returns fixes for all files (no filtering).
• If fileFilter is provided: Returns only fixes affecting the specified files.
• If neither is provided (default): Returns only fixes affecting files with changes in git status.
• If BOTH are provided: Returns an error (parameters are mutually exclusive).

Call this tool instead of ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} when you only need a fixes summary and do NOT want to perform scanning or code modifications.`,
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description:
                    'Full local path to the cloned git repository to check for available fixes',
                },
                limit: {
                  type: 'number',
                  description: '[Optional] maximum number of results to return',
                },
                offset: {
                  type: 'number',
                  description: '[Optional] offset for pagination',
                },
                fileFilter: {
                  type: 'array',
                  items: { type: 'string' },
                  description:
                    '[Optional] list of file paths relative to the path parameter to filter fixes by. Only fixes affecting these files will be returned. INCOMPATIBLE with fetchFixesFromAnyFile',
                },
                fetchFixesFromAnyFile: {
                  type: 'boolean',
                  description:
                    '[Optional] if true, fetches fixes for all files in the repository. If false or not set, filters fixes to only those affecting files with changes in git status. INCOMPATIBLE with fileFilter',
                },
              },
              required: ['path'],
            },
          },
          {
            name: MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
            description: `Continuesly monitors your code and scans for new security vulnerabilities.

When to invoke:
• ALWAYS call this tool ONCE at the very end of every reasoning / code-generation session (after all code edits, linting, tests, etc.).
• Invoke when the user explicitly asks to "check for new fixes", "look for fresh patches", or similar.
• The repository must exist locally and be a valid Git repo with an 'origin' remote configured.

How to invoke:
• Required argument:
  – path (string): absolute path to the repository root.

Behaviour:
• If auto-fix is enabled: Returns a list of fixes that were automatically applied to your codebase.
• If auto-fix is disabled: Returns a list of fresh fixes available for manual review and application.
• If no fixes are available, it returns a concise message indicating so.
• Results include a human-readable summary with total count and severity breakdown.

Example payload:
{
  "path": "/home/user/my-project"
}`,
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description:
                    'Full local path to the cloned git repository to check for new available fixes',
                },
              },
              required: ['path'],
            },
          },
        ],
      }

      // Use custom assertion function to provide detailed error information
      assertDeepEqual(
        response,
        expectedResponse,
        'List tools response should match expected structure'
      )
    } catch (error) {
      dumpLogs(tempDir)
      throw error
    }
  })

  // Any fix block — `## Fix N:` is applicable, `### Interactive fix N:`
  // is one requiring user-supplied answers (MOBB-3604). Either proves the
  // backend returned a fix that this response is surfacing.
  const FIX_MARKER_RE = /^(## Fix \d+:|### Interactive fix \d+:)/m

  await t.test('MCP: scan and fix vulnerabilities', async () => {
    try {
      console.log('scanning and fixing vulnerabilities')
      const response = await client.callTool(
        MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
        {
          path: tempDir,
        }
      )

      assert(response, 'Response should exist')
      assert(response.content, 'Response should have content property')
      assert(Array.isArray(response.content), 'Content should be an array')
      assert(response.content.length > 0, 'Content array should not be empty')

      const actualText = response.content[0].text

      assert(
        FIX_MARKER_RE.test(actualText),
        'Response should include at least one fix (applicable or interactive)'
      )

      // Second call: pagination should yield a different page than the first.
      console.log('getting next batch of fixes')
      const nextBatchResponse = await client.callTool(
        MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
        {
          path: tempDir,
        }
      )

      assert(nextBatchResponse, 'Next batch response should exist')
      assert(
        nextBatchResponse.content,
        'Next batch response should have content property'
      )
      assert(
        Array.isArray(nextBatchResponse.content),
        'Next batch content should be an array'
      )
      assert(
        nextBatchResponse.content.length > 0,
        'Next batch content array should not be empty'
      )

      const nextBatchText = nextBatchResponse.content[0].text

      assert(
        FIX_MARKER_RE.test(nextBatchText),
        'Next batch should include at least one fix entry'
      )
      assert(
        nextBatchText !== actualText,
        'Next batch should not be identical to the first batch (pagination advanced)'
      )

      // Third call with explicit offset and larger limit — content should
      // differ from the default-limit calls above.
      console.log('getting comprehensive batch of fixes')
      const largeBatchResponse = await client.callTool(
        MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
        {
          path: tempDir,
          offset: 5,
          limit: 20,
        }
      )

      assert(largeBatchResponse, 'Large batch response should exist')
      assert(
        largeBatchResponse.content,
        'Large batch response should have content property'
      )
      assert(
        Array.isArray(largeBatchResponse.content),
        'Large batch content should be an array'
      )
      assert(
        largeBatchResponse.content.length > 0,
        'Large batch content array should not be empty'
      )

      const largeBatchText = largeBatchResponse.content[0].text

      assert(
        FIX_MARKER_RE.test(largeBatchText),
        'Large batch should include at least one fix entry'
      )

      // Fourth call with rescan=true to test reanalysis
      console.log('rescanning for vulnerabilities')
      const rescanResponse = await client.callTool(
        MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
        {
          path: tempDir,
          rescan: true,
        }
      )

      assert(rescanResponse, 'Rescan response should exist')
      assert(
        rescanResponse.content,
        'Rescan response should have content property'
      )
      assert(
        Array.isArray(rescanResponse.content),
        'Rescan content should be an array'
      )
      assert(
        rescanResponse.content.length > 0,
        'Rescan content array should not be empty'
      )

      const rescanText = rescanResponse.content[0].text

      assert(
        FIX_MARKER_RE.test(rescanText),
        'Rescan should surface at least one fix'
      )
    } catch (error) {
      dumpLogs(tempDir)
      throw error
    }
  })

  await t.test('MCP: fetch available fixes', async () => {
    try {
      const bugsy = await npm.npx(
        [
          'mobbdev',
          'analyze',
          '-r',
          // Mixed-case org/repo exercises the case-insensitive lookup path:
          // parseScmURL lowercases the URL fetch_available_fixes sends, while
          // the row stored here keeps the original case. Without _ilike on
          // repo.originalUrl, this test would fail to find the report.
          'https://github.com/Mobb-Dev/Simple-Vulnerable-Java-Project',
          '-f',
          SVJP_CX_REPORT,
        ],
        CLI_LOCAL_ENV_OVERWRITE
      )

      // Act
      await bugsy.waitForString(
        /Login to Mobb is Required, you will be redirected/
      )
      bugsy.sendEnterKey()
      await bugsy.waitForString(/If the page does not open automatically/)

      const loginId = bugsy
        .getOutput()
        .match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        )[0]
      await mobbApi.cliLogin(loginId)

      await bugsy.waitForString(/Hit any key to view available fixes/)
      await bugsy.sendEnterKey()
      await bugsy.waitForExit()

      // Assert
      assert(bugsy.getExitCode() === 0, 'Bugsy should exit with code 0')

      let response
      let isReportUploaded = false
      while (isReportUploaded === false) {
        response = await client.callTool(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
          path: tempDirExistingReport,
          limit: 1,
          offset: 0,
        })
        if (
          response.content[0].text.includes(
            'Total number of fixes available: **2**'
          )
        ) {
          isReportUploaded = true
          break
        }
        console.log('waiting for fixes to be available')
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      const responseText = response.content[0].text

      // SVJP returns 2 fixes (one applicable, one interactive). With limit=1
      // the page may carry either kind; assert any fix marker is present.
      assert(
        FIX_MARKER_RE.test(responseText),
        'Fetch available fixes response should include at least one fix entry'
      )

      const response2 = await client.callTool(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
        path: tempDirExistingReport,
        offset: 1,
        limit: 1,
      })
      const response2Text = response2.content[0].text
      assert(
        FIX_MARKER_RE.test(response2Text),
        'Second page should also include at least one fix entry'
      )
      assert(
        response2Text !== responseText,
        'Second page should differ from first (pagination advanced)'
      )

      const response3 = await client.callTool(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
        path: tempDirExistingReport,
        limit: 10,
        offset: 1,
      })
      const response3Text = response3.content[0].text

      assert(
        FIX_MARKER_RE.test(response3Text),
        'Large-limit fetch should include at least one fix entry'
      )
    } catch (error) {
      dumpLogs(tempDirExistingReport)
      throw error
    }
  })
})
