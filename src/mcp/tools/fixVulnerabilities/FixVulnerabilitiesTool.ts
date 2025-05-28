import { z } from 'zod'

import { GitService } from '../../services/GitService'
import { PathValidationService } from '../../services/PathValidationService'
import { BaseTool, ToolResponse } from '../base/BaseTool'
import { VulnerabilityFixService } from './services/VulnerabilityFixService'

const FixVulnerabilitiesInputSchema = z.object({
  path: z.string().min(1, 'Path is required and must be a string'),
})

type FixVulnerabilitiesInput = z.infer<typeof FixVulnerabilitiesInputSchema>

export class FixVulnerabilitiesTool extends BaseTool {
  public readonly name = 'fix_vulnerabilities'
  public readonly displayName = 'fix_vulnerabilities'
  public readonly description =
    'Scans the current code changes and returns fixes for potential vulnerabilities'
  protected readonly inputSchema = FixVulnerabilitiesInputSchema

  protected override async validateAdditional(
    validatedArgs: FixVulnerabilitiesInput
  ): Promise<void> {
    const { path } = validatedArgs

    // Validate path security and existence - let validation errors bubble up as MCP errors
    const pathValidationService = new PathValidationService()
    const pathValidation = await pathValidationService.validatePath(path)
    if (!pathValidation.isValid) {
      const errorMessage = `Invalid path: potential security risk detected in path: ${path}`
      throw new Error(errorMessage)
    }

    // Validate git repository - let validation errors bubble up as MCP errors
    const gitService = new GitService(path)
    const gitValidation = await gitService.validateRepository()
    if (!gitValidation.isValid) {
      throw new Error(gitValidation.error || 'Git repository validation failed')
    }
  }

  protected async executeInternal(
    validatedArgs: FixVulnerabilitiesInput
  ): Promise<ToolResponse> {
    const { path } = validatedArgs

    // Initialize Git service and get changed files (validation already done)
    const gitService = new GitService(path)
    const gitResult = await gitService.getChangedFiles()

    // Check if there are files to process
    if (gitResult.files.length === 0) {
      return this.createSuccessResponse(
        'No changed files found in the git repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.'
      )
    }

    // Process vulnerabilities
    const vulnerabilityFixService = new VulnerabilityFixService()
    const fixResult = await vulnerabilityFixService.processVulnerabilities(
      gitResult.files,
      path
    )

    return this.createSuccessResponse(fixResult)
  }
}
