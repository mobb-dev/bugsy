import { z } from 'zod'

import { GitService } from '../../../features/analysis/scm/services/GitService'
import { log, logDebug } from '../../Logger'
import { validatePath } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
import {
  MCP_TOOL_FETCH_AVAILABLE_FIXES,
  MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
} from '../toolNames'
import { FetchAvailableFixesService } from './FetchAvailableFixesService'

export class FetchAvailableFixesTool extends BaseTool {
  name = MCP_TOOL_FETCH_AVAILABLE_FIXES
  displayName = 'Fetch Available Fixes'
  description = `Check the MOBB backend for pre-generated fixes (patch sets) that correspond to vulnerabilities detected in the supplied Git repository.

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

Call this tool instead of ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} when you only need a fixes summary and do NOT want to perform scanning or code modifications.`

  hasAuthentication = true

  inputSchema = {
    type: 'object' as const,
    properties: {
      path: {
        type: 'string',
        description:
          'Full local path to the cloned git repository to check for available fixes',
      },
      offset: {
        type: 'number',
        description: '[Optional] offset for pagination',
      },
      limit: {
        type: 'number',
        description: '[Optional] maximum number of results to return',
      },
      fileFilter: {
        type: 'array',
        items: {
          type: 'string',
        },
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
  }

  inputValidationSchema = z.object({
    path: z
      .string()
      .describe(
        'Full local path to the cloned git repository to check for available fixes'
      ),
    offset: z.number().optional().describe('Optional offset for pagination'),
    limit: z
      .number()
      .optional()
      .describe('Optional maximum number of fixes to return'),
    fileFilter: z
      .array(z.string())
      .optional()
      .describe(
        'Optional list of file paths relative to the path parameter to filter fixes by. INCOMPATIBLE with fetchFixesFromAnyFile'
      ),
    fetchFixesFromAnyFile: z
      .boolean()
      .optional()
      .describe(
        'Optional boolean to fetch fixes for all files. INCOMPATIBLE with fileFilter'
      ),
  })
  private availableFixesService: FetchAvailableFixesService

  constructor() {
    super()
    this.availableFixesService = FetchAvailableFixesService.getInstance()
    this.availableFixesService.reset()
  }

  async executeInternal(args: z.infer<typeof this.inputValidationSchema>) {
    const pathValidationResult = await validatePath(args.path)

    if (!pathValidationResult.isValid) {
      throw new Error(
        `Invalid path: potential security risk detected in path: ${pathValidationResult.error}`
      )
    }
    const path = pathValidationResult.path

    // Validate git repository
    const gitService = new GitService(path, log)
    const gitValidation = await gitService.validateRepository()
    if (!gitValidation.isValid) {
      throw new Error(`Invalid git repository: ${gitValidation.error}`)
    }

    // Get origin repository URL
    const originUrl = await gitService.getRemoteUrl()
    if (!originUrl) {
      throw new Error('No origin URL found for the repository')
    }

    // Validate mutually exclusive parameters
    if (args.fileFilter && args.fetchFixesFromAnyFile) {
      throw new Error(
        'Parameters "fileFilter" and "fetchFixesFromAnyFile" are mutually exclusive. ' +
          'Please provide only one of these parameters:\n' +
          '  - Use "fileFilter" to specify a custom list of files to filter by\n' +
          '  - Use "fetchFixesFromAnyFile: true" to fetch fixes for all files without filtering\n' +
          '  - Use neither to automatically filter by files with changes in git status (default behavior)'
      )
    }

    // Determine which file filter to use
    let actualFileFilter: string[] | undefined

    if (args.fetchFixesFromAnyFile === true) {
      // Fetch fixes for all files - no filtering
      actualFileFilter = undefined
      logDebug('Fetching fixes for all files (no filtering)')
    } else if (args.fileFilter && args.fileFilter.length > 0) {
      // Use the provided file filter
      actualFileFilter = args.fileFilter
      logDebug('Using provided file filter', { fileFilter: actualFileFilter })
    } else {
      // Default behavior: get files from git status
      logDebug('Getting files from git status for filtering')
      const gitStatusResult = await gitService.getChangedFiles()

      if (gitStatusResult.files.length === 0) {
        logDebug('No changed files found in git status')
        actualFileFilter = undefined
      } else {
        actualFileFilter = gitStatusResult.files
        logDebug('Using files from git status as filter', {
          fileCount: actualFileFilter.length,
          files: actualFileFilter,
        })
      }
    }

    // Check for available fixes using the origin URL
    const fixResult = await this.availableFixesService.checkForAvailableFixes({
      repoUrl: originUrl,
      limit: args.limit,
      offset: args.offset,
      fileFilter: actualFileFilter,
    })
    logDebug('FetchAvailableFixesTool execution completed successfully', {
      fixResult,
    })
    return this.createSuccessResponse(fixResult)
  }
}
