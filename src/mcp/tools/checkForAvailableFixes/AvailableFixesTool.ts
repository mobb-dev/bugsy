import { z } from 'zod'

import { GitService } from '../../../features/analysis/scm/git/GitService'
import { log, logInfo } from '../../Logger'
import { PathValidation } from '../../services/PathValidation'
import { BaseTool } from '../base/BaseTool'
import { AvailableFixesService } from './AvailableFixesService'

export class CheckForAvailableFixesTool extends BaseTool {
  name = 'check_for_available_fixes'
  displayName = 'Check for Available Fixes'
  description =
    'Checks if there are any available fixes for vulnerabilities in the project'

  inputSchema = {
    type: 'object' as const,
    properties: {
      path: {
        type: 'string',
        description:
          'Path to the local git repository to check for available fixes',
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
        'Path to the local git repository to check for available fixes'
      ),
    offset: z.number().optional().describe('Optional offset for pagination'),
    limit: z
      .number()
      .optional()
      .describe('Optional maximum number of fixes to return'),
  })

  async executeInternal(args: z.infer<typeof this.inputValidationSchema>) {
    // override async executeInternal(
    //   args: z.infer<typeof this.inputSchema>
    // ): Promise<ToolResponse> {
    // Validate the path for security and existence
    const pathValidation = new PathValidation()
    const pathValidationResult = await pathValidation.validatePath(args.path)

    if (!pathValidationResult.isValid) {
      throw new Error(
        `Invalid path: potential security risk detected in path: ${pathValidationResult.error}`
      )
    }

    // Validate git repository
    const gitService = new GitService(args.path, log)
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
    const availableFixesService = new AvailableFixesService()
    const fixResult = await availableFixesService.checkForAvailableFixes({
      repoUrl: originUrl,
      limit: args.limit,
      offset: args.offset,
    })
    logInfo('CheckForAvailableFixesTool execution completed successfully', {
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
