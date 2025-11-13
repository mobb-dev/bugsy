import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'

import { BasePrompt } from './base/BasePrompt'

export class SecurityToolsOverviewPrompt extends BasePrompt {
  public readonly name = 'security-tools-overview'
  public readonly description =
    'Provides an overview of available Mobb security tools and guidance on when to use each tool'
  public readonly arguments = undefined
  protected readonly argumentsValidationSchema = undefined

  protected async generatePrompt(): Promise<GetPromptResult> {
    const promptText = `# Mobb Security Tools Overview

You have access to powerful security scanning and auto-fixing tools from Mobb. Here's a comprehensive guide to the available tools and when to use them:

## Available Tools

### 1. **scan_and_fix_vulnerabilities**
**Purpose:** Scans a local repository for security vulnerabilities and returns automatically-generated fixes.

**When to use:**
- First-time security scan of a repository
- Comprehensive security audit needed
- User explicitly requests a security scan
- After major code changes or refactoring

**Key features:**
- Scans the entire repository or specific files
- Identifies vulnerabilities across multiple categories (XSS, SQL injection, insecure dependencies, etc.)
- Provides detailed fix information including severity levels
- Returns git-compatible patches that can be directly applied
- Shows who last modified vulnerable code (git blame integration)

**Parameters:**
- \`path\` (required): Full local path to the git repository
- \`offset\`: Pagination offset for results (default: 0)
- \`limit\`: Number of fixes to return (default: 3)
- \`maxFiles\`: Maximum files to scan (default: 10)
- \`rescan\`: Force a new scan even if recent report exists
- \`scanRecentlyChangedFiles\`: Only scan recently modified files

**Important notes:**
- This tool requires authentication
- Scans may take time for large repositories
- Results are cached - use \`rescan: true\` to force a fresh scan
- The tool returns fixes in order of severity (Critical → High → Medium → Low)

### 2. **fetch_available_fixes**
**Purpose:** Retrieves pre-generated fixes from previous scans without triggering a new scan.

**When to use:**
- Checking for existing fixes without scanning
- Retrieving additional fixes from a paginated result set
- User wants to see more fixes beyond the initial set
- Fetching fixes for specific files

**Key features:**
- Fast retrieval of existing fix data
- No scanning overhead
- Supports file filtering
- Pagination for large result sets

**Parameters:**
- \`path\` (required): Full local path to the git repository
- \`offset\`: Pagination offset
- \`limit\`: Number of fixes to return
- \`fileFilter\`: Filter by specific file path
- \`fetchFixesFromAnyFile\`: Fetch fixes across all files

**Important notes:**
- Returns an error if no previous scan exists
- Does NOT trigger a new scan
- Use this when you want to avoid re-scanning

### 3. **check_for_new_available_fixes**
**Purpose:** Monitors code for new security vulnerabilities and notifies when fixes are available.

**When to use:**
- Continuous security monitoring
- After completing a series of edits
- End of a coding session
- User requests ongoing security checks

**Key features:**
- Lightweight background checking
- Detects new vulnerabilities introduced by code changes
- Non-intrusive monitoring

**Parameters:**
- \`path\` (required): Full local path to the git repository

**Important notes:**
- This is typically called automatically at the end of operations
- Much lighter weight than full scans
- Part of Mobb's continuous monitoring workflow

## Best Practices

### Tool Selection Guidelines

1. **Starting fresh?** → Use \`scan_and_fix_vulnerabilities\`
2. **Already scanned, need more results?** → Use \`fetch_available_fixes\`
3. **Continuous monitoring?** → Use \`check_for_new_available_fixes\`

### User Interaction Patterns

**When to ask for user confirmation:**
- Before applying fixes automatically
- Before running a full repository scan (can be time-consuming)
- Before re-scanning when a recent scan exists
- When multiple high-severity issues are found

**When to proceed automatically:**
- Fetching additional fixes from existing scans
- Running background monitoring checks
- Displaying vulnerability information
- Showing fix previews

### Severity Levels

Vulnerabilities are categorized by severity:
- **CRITICAL**: Immediate action required - severe security risk
- **HIGH**: Important security issue - should be fixed soon
- **MEDIUM**: Moderate security concern - fix when feasible
- **LOW**: Minor security issue - fix during regular maintenance

**Recommended approach:**
1. Address CRITICAL issues immediately
2. Review and fix HIGH severity issues
3. Plan fixes for MEDIUM issues
4. Address LOW issues during regular maintenance

### Workflow Example

\`\`\`
1. User opens a repository
2. Call scan_and_fix_vulnerabilities with default parameters
3. Review the returned fixes (typically top 3 by severity)
4. Present fixes to user with severity breakdown
5. If user wants to see more: call fetch_available_fixes with appropriate offset
6. When user approves fixes: apply the patches using git apply
7. After session: call check_for_new_available_fixes for monitoring
\`\`\`

## Authentication

All tools require authentication via the Mobb API. The tools will handle authentication automatically and prompt if credentials are needed.

## Error Handling

Common scenarios:
- **No fixes found**: Repository has no vulnerabilities or they're not fixable
- **Report expired**: Previous scan is too old, need to rescan
- **No report found**: No previous scan exists, run scan_and_fix_vulnerabilities
- **Authentication required**: User needs to authenticate with Mobb

## Next Steps

To get started with scanning a repository, use the \`scan-repository\` prompt which will guide you through the scanning workflow.

For a complete security audit workflow, use the \`full-security-audit\` prompt.
`

    return this.createUserMessage(promptText)
  }
}
