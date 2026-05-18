import z from 'zod'

import { ScanContext } from '../../../types'
import {
  MCP_DEFAULT_MAX_FILES_TO_SCAN,
  MCP_MAX_FILE_SIZE,
} from '../../core/configs'
import {
  interactiveAnswersAbstainAllToolResponse,
  noChangedFilesFoundPrompt,
} from '../../core/prompts'
import { logDebug, logError } from '../../Logger'
import { getLocalFiles } from '../../services/GetLocalFiles'
import { validatePath } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
import { MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES } from '../toolNames'
import { ScanAndFixVulnerabilitiesService } from './ScanAndFixVulnerabilitiesService'

export class ScanAndFixVulnerabilitiesTool extends BaseTool {
  name = MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES
  displayName = 'Scan and Fix Vulnerabilities'
  description = `Scans a given local repository for security vulnerabilities, applies the auto-fixable ones, and surfaces any fix that needs your input as an "Interactive fix". Re-invoke with "interactiveAnswers" to apply those.

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
  – maxFiles (number): maximum number of files to scan (default: ${MCP_DEFAULT_MAX_FILES_TO_SCAN}). Provide this value to increase the scope of the scan.
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
    interactiveAnswers: z
      .array(
        z.object({
          fixId: z
            .string()
            .min(1)
            .describe('Fix id from a previous "Interactive fix" prompt block.'),
          answers: z
            .array(
              z.object({
                key: z.string().min(1).describe('FixQuestion key.'),
                value: z
                  .string()
                  .describe(
                    'For SELECT questions MUST be one of the listed options; for TEXT/NUMBER, a free-form value.'
                  ),
              })
            )
            .min(1),
        })
      )
      .optional()
      .describe(
        'When supplied (including []), SKIPS scanning. Non-empty: apply each listed interactive fix. Empty []: abstain from all interactive fixes — no patches applied. Omit entirely for scan mode.'
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
      interactiveAnswers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fixId: {
              type: 'string',
              description: 'Fix id from a previous "Interactive fix" prompt.',
            },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string', description: 'FixQuestion key.' },
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
      mode:
        args.interactiveAnswers === undefined
          ? 'scan'
          : args.interactiveAnswers.length === 0
            ? 'apply-interactive-abstain-all'
            : 'apply-with-answers',
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

    if (args.interactiveAnswers !== undefined) {
      if (args.interactiveAnswers.length === 0) {
        return this.createSuccessResponse(
          interactiveAnswersAbstainAllToolResponse
        )
      }
      try {
        const result =
          await this.vulnerabilityFixService.applyInteractiveAnswers({
            interactiveAnswers: args.interactiveAnswers,
            repositoryPath: path,
          })
        return this.createSuccessResponse(result)
      } catch (error) {
        const message = (error as Error).message
        logError('Tool execution failed (apply-with-answers)', {
          error: message,
        })
        return this.createSuccessResponse(message)
      }
    }

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
