import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { PromptArgument } from '../types'
import { BasePrompt } from './base/BasePrompt'

const CheckForNewVulnerabilitiesArgsSchema = z.object({
  path: z.string().optional(),
})

type CheckForNewVulnerabilitiesArgs = z.infer<
  typeof CheckForNewVulnerabilitiesArgsSchema
>

export class CheckForNewVulnerabilitiesPrompt extends BasePrompt {
  public readonly name = 'check-for-new-vulnerabilities'
  public readonly description =
    'Guide for enabling continuous security monitoring to detect new vulnerabilities'
  public readonly arguments: PromptArgument[] = [
    {
      name: 'path',
      description: 'Optional: Full local path to the git repository to monitor',
      required: false,
    },
  ]
  protected readonly argumentsValidationSchema =
    CheckForNewVulnerabilitiesArgsSchema

  protected async generatePrompt(
    validatedArgs?: unknown
  ): Promise<GetPromptResult> {
    const args = validatedArgs as CheckForNewVulnerabilitiesArgs | undefined

    const promptText = `# Continuous Security Monitoring Setup

This workflow sets up ongoing security monitoring to detect new vulnerabilities as code changes.

## Purpose

The \`check_for_new_available_fixes\` tool provides:
- Lightweight background security monitoring
- Detection of newly introduced vulnerabilities
- Periodic checks without heavy scanning overhead
- Notifications when new fixes become available

## When to Use

Call this tool:
✓ At the end of a coding session
✓ After completing a series of edits
✓ After applying security fixes (to verify no new issues)
✓ Before committing code changes
✓ As part of a continuous security workflow
✓ When setting up a project for security monitoring

## Workflow Steps

### Step 1: Determine Repository Path
${
  args?.path
    ? `✓ Repository path provided: \`${args.path}\``
    : `Get the full local path to the git repository to monitor.`
}

### Step 2: Call check_for_new_available_fixes

Use the tool with minimal parameters:

\`\`\`json
{
  "path": "${args?.path || '<repository-path>'}"
}
\`\`\`

This tool is designed to be lightweight and non-intrusive.

### Step 3: Interpret Results

The tool will return one of several possible outcomes:

#### New Vulnerabilities Detected

If new security issues are found:

1. **Alert the user promptly:**
   "⚠️ New security vulnerabilities detected!"

2. **Provide summary:**
   - Number of new vulnerabilities
   - Severity breakdown
   - Files affected

3. **Recommend immediate action:**
   - For Critical/High: "I recommend reviewing these immediately"
   - For Medium/Low: "These should be addressed when convenient"

4. **Offer next steps:**
   - "Would you like to scan and see the details?"
   - "Should I fetch the available fixes?"
   - Suggest calling \`scan_and_fix_vulnerabilities\` or \`fetch_available_fixes\`

#### No New Vulnerabilities

"✓ Monitoring active. No new security vulnerabilities detected."

Optional follow-up:
- Confirm monitoring is now enabled
- Mention that checks will continue periodically
- Reassure the user their code remains secure

#### Monitoring Enabled

"✓ Continuous security monitoring has been enabled for this repository."

Explain what this means:
- Periodic background checks will run
- User will be notified of new vulnerabilities
- No action required from user right now

### Step 4: Handle User Response

**If new vulnerabilities were found:**

Guide the user to take appropriate action:

1. **Immediate threats (Critical/High):**
   - Strongly recommend scanning now
   - Offer to fetch and display fixes
   - Suggest not committing until fixed

2. **Medium priority:**
   - Add to todo list or backlog
   - Schedule time to address
   - Can proceed with current work

3. **Low priority:**
   - Track for future maintenance
   - Can be addressed in next refactoring
   - No immediate action required

**If no issues found:**

- Congratulate the user on maintaining security
- Remind them monitoring will continue
- Suggest they can continue their work confidently

### Step 5: Integration into Workflow

This tool should be called **automatically** in certain scenarios:

1. **End-of-session cleanup:**
   After a user completes a significant amount of work

2. **Post-fix verification:**
   After applying security fixes to ensure no new issues

3. **Pre-commit hook simulation:**
   Before suggesting the user commit their changes

4. **Periodic checks:**
   During long-running IDE sessions (every 15-30 minutes)

## Best Practices

### DO:
✓ Call this tool frequently and automatically
✓ Make it part of your regular workflow
✓ Alert users immediately when issues are found
✓ Provide clear severity context
✓ Offer actionable next steps
✓ Keep the messaging positive and non-alarming

### DON'T:
✗ Make this tool intrusive or annoying
✗ Overwhelm users with constant notifications
✗ Ignore Critical/High severity findings
✗ Forget to explain what monitoring means
✗ Skip this step at the end of sessions

## Monitoring vs. Scanning

It's important to understand the difference:

| Feature | check_for_new_available_fixes | scan_and_fix_vulnerabilities |
|---------|------------------------------|------------------------------|
| Purpose | Continuous monitoring | Full security scan |
| Speed | Very fast | Slower (minutes) |
| Depth | Lightweight check | Comprehensive analysis |
| When | Frequently, automatically | On-demand, deliberately |
| Results | Binary (new issues yes/no) | Detailed vulnerability reports |
| Resource usage | Minimal | Higher |

**Strategy:** Use monitoring frequently, trigger full scans only when needed.

## Example Usage

### Scenario 1: End of Coding Session

\`\`\`
AI: "I'm running a final security check on your changes..."

[Calls check_for_new_available_fixes]

AI: "✓ All clear! No new security vulnerabilities detected. Your code is safe to commit."
\`\`\`

### Scenario 2: New Vulnerabilities Found

\`\`\`
AI: "Running continuous security monitoring..."

[Calls check_for_new_available_fixes]

AI: "⚠️ I detected 2 new security vulnerabilities:
- 1 High severity
- 1 Medium severity

Would you like me to run a full scan to see the details and available fixes?"

User: "Yes, please"

[AI proceeds to call scan_and_fix_vulnerabilities]
\`\`\`

### Scenario 3: After Applying Fixes

\`\`\`
AI: "I've applied the security fixes. Let me verify no new issues were introduced..."

[Calls check_for_new_available_fixes]

AI: "✓ Perfect! The fixes resolved the issues and no new vulnerabilities were introduced. Your code is now more secure."
\`\`\`

## Silent vs. Announced Monitoring

**Silent monitoring** (recommended for background checks):
- Call the tool without announcing it
- Only notify user if issues are found
- Keeps the experience smooth and non-intrusive

**Announced monitoring** (use when setting up or after significant changes):
- Tell the user monitoring is running
- Confirm when monitoring is enabled
- Provides transparency and confidence

## Technical Details

The tool:
- Connects to Mobb's backend API
- Checks for new vulnerability data
- Compares against last known state
- Returns summary of new findings
- Maintains minimal overhead

## Ready to Monitor

Call the \`check_for_new_available_fixes\` tool now${
      args?.path ? ` for ${args.path}` : ''
    } to enable continuous security monitoring. This is a best practice that helps catch vulnerabilities early and maintain code security over time.
`

    return this.createUserMessage(promptText)
  }
}
