import { McpGQLClient } from '../services/McpGQLClient'
import {
  MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
  MCP_TOOL_FETCH_AVAILABLE_FIXES,
  MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
} from '../tools/toolNames'
import { FixReportSummary, type McpFix } from '../types'
import { MCP_DEFAULT_LIMIT } from './configs'

function friendlyType(s: string) {
  // First replace underscores with spaces
  const withoutUnderscores = s.replace(/_/g, ' ')
  // Then handle camelCase by adding spaces before capital letters (but not at the start)
  const result = withoutUnderscores.replace(/([a-z])([A-Z])/g, '$1 $2')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const noFixesReturnedForParameters = `No fixes returned for the given offset and limit parameters.
`

export const noFixesReturnedForParametersWithGuidance = ({
  offset,
  limit,
  totalCount,
  currentTool,
}: {
  offset: number
  limit: number
  totalCount: number
  currentTool: string
}) => `## No Fixes Returned for Current Parameters

**📄 Current Request:**
- **Page:** ${Math.floor(offset / limit) + 1}
- **Offset:** ${offset}
- **Limit:** ${limit}

**❌ Result:** No fixes returned for the given offset and limit parameters.

**ℹ️ Available Fixes:** ${totalCount} total fixes are available, but your current offset (${offset}) is beyond the available range.

**✅ How to Get the Fixes:**

To retrieve the available fixes, use one of these approaches:

1. **Start from the beginning:**
   \`\`\`
   offset: 0
   \`\`\`

2. **Go to the first page:**
   \`\`\`
   offset: 0
   limit: ${limit}
   \`\`\`

3. **Get all fixes at once:**
   \`\`\`
   offset: 0
   limit: ${totalCount}
   \`\`\`

**📋 Valid offset range:** 0 to ${Math.max(0, totalCount - 1)}

To fetch the fixes, run the \`${currentTool}\` tool again with the corrected parameters.
`

export const applyFixesPrompt = ({
  fixes,
  hasMore,
  totalCount,
  nextOffset,
  shownCount,
  currentTool,
  offset,
  limit,
  gqlClient,
}: {
  fixes: McpFix[]
  hasMore: boolean
  totalCount: number
  nextOffset: number
  shownCount: number
  currentTool: string
  offset: number
  limit: number
  gqlClient: McpGQLClient
}) => {
  if (fixes.length === 0) {
    if (totalCount > 0) {
      return noFixesReturnedForParametersWithGuidance({
        offset,
        limit,
        totalCount,
        currentTool,
      })
    }
    return noFixesReturnedForParameters
  }

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(totalCount / limit)

  const fixList = fixes.map((fix: McpFix) => {
    const vulnerabilityType = friendlyType(fix.safeIssueType!)
    const vulnerabilityDescription =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.extraContext?.fixDescription
        : undefined

    const patch =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.patch
        : undefined

    const gitBlameLogin = fix.gitBlameLogin

    return {
      vulnerabilityType: vulnerabilityType,
      vulnerabilityDescription: vulnerabilityDescription,
      patch,
      gitBlameLogin,
      id: fix.id,
    }
  })
  const fixIds = fixList.map((fix) => fix.id)
  void gqlClient.updateFixesDownloadStatus(fixIds)

  return `## CRITICAL INSTRUCTIONS - READ CAREFULLY

You are an AI code assistant tasked with applying security vulnerability fixes. Follow these instructions EXACTLY:

### 1. IMMEDIATE ACTION REQUIRED
- **DO NOT ask for permission** - Apply the patches immediately
- **DO NOT explain first** - Apply the patch, then explain what you did
- **DO NOT modify any other code** - Only apply the exact changes shown in each patch

### 2. HOW TO APPLY EACH PATCH
For each fix below:
1. **Identify the target file** from the patch header (e.g., \`src/database/queries.js\`)
2. **Locate the exact lines** shown in the patch context
3. **Remove lines** that start with \`-\` (minus sign)
4. **Add lines** that start with \`+\` (plus sign)
5. **Keep unchanged lines** exactly as they are (lines without +/- prefix)
6. **Preserve indentation and formatting** exactly as shown

### 3. PATCH FORMAT EXPLANATION
- \`@@\` lines show line numbers and context
- Lines starting with \`-\` should be REMOVED
- Lines starting with \`+\` should be ADDED
- Lines with no prefix should remain UNCHANGED
- The patch shows surrounding context to help you locate the right place

### 4. VALIDATION STEPS
After applying each patch:
1. Verify the file syntax is correct
2. Ensure no unrelated code was modified
3. Confirm the vulnerability is addressed

### 5. ERROR HANDLING
If you cannot apply a patch:
1. Explain specifically what went wrong
2. Show the current state of the target lines
3. Ask for clarification on the specific issue

---

# SECURITY FIXES TO APPLY

## 📄 Pagination Info
- **Page:** ${currentPage} of ${totalPages}
- **Offset:** ${offset}
- **Limit:** ${limit}
- **Showing:** ${shownCount} of ${totalCount} total fixes

${fixList
  .map(
    (fix, index) => `
## Fix ${offset + index + 1}: ${fix.vulnerabilityType}

**🎯 Target:** Apply this patch to fix a ${fix.vulnerabilityType.toLowerCase()} vulnerability

**📝 Description:** ${fix.vulnerabilityDescription || 'Security vulnerability fix'}

${
  fix.gitBlameLogin
    ? `**👤 Git Blame:** The code that needs to be fixed was last modified by: \`${fix.gitBlameLogin}\`

`
    : ''
}**🔧 Action Required:** Apply the following patch exactly as shown

**📁 Patch to Apply:**
\`\`\`diff
${fix.patch || 'No patch available'}
\`\`\`

**✅ Expected Result:** The vulnerability will be fixed and the code will be more secure

---`
  )
  .join('\n')}

## FINAL REMINDER
- Apply ALL patches above in order
- Do NOT ask for permission
- Explain what you did AFTER applying the patches
- If any patch fails, continue with the others and report issues at the end

${
  hasMore
    ? `---

## More Fixes Available (${totalCount - nextOffset} remaining)

You have viewed ${shownCount} out of ${totalCount} available fixes.

To fetch additional fixes, run the \`${currentTool}\` tool again with the following parameters:

- **offset**: ${nextOffset}  _(start index for the next batch)_
- **limit**:  <number_of_fixes_to_return>  _(optional – default is ${MCP_DEFAULT_LIMIT})_

If you omit both **offset** and **limit**, the command will automatically return the next ${MCP_DEFAULT_LIMIT} fixes.
`
    : ''
}
`
}

export const noReportFoundPrompt = `🔍 **MOBB SECURITY SCAN STATUS**

## No Vulnerability Report Found

We were unable to find a previous vulnerability report for this repository. This could be due to several reasons:

### 📋 Possible Reasons
- This is a new repository that hasn't been scanned yet
- The repository URL might not match our records
- The repository might be private or not accessible
- Previous scans might have been deleted or expired

### 🎯 Recommended Actions
1. **Run a new security scan** to analyze your codebase
   - Use the \`${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES}\` tool to start a fresh scan
   - This will analyze your current code for security issues

2. **Verify repository access**
   - Ensure the repository is properly connected to Mobb
   - Check that you have the necessary permissions

3. **Check repository URL**
   - Confirm the repository URL matches your remote origin
   - Verify the URL format is correct (e.g., https://github.com/org/repo)

For assistance, please:
- Visit our documentation at https://docs.mobb.ai
- Contact support at support@mobb.ai`

export const expiredReportPrompt = ({
  lastReportDate,
}: {
  lastReportDate: string
}) => `🔍 **MOBB SECURITY SCAN STATUS**

## Out-of-Date Vulnerability Report

Your most recent vulnerability report for this repository **expired on ${lastReportDate}** and is no longer available for fetching automated fixes.

### 📋 Why Did This Happen?
- Reports are automatically purged after a retention period for security and storage optimisation.
- No new scans have been run since the last report expired.

### 🎯 Recommended Actions
1. **Run a fresh security scan** to generate an up-to-date vulnerability report.
   - Use the \`${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES}\` tool.
2. **Verify repository access** if scans fail to run or the repository has moved.
3. **Review your CI/CD pipeline** to ensure regular scans are triggered.

For more help:
- Documentation: https://docs.mobb.ai
- Support: support@mobb.ai`

export const noFixesAvailablePrompt = `There are no fixes available for this repository at this time.
`

export const fixesFoundPrompt = ({
  fixReport,
  offset,
  limit,
  gqlClient,
}: {
  fixReport: Omit<FixReportSummary, 'userFixes'>
  offset: number
  limit: number
  gqlClient: McpGQLClient
}) => {
  const totalFixes = fixReport.filteredFixesCount.aggregate?.count || 0

  if (totalFixes === 0) {
    return noFixesAvailablePrompt
  }

  const criticalFixes = fixReport.CRITICAL?.aggregate?.count || 0
  const highFixes = fixReport.HIGH?.aggregate?.count || 0
  const mediumFixes = fixReport.MEDIUM?.aggregate?.count || 0
  const lowFixes = fixReport.LOW?.aggregate?.count || 0
  const scanDate = new Date(
    fixReport.vulnerabilityReport?.scanDate || ''
  ).toLocaleString()
  const vendor = fixReport.vulnerabilityReport?.vendor || 'Unknown'
  const reportUrl = ''

  const shownCount = fixReport.fixes.length
  const nextOffset = offset + shownCount
  const hasMore = nextOffset < totalFixes

  return `🔍 **MOBB SECURITY SCAN RESULTS**

## 📊 Scan Report Summary
- **Scan Date:** ${scanDate}
- **Scan Vendor:** ${vendor}
${reportUrl ? `- **Report Link:** ${reportUrl}` : ''}

## 🎯 Issues Detected
${
  fixReport.issueTypes
    ? Object.entries(fixReport.issueTypes)
        .map(([type, count]) => `- ${type}: ${count} issues`)
        .join('\n')
    : 'No specific issue types reported'
}

## 🔧 Available Fixes
Total number of fixes available: **${totalFixes}**

### Severity Breakdown
- 🔴 Critical: ${criticalFixes}
- 🟠 High: ${highFixes}
- 🟡 Medium: ${mediumFixes}
- 🟢 Low: ${lowFixes}

${applyFixesPrompt({
  fixes: fixReport.fixes,
  totalCount: totalFixes,
  hasMore,
  nextOffset,
  shownCount: fixReport.fixes.length,
  currentTool: MCP_TOOL_FETCH_AVAILABLE_FIXES,
  offset,
  limit,
  gqlClient,
})}`
}

const nextStepsPrompt = ({ scannedFiles }: { scannedFiles: string[] }) => `
### 📁 Scanned Files
${scannedFiles.map((file) => `- ${file}`).join('\n')}

### Extend the scan scope

To scan a larger number of files, include the additional parameter:

- **maxFiles**: <number_of_files_to_scan>

This will scan up to the specified number of recently changed files.

### 🔄 Running a Fresh Scan

To perform a **rescan** of your repository (fetching a brand-new vulnerability report and updated fixes), include the additional parameter:

- **rescan**: true

This will start a new analysis, discard any cached results.

⚠️ *Note:* A full rescan may take longer to complete than simply fetching additional fixes because your repository is re-uploaded and re-analyzed from scratch.
`

export const noFixesFoundPrompt = ({
  scannedFiles,
}: {
  scannedFiles: string[]
}) => `🔍 **MOBB SECURITY SCAN COMPLETED** 

Mobb security scan completed successfully but found no automated fixes available at this time.

${nextStepsPrompt({ scannedFiles })}
`

export const fixesPrompt = ({
  fixes,
  totalCount,
  offset,
  scannedFiles,
  limit,
  gqlClient,
}: {
  fixes: McpFix[]
  totalCount: number
  offset: number
  scannedFiles: string[]
  limit: number
  gqlClient: McpGQLClient
}) => {
  if (totalCount === 0) {
    return noFixesFoundPrompt({ scannedFiles })
  }

  const shownCount = fixes.length
  const nextOffset = offset + shownCount
  const hasMore = nextOffset < totalCount

  return `Here are the fixes to the vulnerabilities discovered by Mobb MCP

${applyFixesPrompt({
  fixes,
  hasMore,
  totalCount,
  nextOffset,
  shownCount,
  currentTool: MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
  offset,
  limit,
  gqlClient,
})}

${nextStepsPrompt({ scannedFiles })}
`
}

export const noFreshFixesPrompt = `No fresh fixes available for this repository at this time. No user message needed. Do not show any comments to the user.`

const continuousMonitoringSection = `## 🔄 Continuous Monitoring Active

The Mobb MCP is continuously monitoring your code and will **automatically apply fixes** when new vulnerabilities are detected in files you modify or create.`

const autoFixSettingsSection = `## ⚙️ Auto-Fix Settings

If you prefer to review fixes manually before they're applied:
- **Turn off automatic fixes** in your Mobb app settings at https://app.mobb.ai/ setting section
- When disabled, you'll receive available fixes that you can apply manually through the \`${MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES}\` MCP tool`

const whatHappensNextSection = `## 🔍 What Happens Next

- Continue coding normally - Mobb is watching in the background
- Any new security issues will be automatically patched
- You'll be notified when fixes are applied to your codebase
- Review and commit changes when ready

Your code is being actively protected! 🚀`

export const noVulnerabilitiesAutoFixPrompt = `🛡️ **MOBB AUTO-FIX MONITORING ACTIVE**

## ✅ No Fixable Vulnerabilities Detected

No fixable vulnerabilities were detected so far.

${continuousMonitoringSection}

${autoFixSettingsSection}

${whatHappensNextSection}`

export const initialScanInProgressPrompt = `Initial scan is still in progress. No user message needed. Do not show any comments to the user.`

export const authenticationRequiredPrompt = `# AUTHENTICATION REQUIRED: MOBB ACCESS NOT AUTHORIZED

## MCP SERVICE UNAVAILABLE

The Mobb MCP (Model Context Protocol) service is currently unavailable because authentication with Mobb has not been completed.

## REQUIRED ACTION

To use Mobb's automated security fix capabilities, you need to:

1. **Authorize Mobb Access**
   - Restart Mobb MCP
   - A browser window will open for you to log in and authorize access

2. **Complete Authentication**
   - Sign in to your Mobb account (or create one if needed)
   - Authorize the CLI tool to access Mobb services
   - This creates a secure token for future automated scans

## WHAT HAPPENS NEXT

Once authentication is complete:
- The MCP service will automatically start monitoring your repository
- New security vulnerabilities will be detected and fixed automatically
- You'll receive notifications about applied fixes through this interface

## TROUBLESHOOTING

If you're experiencing authentication issues:
- Ensure you have an active internet connection
- Check that you can access https://app.mobb.ai in your browser
- Make sure your browser isn't blocking authentication pop-ups
- Try running a manual scan with the \`--debug\` flag for detailed output

For assistance:
- Documentation: https://docs.mobb.ai
- Support: support@mobb.ai`

export const freshFixesPrompt = ({
  fixes,
  limit,
  gqlClient,
}: {
  fixes: McpFix[]
  limit: number
  gqlClient: McpGQLClient
}) => {
  return `Here are the fresh fixes to the vulnerabilities discovered by Mobb MCP

${applyFixesPrompt({
  fixes,
  totalCount: fixes.length,
  hasMore: false,
  nextOffset: 0,
  shownCount: fixes.length,
  currentTool: MCP_TOOL_FETCH_AVAILABLE_FIXES,
  offset: 0,
  limit,
  gqlClient,
})}
`
}

export const appliedFixesPrompt = ({
  fixes,
  limit,
  gqlClient,
}: {
  fixes: McpFix[]
  limit: number
  gqlClient: McpGQLClient
}) => {
  return `Here are the fixes that were automatically applied by Mobb MCP

${applyFixesPrompt({
  fixes,
  totalCount: fixes.length,
  hasMore: false,
  nextOffset: 0,
  shownCount: fixes.length,
  currentTool: MCP_TOOL_FETCH_AVAILABLE_FIXES,
  offset: 0,
  limit,
  gqlClient,
})}

**Note:** These fixes have already been automatically applied to your codebase. Review the changes and commit them if satisfied.
`
}

function extractTargetFileFromPatch(patch?: string): string {
  const match = patch?.match(/^diff --git a\/([^\s]+) b\//)
  return match?.[1] || 'Unknown file'
}

function formatSeverity(
  severityText?: string | null,
  severityValue?: number | null
): string {
  if (severityText) return severityText
  if (severityValue !== null && severityValue !== undefined) {
    if (severityValue >= 9) return 'Critical'
    if (severityValue >= 7) return 'High'
    if (severityValue >= 4) return 'Medium'
    return 'Low'
  }
  return 'Unknown'
}

export const appliedFixesSummaryPrompt = ({
  fixes,
  gqlClient,
}: {
  fixes: McpFix[]
  gqlClient: McpGQLClient
}) => {
  const fixIds = fixes.map((fix) => fix.id)
  void gqlClient.updateFixesDownloadStatus(fixIds)

  const patchTime = new Date().toLocaleString()

  return `🛡️ **MOBB AUTO-FIX: VULNERABILITIES PATCHED**

## ✅ ${fixes.length} Security ${fixes.length === 1 ? 'Fix' : 'Fixes'} Automatically Applied

Mobb has automatically detected and fixed ${fixes.length} security ${fixes.length === 1 ? 'vulnerability' : 'vulnerabilities'} in your codebase.

## 📋 Applied Fixes Summary

${fixes
  .map((fix, index) => {
    const vulnerabilityType = friendlyType(fix.safeIssueType || 'Unknown')
    const severity = formatSeverity(fix.severityText, fix.severityValue)
    const description =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.extraContext?.fixDescription ||
          'Security vulnerability fix'
        : 'Security vulnerability fix'
    const patch =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.patch
        : undefined
    const targetFile = extractTargetFileFromPatch(patch)
    const gitBlameLogin = fix.gitBlameLogin || 'Unknown'

    return `### ${index + 1}. ${vulnerabilityType}

**🎯 Vulnerability Type:** ${vulnerabilityType}
**📊 Severity:** ${severity}
**📝 Description:** ${description}
**👤 Git Blame:** ${gitBlameLogin}
**📁 Target File:** \`${targetFile}\`
**⏰ Patch Applied:** ${patchTime}

---`
  })
  .join('\n')}

${continuousMonitoringSection}

${autoFixSettingsSection}

## 📋 Next Steps

1. **Review the changes** - Check the modified files to understand what was fixed
2. **Test your application** - Ensure the fixes don't break existing functionality  
3. **Commit the changes** - Add and commit the security fixes to your repository
4. **Continue coding** - Mobb will keep protecting your code automatically

${whatHappensNextSection}`
}

// export const failedToConnectToApiPrompt = `# CONNECTION ERROR: FAILED TO REACH MOBB API

// ## ANALYSIS SUMMARY
// - **Status:** ❌ Failed
// - **Issue Type:** Connection Error
// - **Error Details:** Unable to establish connection to the Mobb API service

// ## TROUBLESHOOTING STEPS FOR THE USER

// The Mobb security scanning service is currently not reachable. This may be due to:

// 1. **Missing or invalid authentication credentials**
//    - Ensure the \`API_KEY\` environment variable is properly set with your valid Mobb authentication token
//    - Example: \`export API_KEY=your_mobb_api_key_here\`

// 2. **Incorrect API endpoint configuration**
//    - Check if the \`API_URL\` environment variable needs to be set to the correct Mobb service endpoint
//    - Example: \`export API_URL=https://api.mobb.ai/graphql\`

// 3. **Network connectivity issues**
//    - Verify your internet connection is working properly
//    - Check if any firewall or proxy settings might be blocking the connection

// 4. **Service outage**
//    - The Mobb service might be temporarily unavailable
//    - Please try again later or check the Mobb status page

// ## NEXT STEPS

// Please resolve the connection issue using the steps above and try running the security scan again.

// For additional assistance, please:
// - Visit the Mobb documentation at https://docs.mobb.ai
// - Contact Mobb support at support@mobb.ai

// `

// export const failedToAuthenticatePrompt = `# AUTHENTICATION ERROR: MOBB LOGIN REQUIRED

// ## ANALYSIS SUMMARY
// - **Status:** ❌ Failed
// - **Issue Type:** Authentication Error
// - **Error Details:** Unable to authenticate with the Mobb service

// ## AUTHENTICATION REQUIRED

// The Mobb security scanning service requires authentication before it can analyze your code for vulnerabilities. You need to:

// 1. **Login and authorize access to Mobb**
//    - A browser window should have opened to complete the authentication process
//    - If no browser window opened, please run the command again

// 2. **Create a Mobb account if you don't have one**
//    - If you don't already have a Mobb account, you'll need to sign up
//    - Visit https://app.mobb.ai/auth/signup to create your free account
//    - Use your work email for easier team collaboration

// 3. **Authorization flow**
//    - After logging in, you'll be asked to authorize the CLI tool
//    - This creates a secure token that allows the CLI to access Mobb services
//    - You only need to do this once per device

// ## TROUBLESHOOTING

// If you're experiencing issues with authentication:

// - Ensure you have an active internet connection
// - Check that you can access https://app.mobb.ai in your browser
// - Try running the command again with the \`--debug\` flag for more detailed output
// - Make sure your browser isn't blocking pop-ups from the authentication window

// ## NEXT STEPS

// Please complete the authentication process and try running the security scan again.

// For additional assistance, please:
// - Visit the Mobb documentation at https://docs.mobb.ai/cli/authentication
// - Contact Mobb support at support@mobb.ai

// `
