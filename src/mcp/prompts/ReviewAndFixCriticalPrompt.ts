import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { PromptArgument } from '../types'
import { BasePrompt } from './base/BasePrompt'

const ReviewAndFixCriticalArgsSchema = z.object({
  path: z.string().optional(),
})

type ReviewAndFixCriticalArgs = z.infer<typeof ReviewAndFixCriticalArgsSchema>

export class ReviewAndFixCriticalPrompt extends BasePrompt {
  public readonly name = 'review-and-fix-critical'
  public readonly description =
    'Focused workflow for identifying and fixing Critical and High severity security vulnerabilities'
  public readonly arguments: PromptArgument[] = [
    {
      name: 'path',
      description:
        'Optional: Full local path to the git repository to scan and fix',
      required: false,
    },
  ]
  protected readonly argumentsValidationSchema = ReviewAndFixCriticalArgsSchema

  protected async generatePrompt(
    validatedArgs?: unknown
  ): Promise<GetPromptResult> {
    const args = validatedArgs as ReviewAndFixCriticalArgs | undefined

    const promptText = `# Critical Security Vulnerabilities - Review and Fix

This is a focused workflow for identifying and addressing Critical and High severity security vulnerabilities that require immediate attention.

## Workflow Purpose

Use this workflow when:
- Security is a high priority
- Preparing for production deployment
- Security audit or compliance review is needed
- You want to address the most severe issues first
- Time is limited and you need to focus on critical threats

## Severity Priority

**CRITICAL** 🔴
- Immediate security risk
- Can lead to complete system compromise
- Examples: Remote Code Execution, Authentication Bypass, SQL Injection with data exposure
- **Action: FIX IMMEDIATELY**

**HIGH** 🟠
- Significant security vulnerability
- Can lead to data breaches or unauthorized access
- Examples: XSS attacks, Privilege Escalation, Exposed Sensitive Data
- **Action: FIX URGENTLY**

Medium and Low severity issues will be noted but not prioritized in this workflow.

## Workflow Steps

### Step 1: Initial Scan
${
  args?.path
    ? `Scanning repository at: \`${args.path}\``
    : `Obtain the repository path from the user.`
}

Call \`scan_and_fix_vulnerabilities\`:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}",
  "limit": 10,
  "maxFiles": 20
}
\`\`\`

Higher limits to ensure we catch all critical issues.

### Step 2: Filter and Present Critical Issues

When results arrive:

1. **Count vulnerabilities by severity:**
   - Critical count
   - High count
   - Medium count (mention but don't focus)
   - Low count (mention but don't focus)

2. **Present ONLY Critical and High severity issues:**

   For each Critical/High vulnerability:

   \`\`\`
   🔴 CRITICAL: [Vulnerability Type]

   File: [path/to/file.ext:line]
   Last modified by: [git blame user]

   Risk: [Explain the security risk in simple terms]

   Proposed Fix:
   [Show the diff/patch]

   Impact: [What this fix does and why it's necessary]
   \`\`\`

3. **Provide clear summary:**
   "Found X critical and Y high severity vulnerabilities that require immediate attention."

### Step 3: Prioritize Fixes

Create a fix priority list:

**Phase 1 - Critical (DO FIRST):**
- List all Critical issues
- Sort by risk level
- Recommend fixing ALL before any High issues

**Phase 2 - High (DO SECOND):**
- List all High issues
- Can be addressed after Critical are resolved

**Ask the user:**
"I recommend we fix these in priority order. Would you like me to:
1. Apply ALL critical fixes automatically (recommended)
2. Review each critical fix individually
3. See the full details before proceeding"

### Step 4: Apply Fixes

Based on user choice:

#### Option 1: Apply All Critical Automatically

\`\`\`
"I'll apply all [N] critical fixes now. This will modify [X] files."

For each fix:
1. Apply the patch
2. Verify it applied successfully
3. Show brief confirmation: "✓ Fixed: [vulnerability type] in [file]"

"All critical fixes applied. Running verification..."
[Call check_for_new_available_fixes to verify]

"Next, I can address the [N] high severity issues. Continue?"
\`\`\`

#### Option 2: Review Each Fix Individually

For each Critical fix:
1. Show the vulnerability details
2. Show the exact code changes
3. Explain the security improvement
4. Ask: "Apply this fix? (yes/no/skip)"
5. Apply if approved
6. Move to next

#### Option 3: Provide Full Details First

- Show comprehensive analysis of each vulnerability
- Include CVE references if available
- Explain attack vectors
- Demonstrate how the fix prevents the attack
- Then proceed to fixing phase

### Step 5: Verification

After applying fixes:

1. **Verify fixes applied correctly:**
   - Check files were modified
   - No merge conflicts
   - Code syntax is valid

2. **Run tests if available:**
   \`\`\`bash
   npm test
   # or
   pytest
   # or appropriate test command
   \`\`\`

3. **Re-scan to confirm:**
   Call \`scan_and_fix_vulnerabilities\` again with \`rescan: true\`

   Verify:
   - Critical issues are resolved
   - No new issues were introduced
   - High severity count decreased (if those were also fixed)

### Step 6: Summary Report

Provide a comprehensive summary:

\`\`\`markdown
## Security Fix Summary

### Fixed
- ✅ [N] Critical vulnerabilities resolved
- ✅ [N] High severity vulnerabilities resolved

### Files Modified
- [list of modified files]

### Remaining Issues
- ⚠️ [N] Medium severity (can be addressed later)
- ℹ️ [N] Low severity (maintenance backlog)

### Recommendations
1. Run your test suite to ensure functionality
2. Review the changes before committing
3. Consider addressing remaining High severity issues
4. Schedule time for Medium/Low issues
5. Enable continuous monitoring

### Next Steps
- Commit these security fixes
- Deploy to staging for testing
- Schedule follow-up for remaining issues
\`\`\`

## Important Guidelines

### Communication Style

**For Critical Issues:**
- Use urgent but calm language
- Clearly explain the risk
- Don't create panic, but convey seriousness
- Be direct about the need to fix immediately

**For High Issues:**
- Emphasize importance but not emergency
- Explain impact on security posture
- Recommend fixing soon but not necessarily right now

### DO:
✅ Fix ALL Critical issues before moving to High
✅ Explain each vulnerability clearly
✅ Show exact code changes
✅ Verify fixes were applied successfully
✅ Run tests after applying fixes
✅ Create a clear summary of actions taken
✅ Recommend continuous monitoring

### DON'T:
❌ Apply fixes without user approval (except if explicitly requested)
❌ Minimize the importance of Critical issues
❌ Get distracted by Medium/Low issues during this workflow
❌ Skip verification steps
❌ Forget to check for new issues after applying fixes
❌ Rush through explanations

## Example Interaction

\`\`\`
AI: "Scanning repository for critical security vulnerabilities..."

[Scans]

AI: "⚠️ **Security Alert: Critical Issues Found**

I found 3 critical and 5 high severity vulnerabilities:

🔴 **CRITICAL ISSUES** (Must fix immediately):

1. **SQL Injection** in src/api/users.ts:67
   - Risk: Attacker can access entire database
   - Last modified by: john@example.com
   - Fix: Use parameterized queries

2. **Authentication Bypass** in src/auth/middleware.ts:23
   - Risk: Unauthorized access to admin functions
   - Last modified by: jane@example.com
   - Fix: Validate JWT signature properly

3. **Remote Code Execution** in src/utils/processor.ts:45
   - Risk: Attacker can execute arbitrary code on server
   - Last modified by: bob@example.com
   - Fix: Sanitize eval() input

🟠 **HIGH SEVERITY** (Fix urgently):
[Lists 5 high issues...]

**Recommendation:** Fix all 3 critical issues immediately. Would you like me to:
1. Apply ALL critical fixes now (recommended) ← [DEFAULT]
2. Review each fix individually
3. See detailed analysis first"

User: "Apply all critical fixes"

AI: "Applying all critical fixes...

✓ Fixed: SQL Injection in src/api/users.ts
✓ Fixed: Authentication Bypass in src/auth/middleware.ts
✓ Fixed: Remote Code Execution in src/utils/processor.ts

All critical vulnerabilities resolved! Running verification...

✓ Verification complete - no new issues introduced.

3 files modified, 0 critical issues remaining.

Would you like to proceed with fixing the 5 high severity issues?"
\`\`\`

## Ready to Begin

This workflow focuses exclusively on the most dangerous vulnerabilities. Follow the steps above to systematically eliminate critical security threats from the codebase.

Start by scanning${args?.path ? ` ${args.path}` : ' the repository'} and prioritizing Critical and High severity issues.
`

    return this.createUserMessage(promptText)
  }
}
