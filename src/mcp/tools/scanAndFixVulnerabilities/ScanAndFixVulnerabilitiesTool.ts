import z from 'zod'

import { FileUtils } from '../../../features/analysis/scm/FileUtils'
import { GitService } from '../../../features/analysis/scm/git/GitService'
import { log, logDebug, logInfo } from '../../Logger'
import { validatePath } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
// Reuse the existing vulnerability fix service implementation
import { ScanAndFixVulnerabilitiesService } from './ScanAndFixVulnerabilitiesService'

export class ScanAndFixVulnerabilitiesTool extends BaseTool {
  name = 'scan_and_fix_vulnerabilities'
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
  – rescan (boolean): true to force a complete rescan even if cached results exist.

Behaviour:
• If the directory is not a valid Git repository, the tool falls back to scanning recently changed files in the folder.
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
  "rescan": false
}`

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
    rescan: z
      .boolean()
      .optional()
      .describe('Optional whether to rescan the repository'),
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
      rescan: {
        type: 'boolean',
        description: '[Optional] whether to rescan the repository',
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
    logInfo('Executing tool: scan_and_fix_vulnerabilities', { path: args.path })

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

    // Validate git repository - let validation errors bubble up as MCP errors
    const gitService = new GitService(path, log)
    const gitValidation = await gitService.validateRepository()
    let files: string[] = []
    if (!gitValidation.isValid) {
      logDebug(
        'Git repository validation failed, using all files in the repository',
        {
          path,
        }
      )
      files = FileUtils.getLastChangedFiles(path)
      logDebug('Found files in the repository', {
        files,
        fileCount: files.length,
      })
    } else {
      const gitResult = await gitService.getChangedFiles()
      files = gitResult.files
      if (files.length === 0) {
        const recentResult = await gitService.getRecentlyChangedFiles()
        files = recentResult.files
        logDebug(
          'No changes found, using recently changed files from git history',
          {
            files,
            fileCount: files.length,
            commitsChecked: recentResult.commitCount,
          }
        )
      } else {
        logDebug('Found changed files in the git repository', {
          files,
          fileCount: files.length,
        })
      }
    }

    // Check if there are files to process
    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No changed files found in the repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
          },
        ],
      }
    }

    try {
      // Process vulnerabilities

      const fixResult =
        await this.vulnerabilityFixService.processVulnerabilities({
          fileList: files,
          repositoryPath: path,
          offset: args.offset,
          limit: args.limit,
          isRescan: args.rescan,
        })

      const result = {
        content: [
          {
            type: 'text',
            text: fixResult,
          },
        ],
      }

      logInfo('Tool execution completed successfully', {
        resultLength: fixResult.length,
        fileCount: files.length,
        result: result,
      })

      return result
    } catch (error) {
      // Return error as text content for processing errors (not validation errors)
      const errorResult = {
        content: [
          {
            type: 'text',
            text: (error as Error).message,
          },
        ],
      }

      logInfo('Tool execution failed', {
        error: (error as Error).message,
        result: errorResult,
      })

      return errorResult
    }
  }
}
