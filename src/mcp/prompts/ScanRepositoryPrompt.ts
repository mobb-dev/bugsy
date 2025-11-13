import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { PromptArgument } from '../types'
import { BasePrompt } from './base/BasePrompt'

const ScanRepositoryArgsSchema = z.object({
  path: z.string().optional(),
})

type ScanRepositoryArgs = z.infer<typeof ScanRepositoryArgsSchema>

export class ScanRepositoryPrompt extends BasePrompt {
  public readonly name = 'scan-repository'
  public readonly description =
    'Guide for performing an initial security scan of a repository using Mobb tools'
  public readonly arguments: PromptArgument[] = [
    {
      name: 'path',
      description: 'Optional: Full local path to the git repository to scan',
      required: false,
    },
  ]
  protected readonly argumentsValidationSchema = ScanRepositoryArgsSchema

  protected async generatePrompt(
    validatedArgs?: unknown
  ): Promise<GetPromptResult> {
    const args = validatedArgs as ScanRepositoryArgs | undefined
    const pathInfo = args?.path
      ? `for repository at: ${args.path}`
      : 'for the current repository'

    const promptText = `# Security Repository Scan Workflow

You are about to perform a security scan ${pathInfo}. Follow this workflow to scan the repository for vulnerabilities and present the findings to the user.

## Workflow Steps

### Step 1: Determine Repository Path
${
  args?.path
    ? `✓ Repository path provided: \`${args.path}\``
    : `- The user should provide the full local path to the git repository
- Ask: "What is the full path to the repository you want to scan?"
- Example: /Users/username/projects/my-app`
}

### Step 2: Call scan_and_fix_vulnerabilities Tool

Use the \`scan_and_fix_vulnerabilities\` tool with these parameters:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}",
  "limit": 3,
  "maxFiles": 10
}
\`\`\`

**Why these defaults?**
- \`limit: 3\` - Start with top 3 most severe vulnerabilities
- \`maxFiles: 10\` - Reasonable initial scan scope

**Optional parameters** (use if user specifies):
- \`rescan: true\` - Force a fresh scan (if user wants to override cached results)
- \`scanRecentlyChangedFiles: true\` - Only scan recently modified files (faster)

### Step 3: Process and Present Results

When you receive the scan results:

#### If vulnerabilities are found:

1. **Provide a summary:**
   - Total number of vulnerabilities found
   - Breakdown by severity (Critical, High, Medium, Low)
   - Number of fixes available

2. **Present the top fixes:**
   - Show each fix with:
     * Severity level
     * Vulnerability type (e.g., "SQL Injection", "XSS", "Insecure Dependency")
     * Affected file(s)
     * Who last modified the vulnerable code (git blame)
     * Brief description from the fix

3. **Show the fix preview:**
   - Display the git diff/patch for each fix
   - Explain what changes will be made
   - Highlight the security improvement

4. **Ask for user preference:**
   - "Would you like to apply these fixes automatically?"
   - "Would you like to see more vulnerabilities?" (if more exist)
   - "Would you like to focus on a specific severity level?"

#### If no vulnerabilities are found:

Congratulate the user! Their repository appears to be secure. Suggest:
- Running periodic scans as code changes
- Enabling continuous monitoring with \`check_for_new_available_fixes\`

#### If report is expired:

Inform the user that a previous scan is too old. Ask:
- "A previous scan exists but is outdated. Would you like to run a fresh scan?"
- If yes, call \`scan_and_fix_vulnerabilities\` with \`rescan: true\`

### Step 4: Handle User Actions

Based on user response:

**If user wants to apply fixes:**
- Confirm which fixes to apply (all, or specific ones)
- Apply each fix patch using standard git apply workflow
- Verify the changes
- Run tests if available
- Create a commit with the fixes

**If user wants to see more:**
- Call \`fetch_available_fixes\` with:
  \`\`\`json
  {
    "path": "${args?.path || '<repository-path>'}",
    "offset": 3,
    "limit": 5
  }
  \`\`\`
- Present the additional fixes following the same format

**If user wants to filter by severity:**
- The results are already sorted by severity (Critical → High → Medium → Low)
- Explain the severity of issues found
- Focus on the most critical issues first

### Step 5: Post-Scan Actions

After completing the scan and any fixes:

1. **Summary of actions taken:**
   - Number of fixes applied
   - Remaining vulnerabilities (if any)
   - Files modified

2. **Recommendations:**
   - Run tests to ensure fixes don't break functionality
   - Review the changes before committing
   - Consider addressing remaining Medium/Low severity issues
   - Set up continuous monitoring

3. **Call monitoring tool:**
   Call \`check_for_new_available_fixes\` to enable ongoing security monitoring:
   \`\`\`json
   {
     "path": "${args?.path || '<repository-path>'}"
   }
   \`\`\`

## Important Reminders

### DO:
✓ Present vulnerabilities clearly with severity context
✓ Ask for user confirmation before applying fixes
✓ Explain what each fix does
✓ Start with critical/high severity issues
✓ Provide clear next steps
✓ Mention git blame information (shows responsibility)

### DON'T:
✗ Apply fixes automatically without user approval
✗ Overwhelm user with all vulnerabilities at once
✗ Skip severity information
✗ Forget to call monitoring tool at the end
✗ Assume the user wants to fix everything immediately

## Error Handling

- **Authentication error**: Guide user to authenticate with Mobb
- **Path not found**: Verify the path is correct and is a git repository
- **Scan timeout**: Suggest scanning fewer files or recent changes only
- **No report found**: This is expected for first-time scans, proceed normally

## Example Conversation Flow

\`\`\`
AI: "I'll scan your repository for security vulnerabilities. This may take a moment..."

[Calls scan_and_fix_vulnerabilities]

AI: "Scan complete! I found 12 security vulnerabilities:
- 2 Critical severity
- 5 High severity
- 4 Medium severity
- 1 Low severity

Here are the top 3 most critical issues:

1. **SQL Injection** (Critical)
   - File: src/database/users.ts:45
   - Last modified by: john@example.com
   - Fix: Parameterize SQL query to prevent injection

   [Shows diff preview]

2. **Cross-Site Scripting (XSS)** (Critical)
   - File: src/components/UserProfile.tsx:122
   - Last modified by: jane@example.com
   - Fix: Sanitize user input before rendering

   [Shows diff preview]

3. **Insecure Dependency** (High)
   - Package: lodash@4.17.15
   - Fix: Upgrade to lodash@4.17.21 (fixes CVE-2021-23337)

Would you like to:
1. Apply these fixes automatically
2. See more vulnerabilities
3. Focus on specific issues"
\`\`\`

## Ready to Begin

You now have all the information needed to perform a security scan. Follow the steps above, call the appropriate tools, and guide the user through the process professionally and clearly.
`

    return this.createUserMessage(promptText)
  }
}
