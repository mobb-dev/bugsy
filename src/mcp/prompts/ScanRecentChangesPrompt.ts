import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { PromptArgument } from '../types'
import { BasePrompt } from './base/BasePrompt'

const ScanRecentChangesArgsSchema = z.object({
  path: z.string().optional(),
})

type ScanRecentChangesArgs = z.infer<typeof ScanRecentChangesArgsSchema>

export class ScanRecentChangesPrompt extends BasePrompt {
  public readonly name = 'scan-recent-changes'
  public readonly description =
    'Guide for scanning only recently modified files for new security vulnerabilities'
  public readonly arguments: PromptArgument[] = [
    {
      name: 'path',
      description: 'Optional: Full local path to the git repository to scan',
      required: false,
    },
  ]
  protected readonly argumentsValidationSchema = ScanRecentChangesArgsSchema

  protected async generatePrompt(
    validatedArgs?: unknown
  ): Promise<GetPromptResult> {
    const args = validatedArgs as ScanRecentChangesArgs | undefined

    const promptText = `# Scan Recent Changes for Security Issues

This workflow helps you quickly scan only the files that have been recently modified, making security checks fast and targeted.

## When to Use This Workflow

Use this approach when:
- You've just made code changes and want to check for new vulnerabilities
- You want a quick security check without scanning the entire repository
- You're working in a specific area of the codebase
- You want faster scan results
- You're doing iterative development and want continuous security feedback

## Workflow Steps

### Step 1: Determine Repository Path
${
  args?.path
    ? `✓ Repository path provided: \`${args.path}\``
    : `Ask the user for the full local path to the git repository.`
}

### Step 2: Call scan_and_fix_vulnerabilities with Recent Changes Flag

Use the \`scan_and_fix_vulnerabilities\` tool with the \`scanRecentlyChangedFiles\` parameter:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}",
  "scanRecentlyChangedFiles": true,
  "limit": 5
}
\`\`\`

**Key parameters:**
- \`scanRecentlyChangedFiles: true\` - Only scans files modified recently
- \`limit: 5\` - Return up to 5 fixes (adjustable based on user needs)

### Step 3: Present Results

When you receive results:

#### If new vulnerabilities found:

1. **Alert the user:**
   "⚠️ Security issues detected in recently modified files!"

2. **Provide context:**
   - Number of new vulnerabilities introduced
   - Which files are affected
   - Severity breakdown
   - Who made the changes (git blame)

3. **Show each vulnerability:**
   - File and line number
   - Type of vulnerability
   - Severity level
   - Proposed fix with diff preview

4. **Recommend immediate action:**
   For Critical/High severity:
   - "I strongly recommend addressing these issues before committing/merging"
   - "Would you like me to apply the fixes now?"

#### If no vulnerabilities found:

"✓ Great! No new security issues detected in your recent changes."

Optional suggestions:
- Continue with your work
- Commit your changes
- Consider enabling continuous monitoring

#### If no recently changed files:

"No recently modified files detected. This could mean:
- No uncommitted changes exist
- No files were modified recently
- The repository has no git history

Would you like to:
1. Perform a full repository scan instead?
2. Check the repository status?"

### Step 4: Handle User Decisions

**If user wants to apply fixes:**
- Confirm each fix before applying
- Show the exact changes
- Apply patches sequentially
- Verify each application succeeded
- Run tests if available

**If user wants to see more details:**
- Explain the vulnerability type
- Show the vulnerable code pattern
- Explain how the fix improves security
- Provide references or documentation links

**If user wants to continue without fixing:**
- Warn about the risks (especially for Critical/High)
- Suggest creating an issue to track the vulnerability
- Remind them to fix before merging to production

### Step 5: Post-Scan Recommendations

After handling vulnerabilities:

1. **If fixes were applied:**
   - Verify the code still works (run tests)
   - Review the changes
   - Update commit message to mention security fixes
   - Consider running a full scan to check for other issues

2. **If fixes were deferred:**
   - Create tracking issues for the vulnerabilities
   - Add TODO comments in the code
   - Schedule time to address them

3. **Enable continuous monitoring:**
   Call \`check_for_new_available_fixes\`:
   \`\`\`json
   {
     "path": "${args?.path || '<repository-path>'}"
   }
   \`\`\`

## Advantages of Scanning Recent Changes

✓ **Fast**: Only scans modified files
✓ **Targeted**: Focuses on your current work
✓ **Immediate feedback**: Catch issues before they're committed
✓ **Less overwhelming**: Smaller result set
✓ **Continuous security**: Integrates into development workflow

## Important Notes

### DO:
✓ Run this scan after making changes but before committing
✓ Address Critical/High severity issues immediately
✓ Explain security risks clearly to the user
✓ Offer to apply fixes automatically
✓ Provide context about what changed and why it's vulnerable

### DON'T:
✗ Skip Critical/High severity warnings
✗ Apply fixes without showing the user
✗ Ignore the vulnerability just because the scan is quick
✗ Forget to run tests after applying fixes
✗ Assume all recent changes have vulnerabilities

## Integration with Development Workflow

This scan type integrates well with:
- **Pre-commit hooks**: Scan before each commit
- **IDE integration**: Scan on file save or periodically
- **CI/CD pipelines**: Fast security check in pull requests
- **Iterative development**: Continuous security feedback

## Example Usage

\`\`\`
User: "I just added a new API endpoint for user data. Can you check if it's secure?"

AI: "I'll scan your recent changes for security vulnerabilities..."

[Calls scan_and_fix_vulnerabilities with scanRecentlyChangedFiles: true]

AI: "⚠️ Found 1 security issue in your recent changes:

**SQL Injection Vulnerability** (Critical)
- File: src/api/user-data.ts:34
- Your new endpoint is vulnerable to SQL injection

The issue is in this code:
\`\`\`typescript
const query = \`SELECT * FROM users WHERE id = \${req.params.id}\`
\`\`\`

Recommended fix: Use parameterized queries
\`\`\`typescript
const query = 'SELECT * FROM users WHERE id = $1'
const result = await db.query(query, [req.params.id])
\`\`\`

This is a Critical severity issue. I strongly recommend fixing it before committing. Would you like me to apply this fix automatically?"
\`\`\`

## Ready to Scan

You now have the guidance needed to perform a fast, targeted security scan of recent changes. Follow the workflow above to help users catch security issues early in their development process.
`

    return this.createUserMessage(promptText)
  }
}
