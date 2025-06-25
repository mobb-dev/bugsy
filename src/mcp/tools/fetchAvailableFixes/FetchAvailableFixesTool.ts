import { z } from 'zod'

import { GitService } from '../../../features/analysis/scm/git/GitService'
import { log, logInfo } from '../../Logger'
import { validatePath } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
import { FetchAvailableFixesService } from './FetchAvailableFixesService'

export class FetchAvailableFixesTool extends BaseTool {
  name = 'fetch_available_fixes'
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

The tool will:
1. Validate that the provided path is secure and exists.
2. Verify that the directory is a valid Git repository with an "origin" remote.
3. Query the MOBB service by the origin remote URL and return a textual summary of available fixes (total and by severity) or a message if none are found.

Call this tool instead of scan_and_fix_vulnerabilities when you only need a fixes summary and do NOT want to perform scanning or code modifications.`

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
  })
  private availableFixesService: FetchAvailableFixesService

  constructor() {
    super()
    this.availableFixesService = FetchAvailableFixesService.getInstance()
    this.availableFixesService.reset()
  }

  async executeInternal(args: z.infer<typeof this.inputValidationSchema>) {
    // override async executeInternal(
    //   args: z.infer<typeof this.inputSchema>
    // ): Promise<ToolResponse> {
    // Validate the path for security and existence
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

    // Get repository URLs
    const repoUrls = await gitService.getRepoUrls()

    // For active repositories, ensure we have an origin remote
    if (Object.keys(repoUrls).length > 0 && !repoUrls['origin']) {
      throw new Error('Repository must have an origin remote')
    }

    const originUrl = repoUrls['origin']?.fetch
    if (!originUrl) {
      throw new Error('No origin URL found for the repository')
    }

    // Check for available fixes using the origin URL
    const fixResult = await this.availableFixesService.checkForAvailableFixes({
      repoUrl: originUrl,
      limit: args.limit,
      offset: args.offset,
    })
    logInfo('FetchAvailableFixesTool execution completed successfully', {
      fixResult,
    })
    return {
      content: [
        {
          type: 'text',
          text: fixResult,
        },
      ],
    }
  }
}

//     // If latestReport is a string, it's the noReportFoundPrompt
//     if (typeof latestReport === 'string') {
//       return {
//         content: [
//           {
//             type: 'text',
//             text: latestReport,
//           },
//         ],
//       }
//     }

//     // At this point, latestReport is guaranteed to be a FixReport
//     const report = latestReport as FixReport

//     // Format the response with fix counts by severity
//     const fixCounts = {
//       total: report.fixes_aggregate?.aggregate?.count ?? 0,
//       critical: report.CRITICAL?.aggregate?.count ?? 0,
//       high: report.HIGH?.aggregate?.count ?? 0,
//       medium: report.MEDIUM?.aggregate?.count ?? 0,
//       low: report.LOW?.aggregate?.count ?? 0,
//     }

//     const responseText = `Found ${fixCounts.total} available fixes:
// - Critical: ${fixCounts.critical}
// - High: ${fixCounts.high}
// - Medium: ${fixCounts.medium}
// - Low: ${fixCounts.low}

// Latest scan date: ${report.vulnerabilityReport?.scanDate ? new Date(report.vulnerabilityReport.scanDate).toLocaleString() : 'Unknown'}
// Vendor: ${report.vulnerabilityReport?.vendor || 'Unknown'}`

//     return {
//       content: [
//         {
//           type: 'text',
//           text: responseText,
//         },
//       ],
//     }
//   }
