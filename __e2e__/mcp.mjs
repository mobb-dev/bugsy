/* eslint-disable simple-import-sort/imports, no-trailing-spaces */
import { test } from 'node:test'
import path from 'path'
import { expect } from 'expect'
import { SnapshotState, toMatchSnapshot } from 'jest-snapshot'
import { LoggerServer } from './helpers/LoggerServer.mjs'

import {
  assert,
  assertDeepEqual,
  assertIncludes,
} from './helpers/assertions.mjs'

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

const assertTextMatch = (actualText, snapshotName) => {
  // tie Jest-snapshot into bare expect by setting state for each assertion
  expect.setState({ snapshotState, currentTestName: snapshotName })
  expect(actualText).toMatchSnapshot()
}

test('Bugsy MCP E2E tests', async (t) => {
  let client
  let serverProcess
  let tempDir
  let tempDirExistingReport
  /** @type {LoggerServer} */
  let loggerServer

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

    // Start lightweight HTTP logger server
    loggerServer = new LoggerServer()
    await loggerServer.start()

    console.log('Logger server listening on port 4444')
  })

  await t.beforeEach(async () => {
    client = new MCPClient()
    const apiKey = await mobbApi.createApiToken()
    console.log('apiKey', apiKey.slice(0, 10) + '...')
    serverProcess = await client.connect(
      'node',
      [path.join(process.cwd(), '..', 'dist', 'index.mjs'), 'mcp'],
      {
        API_URL: 'http://localhost:8080/v1/graphql',
        MOBB_API_KEY: apiKey,
      }
    )
    console.log('connected to MCP server')
    loggerServer.reset()
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

    if (loggerServer) {
      await loggerServer.stop()
    }
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
            name: 'scan_and_fix_vulnerabilities',
            display_name: 'Scan and Fix Vulnerabilities',
            description: `Scans a given local repository for security vulnerabilities and returns auto-generated code fixes.

When to invoke:
• Use when the user explicitly asks to "scan for vulnerabilities", "run a security check", or "test for security issues" in a local repository.
• The repository must exist on disk; supply its absolute path with the required "path" argument.
• Ideal after the user makes code changes (added/modified/staged files) but before committing, or whenever they request a full rescan.

How to invoke:
• Required argument:
  – path (string): absolute path to the repository root.
• Optional arguments:
  – offset (number): pagination offset used when the result set is large.
  – limit (number): maximum number of fixes to include in the response.
  – maxFiles (number): maximum number of files to scan (default: 10). Provide this value to increase the scope of the scan.
  – rescan (boolean): true to force a complete rescan even if cached results exist.

Behaviour:
• If the directory is a valid Git repository, the tool scans the changed files in the repository. If there are no changes, it scans the files included in the las commit.
• If the directory is not a valid Git repository, the tool falls back to scanning recently changed files in the folder.
• If maxFiles is provided, the tool scans the maxFiles most recently changed files in the repository.
• By default, only new, modified, or staged files are scanned; if none are found, it checks recently changed files.
• The tool NEVER commits or pushes changes; it only returns proposed diffs/fixes as text.

Return value:
The response is an object with a single "content" array containing one text element. The text is either:
• A human-readable summary of the fixes / patches, or
• A diagnostic or error message if the scan fails or finds nothing to fix.

Example payload:
{
  "path": "/home/user/my-project",
  "limit": 20,
  "maxFiles": 50,
  "rescan": false
}`,
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description:
                    'Full local path to repository to scan and fix vulnerabilities',
                },
                rescan: {
                  type: 'boolean',
                  description: '[Optional] whether to rescan the repository',
                },
                limit: {
                  type: 'number',
                  description: '[Optional] maximum number of results to return',
                },
                offset: {
                  type: 'number',
                  description: '[Optional] offset for pagination',
                },
                maxFiles: {
                  type: 'number',
                  description:
                    '[Optional] maximum number of files to scan (default: 10). Use higher values for more comprehensive scans or lower values for faster performance.',
                },
              },
              required: ['path'],
            },
          },
          {
            name: 'fetch_available_fixes',
            display_name: 'Fetch Available Fixes',
            description: `Check the MOBB backend for pre-generated fixes (patch sets) that correspond to vulnerabilities detected in the supplied Git repository.

Use when:
• You already have a local clone of a Git repository and want to know if MOBB has fixes available for it.
• A vulnerability scan has been run previously and uploaded to the MOBB backend and you want to fetch the list or count of ready-to-apply fixes before triggering a full scan-and-fix flow.

Required argument:
• path – absolute path to the local Git repository clone.

Optional arguments:
• offset – pagination offset (integer).
• limit  – maximum number of fixes to return (integer).

The tool will:
1. Validate that the provided path is secure and exists.
2. Verify that the directory is a valid Git repository with an "origin" remote.
3. Query the MOBB service by the origin remote URL and return a textual summary of available fixes (total and by severity) or a message if none are found.

Call this tool instead of scan_and_fix_vulnerabilities when you only need a fixes summary and do NOT want to perform scanning or code modifications.`,
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
              },
              required: ['path'],
            },
          },
          {
            name: 'check_for_new_available_fixes',
            display_name: 'Check for New Available Fixes',
            description: `Continuesly monitors your code and scans for new security vulnerabilities.

When to invoke:
• ALWAYS call this tool ONCE at the very end of every reasoning / code-generation session (after all code edits, linting, tests, etc.).
• Invoke when the user explicitly asks to "check for new fixes", "look for fresh patches", or similar.
• The repository must exist locally and be a valid Git repo with an 'origin' remote configured.

How to invoke:
• Required argument:
  – path (string): absolute path to the repository root.

Behaviour:
• If no new fixes are available, it returns a concise message indicating so.
• If fixes are found, it returns a human-readable summary including total count and severity breakdown.

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
      loggerServer.dump()
      throw error
    }
  })

  await t.test('MCP: scan and fix vulnerabilities', async () => {
    try {
      console.log('scanning and fixing vulnerabilities')
      const response = await client.callTool('scan_and_fix_vulnerabilities', {
        path: tempDir,
      })

      // console.log('scan_and_fix_vulnerabilities response', response)

      // Basic assertion to ensure we have a response
      assert(response, 'Response should exist')
      assert(response.content, 'Response should have content property')
      assert(Array.isArray(response.content), 'Content should be an array')
      assert(response.content.length > 0, 'Content array should not be empty')

      // Extract the actual text from the response
      const actualText = response.content[0].text

      // Check if the actual text starts with the expected text
      assertTextMatch(actualText, 'scan_and_fix_vulnerabilities_start')

      // Check if the actual text ends with the expected text
      assertTextMatch(actualText, 'scan_and_fix_vulnerabilities_end')

      // Check that the response contains at least one fix
      assertIncludes(
        actualText,
        '## Fix 1:',
        'Response should include at least one fix'
      )

      // Make a second call to get the next batch of fixes
      console.log('getting next batch of fixes')
      const nextBatchResponse = await client.callTool(
        'scan_and_fix_vulnerabilities',
        {
          path: tempDir,
        }
      )

      // console.log('next batch response', nextBatchResponse)

      // Basic assertion to ensure we have a response for the next batch
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

      // Extract the actual text from the next batch response
      const nextBatchText = nextBatchResponse.content[0].text

      // Check that the next batch response contains the expected fix numbers
      assertIncludes(
        nextBatchText,
        '## Fix 4:',
        'Next batch should include Fix 4'
      )

      // Verify we're not getting the same fixes as the first batch
      assertIncludes(
        nextBatchText,
        '## Fix 1:',
        'Next batch should not include Fix 1',
        false
      )

      // Make a third call with a larger limit that overlaps with previous batches
      console.log('getting comprehensive batch of fixes')
      const largeBatchResponse = await client.callTool(
        'scan_and_fix_vulnerabilities',
        {
          path: tempDir,
          offset: 5,
          limit: 20,
        }
      )

      // console.log('large batch response', largeBatchResponse)

      // Basic assertion to ensure we have a response for the large batch
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

      // Extract the actual text from the large batch response
      const largeBatchText = largeBatchResponse.content[0].text

      // Check that the large batch response contains the expected fix numbers
      assertIncludes(
        largeBatchText,
        '## Fix 6:',
        'Large batch should include Fix 6'
      )

      assertIncludes(
        largeBatchText,
        '## Fix 13:',
        'Large batch should include Fix 13'
      )

      // Verify that we don't have fixes from the first batch
      assertIncludes(
        largeBatchText,
        '## Fix 14:',
        'Large batch should include Fix 14',
        false
      )
      assertIncludes(
        largeBatchText,
        '## Fix 5:',
        'Large batch should include Fix 5 (overlapping with previous batch)',
        false
      )

      // Make a fourth call with rescan=true to test reanalysis
      console.log('rescanning for vulnerabilities')
      const rescanResponse = await client.callTool(
        'scan_and_fix_vulnerabilities',
        {
          path: tempDir,
          rescan: true,
        }
      )

      // Basic assertion to ensure we have a response for the rescan
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

      // Extract the actual text from the rescan response
      const rescanText = rescanResponse.content[0].text

      // Verify the rescan response has the standard text structures
      assertTextMatch(rescanText, 'rescan_start')
      assertTextMatch(rescanText, 'rescan_end')

      // Check that the rescan response contains the expected fix format
      assertIncludes(
        rescanText,
        '## Fix 1:',
        'Rescan should include the first fix'
      )

      // Verify rescan found at least 3 fixes (the same number as our first batch)
      assertIncludes(
        rescanText,
        '## Fix 3:',
        'Rescan should find at least 3 fixes'
      )
    } catch (error) {
      loggerServer.dump()
      throw error
    }
  })

  await t.test('MCP: fetch available fixes', async () => {
    try {
      const bugsy = npm.npx(
        [
          'mobbdev',
          'analyze',
          '-r',
          'https://github.com/mobb-dev/simple-vulnerable-java-project',
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
      // eslint-disable-next-line no-constant-condition
      let isReportUploaded = false
      while (!isReportUploaded) {
        response = await client.callTool('fetch_available_fixes', {
          path: tempDirExistingReport,
          limit: 1,
          offset: 0,
        })
        if (
          response.content[0].text.includes(
            'Total number of fixes available: **3**'
          )
        ) {
          isReportUploaded = true
          break
        }
        console.log('waiting for fixes to be available')
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      const responseText = response.content[0].text

      assertIncludes(
        responseText,
        '## Fix 1:',
        'Rescan should include the first fix'
      )
      assertIncludes(
        responseText,
        '## Fix 2:',
        'Response should NOT include Fix 2',
        false
      )
      const response2 = await client.callTool('fetch_available_fixes', {
        path: tempDirExistingReport,
        limit: 1,
        offset: 1,
      })
      const response2Text = response2.content[0].text
      assertIncludes(
        response2Text,
        '## Fix 2:',
        'Rescan should include the second fix'
      )
      assertIncludes(
        response2Text,
        '## Fix 3:',
        'Rescan should not include Fix 3',
        false
      )
      const response3 = await client.callTool('fetch_available_fixes', {
        path: tempDirExistingReport,
        limit: 10,
        offset: 1,
      })
      const response3Text = response3.content[0].text

      assertIncludes(
        response3Text,
        '## Fix 2:',
        'Rescan should include Fix 2 (third check)'
      )
      assertIncludes(
        response3Text,
        '## Fix 3:',
        'Rescan should include Fix 3 (fourth)'
      )
      assertIncludes(
        response3Text,
        '## Fix 4:',
        'Rescan should not include Fix 4',
        false
      )
    } catch (error) {
      loggerServer.dump()
      throw error
    }
  })
})
