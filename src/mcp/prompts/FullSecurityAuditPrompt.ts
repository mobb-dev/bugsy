import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { PromptArgument } from '../types'
import { BasePrompt } from './base/BasePrompt'

const FullSecurityAuditArgsSchema = z.object({
  path: z.string().optional(),
})

type FullSecurityAuditArgs = z.infer<typeof FullSecurityAuditArgsSchema>

export class FullSecurityAuditPrompt extends BasePrompt {
  public readonly name = 'full-security-audit'
  public readonly description =
    'Complete end-to-end security audit workflow: scan → review → fix → verify → monitor'
  public readonly arguments: PromptArgument[] = [
    {
      name: 'path',
      description: 'Optional: Full local path to the git repository to audit',
      required: false,
    },
  ]
  protected readonly argumentsValidationSchema = FullSecurityAuditArgsSchema

  protected async generatePrompt(
    validatedArgs?: unknown
  ): Promise<GetPromptResult> {
    const args = validatedArgs as FullSecurityAuditArgs | undefined

    const promptText = `# Complete Security Audit Workflow

This is a comprehensive, end-to-end security audit process that will scan, review, fix, verify, and set up monitoring for a repository.

## Audit Overview

This workflow includes:
1. **Initial Assessment** - Understand the repository
2. **Comprehensive Scan** - Full security analysis
3. **Issue Review** - Categorize and prioritize vulnerabilities
4. **Fix Application** - Apply security patches systematically
5. **Verification** - Confirm fixes work correctly
6. **Continuous Monitoring** - Set up ongoing security checks
7. **Final Report** - Document all actions taken

**Estimated Time:** 10-30 minutes depending on repository size and issue count

## Prerequisites

Before starting:
- Repository should be in a clean git state (or user is aware of uncommitted changes)
- Tests should be available and passing
- User has time to review and address issues
- Backup or branch created (recommended for first-time users)

## Phase 1: Initial Assessment

### Step 1.1: Gather Repository Information
${
  args?.path
    ? `✓ Repository path: \`${args.path}\``
    : `- Request repository path from user
- Ask: "What is the full path to the repository you want to audit?"`
}

### Step 1.2: Set Expectations

Inform the user:

\`\`\`
"I'll perform a complete security audit of your repository. This will:
- Scan all code for security vulnerabilities
- Identify issues across all severity levels
- Provide automatic fixes where possible
- Set up continuous monitoring

This process will take a few minutes. I'll guide you through each step and explain my findings.

Ready to begin?"
\`\`\`

### Step 1.3: Check Repository Status

Recommend running git status:
\`\`\`bash
git status
\`\`\`

If there are uncommitted changes, suggest:
- "I see uncommitted changes. Would you like to commit or stash them first?"
- "We can proceed, but I recommend committing current work first."

## Phase 2: Comprehensive Scan

### Step 2.1: Initial Full Scan

Call \`scan_and_fix_vulnerabilities\`:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}",
  "limit": 10,
  "maxFiles": 50
}
\`\`\`

Larger limits for comprehensive audit.

### Step 2.2: Initial Results Analysis

When results arrive, analyze and present:

1. **Executive Summary:**
   \`\`\`
   Security Scan Complete
   ----------------------
   Total Vulnerabilities Found: [N]

   By Severity:
   - 🔴 Critical: [N] (immediate action required)
   - 🟠 High: [N] (urgent)
   - 🟡 Medium: [N] (important)
   - 🔵 Low: [N] (maintenance)

   By Category:
   - [List top 3-5 vulnerability types found]

   Fixable: [N] vulnerabilities have automatic fixes available
   \`\`\`

2. **Initial Recommendation:**
   Based on findings, recommend:
   - If Critical exists: "Address critical issues immediately"
   - If mostly High/Medium: "Systematic fix approach recommended"
   - If only Low: "Good security posture, minor improvements available"

## Phase 3: Issue Review & Prioritization

### Step 3.1: Detailed Issue Presentation

Present issues in priority order:

**For each Critical vulnerability:**
\`\`\`
🔴 CRITICAL: [Type]
Location: [file:line]
Risk Level: Severe Security Threat

Description: [What the vulnerability is]
Attack Vector: [How it could be exploited]
Impact: [What an attacker could do]

Proposed Fix: [Summary of the fix]
[Show diff/patch preview]

Last modified by: [git blame]
\`\`\`

Continue for High, Medium, Low...

### Step 3.2: Create Fix Plan

Generate a structured fix plan:

\`\`\`markdown
## Security Fix Plan

### Phase 1: Critical Fixes (Do First)
1. [Vulnerability type] in [file]
2. [Vulnerability type] in [file]
...

### Phase 2: High Severity Fixes
1. [Vulnerability type] in [file]
2. [Vulnerability type] in [file]
...

### Phase 3: Medium Severity Fixes
[Can be done in follow-up session]

### Phase 4: Low Severity Fixes
[Add to maintenance backlog]
\`\`\`

### Step 3.3: Get User Approval

Ask user how they want to proceed:

"I've identified the security issues and created a fix plan. How would you like to proceed?

1. **Comprehensive Fix** - Fix all Critical and High issues now (recommended)
2. **Critical Only** - Fix only Critical issues now
3. **Selective Fix** - Review and choose which fixes to apply
4. **Report Only** - Generate report without applying fixes (for review)

Recommendation: Option 1 for best security posture."

## Phase 4: Fix Application

Based on user choice, systematically apply fixes:

### Step 4.1: Apply Critical Fixes

For each Critical fix:
1. Show what will be fixed
2. Apply the patch
3. Confirm application: "✓ Fixed: [vulnerability] in [file]"
4. Track progress: "[N/Total] Critical fixes applied"

### Step 4.2: Apply High Severity Fixes

Same process as Critical, but can be done in batches.

### Step 4.3: Handle Fix Failures

If a fix fails to apply:
1. Note the failure
2. Show the conflict or error
3. Mark for manual review
4. Continue with remaining fixes
5. Summarize failed fixes at the end

## Phase 5: Verification

### Step 5.1: Verify Patches Applied

Check each modified file:
\`\`\`bash
git status
git diff
\`\`\`

Confirm:
- Expected files were modified
- No unexpected changes
- No merge conflicts

### Step 5.2: Run Test Suite

If tests exist:

\`\`\`bash
# Run appropriate test command
npm test
# or
pytest
# or
mvn test
\`\`\`

**If tests pass:**
"✅ All tests passed! Security fixes did not break functionality."

**If tests fail:**
"⚠️ Some tests are failing after applying fixes:
[List failing tests]

This could mean:
1. Tests need to be updated (common for security fixes)
2. A fix introduced an issue (less common)

Would you like me to:
1. Review the failing tests
2. Revert specific fixes
3. Continue anyway (tests may need updates)"

### Step 5.3: Re-scan for Verification

Call \`scan_and_fix_vulnerabilities\` again with \`rescan: true\`:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}",
  "rescan": true,
  "limit": 10
}
\`\`\`

Compare before/after:
- Confirm fixed vulnerabilities are gone
- Check no new vulnerabilities were introduced
- Verify severity counts decreased as expected

## Phase 6: Continuous Monitoring Setup

### Step 6.1: Enable Monitoring

Call \`check_for_new_available_fixes\`:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}"
}
\`\`\`

### Step 6.2: Explain Monitoring

"✅ Continuous security monitoring is now enabled for this repository.

What this means:
- Periodic background checks for new vulnerabilities
- Notifications when security issues are detected
- Ongoing protection as code evolves

This helps maintain the security improvements we just made."

## Phase 7: Final Report

### Step 7.1: Generate Comprehensive Report

Create a detailed report:

\`\`\`markdown
# Security Audit Report
Repository: [name/path]
Date: [date]
Audited by: Mobb AI Security Assistant

## Executive Summary
- Total vulnerabilities found: [N]
- Vulnerabilities fixed: [N]
- Files modified: [N]
- Test status: [Pass/Fail/Not Run]

## Vulnerabilities Fixed

### Critical (🔴)
1. [Type] in [file:line] - FIXED ✅
   - Risk: [description]
   - Fix: [description]

2. [Type] in [file:line] - FIXED ✅
   ...

### High (🟠)
[Similar format]

### Medium (🟡)
[List - note which were fixed]

### Low (🔵)
[List - note which were fixed]

## Files Modified
- [list all modified files with change descriptions]

## Verification Results
✅ All fixes applied successfully
✅ Tests passing
✅ Re-scan confirms vulnerabilities resolved
✅ No new vulnerabilities introduced

## Remaining Items
- [N] Medium severity issues (recommended to fix soon)
- [N] Low severity issues (maintenance backlog)

## Recommendations
1. Commit these security improvements
2. Deploy to staging environment for testing
3. Schedule follow-up for remaining Medium issues
4. Review security practices to prevent future issues
5. Keep continuous monitoring enabled

## Next Steps
1. Review the changes: git diff
2. Run additional tests if needed
3. Commit: git add . && git commit -m "Security fixes: addressed [N] critical and high severity vulnerabilities"
4. Push to remote repository
5. Deploy with confidence

---
🔒 Security Level: [Excellent/Good/Fair] (based on remaining issues)
\`\`\`

### Step 7.2: Provide Next Steps

Give clear guidance:

"## What to do next:

**Immediate (Do now):**
1. Review the changes made (git diff)
2. Commit the security fixes
3. Push to your repository

**Soon (This week):**
1. Address remaining Medium severity issues ([N] items)
2. Review security best practices for your framework
3. Share this report with your team

**Ongoing:**
1. Continuous monitoring is active
2. Run security scans after major changes
3. Keep dependencies updated

**Questions?**
- Need help with any specific fix?
- Want to understand a vulnerability better?
- Need guidance on preventing similar issues?

Ask me anything!"

## Important Guidelines

### Communication Throughout

**Be:**
- Professional and clear
- Patient and thorough
- Encouraging and supportive
- Transparent about what you're doing

**Tone:**
- Security issues are serious but fixable
- Congratulate progress
- Celebrate improvements
- Don't blame or shame

### DO:
✅ Follow all phases systematically
✅ Explain each step clearly
✅ Get user approval before major actions
✅ Verify all changes
✅ Provide comprehensive documentation
✅ Enable monitoring
✅ Give clear next steps

### DON'T:
❌ Rush through the process
❌ Skip verification steps
❌ Apply fixes without explanation
❌ Forget to check for new issues
❌ Leave user without next steps
❌ Create alarm - be solution-focused

## Time Management

For large repositories with many issues:
- Take breaks between phases
- Offer to pause and resume later
- Batch fixes appropriately
- Don't overwhelm the user

Suggest: "We've fixed [N] critical issues. Would you like to continue with High severity, or take a break and resume later?"

## Success Criteria

Audit is successful when:
✅ All Critical vulnerabilities are fixed
✅ Most High severity issues addressed
✅ All fixes verified and tested
✅ No new vulnerabilities introduced
✅ Continuous monitoring enabled
✅ Comprehensive report provided
✅ User understands next steps

## Ready to Begin

This is a comprehensive security audit that will significantly improve the security posture of the repository. Follow each phase carefully, communicate clearly, and celebrate the improvements made.

Begin the audit now${args?.path ? ` for ${args.path}` : ''}.
`

    return this.createUserMessage(promptText)
  }
}
