import z from 'zod'

import { ScanContext } from '../../../types'
import {
  MCP_DEFAULT_MAX_FILES_TO_SCAN,
  MCP_MAX_FILE_SIZE,
} from '../../core/configs'
import { noChangedFilesFoundPrompt } from '../../core/prompts'
import { logDebug, logError } from '../../Logger'
import { getLocalFiles } from '../../services/GetLocalFiles'
import { validatePath } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
import { MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES } from '../toolNames'
// Reuse the existing vulnerability fix service implementation
import { ScanAndFixVulnerabilitiesService } from './ScanAndFixVulnerabilitiesService'

export class ScanAndFixVulnerabilitiesTool extends BaseTool {
  name = MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES
  displayName = 'Scan and Fix Vulnerabilities'
  // A detailed description to guide the LLM on when and how to invoke this tool.
  description = `Scans a given local repository for security vulnerabilities and returns auto-generated code fixes.

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
  – maxFiles (number): maximum number of files to scan (default: ${MCP_DEFAULT_MAX_FILES_TO_SCAN}). Provide this value to increase the scope of the scan.
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
}`

  hasAuthentication = true

  inputValidationSchema = z.object({
    path: z
      .string()
      .describe(
        'Full local path to repository to scan and fix vulnerabilities'
      ),
    offset: z.number().optional().describe('Optional offset for pagination'),
    limit: z
      .number()
      .optional()
      .describe('Optional maximum number of results to return'),
    maxFiles: z
      .number()
      .optional()
      .describe(
        `Optional maximum number of files to scan (default: ${MCP_DEFAULT_MAX_FILES_TO_SCAN}). Increase for comprehensive scans of larger codebases or decrease for faster focused scans.`
      ),
    rescan: z
      .boolean()
      .optional()
      .describe('Optional whether to rescan the repository'),
    scanRecentlyChangedFiles: z
      .boolean()
      .optional()
      .describe(
        'Optional whether to automatically scan recently changed files when no changed files are found in git status. If false, the tool will prompt the user instead.'
      ),
  })

  inputSchema = {
    type: 'object' as const,
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
        description: `[Optional] maximum number of files to scan (default: ${MCP_DEFAULT_MAX_FILES_TO_SCAN}). Use higher values for more comprehensive scans or lower values for faster performance.`,
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
    },
    required: ['path'],
  }

  private vulnerabilityFixService: ScanAndFixVulnerabilitiesService

  constructor() {
    super()
    this.vulnerabilityFixService =
      ScanAndFixVulnerabilitiesService.getInstance()
    this.vulnerabilityFixService.reset()
  }

  async executeInternal(args: z.infer<typeof this.inputValidationSchema>) {
    logDebug(`Executing tool: ${this.name}`, {
      path: args.path,
    })

    if (!args.path) {
      throw new Error("Invalid arguments: Missing required parameter 'path'")
    }
    // Validate the path for security and existence
    const pathValidationResult = await validatePath(args.path)

    if (!pathValidationResult.isValid) {
      throw new Error(
        `Invalid path: potential security risk detected in path: ${pathValidationResult.error}`
      )
    }

    const path = pathValidationResult.path
    const files = await getLocalFiles({
      path,
      maxFileSize: MCP_MAX_FILE_SIZE,
      maxFiles: args.maxFiles,
      scanContext: ScanContext.USER_REQUEST,
      scanRecentlyChangedFiles: args.scanRecentlyChangedFiles,
    })

    logDebug('Files', { files })
    // Check if there are files to process
    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: noChangedFilesFoundPrompt,
          },
        ],
      }
    }

    try {
      // Process vulnerabilities

      const fixResult =
        await this.vulnerabilityFixService.processVulnerabilities({
          fileList: files.map((file) => file.relativePath),
          repositoryPath: path,
          offset: args.offset,
          limit: args.limit,
          isRescan: args.rescan || !!args.maxFiles,
        })

      const successResponse = this.createSuccessResponse(fixResult)

      logDebug('Tool execution completed successfully', {
        resultLength: fixResult.length,
        fileCount: files.length,
        result: successResponse,
      })

      return successResponse
    } catch (error) {
      // Return error as text content for processing errors (not validation errors)
      const errorResponse = this.createSuccessResponse((error as Error).message)

      logError('Tool execution failed', {
        error: (error as Error).message,
        result: errorResponse,
      })

      return errorResponse
    }
  }
}
