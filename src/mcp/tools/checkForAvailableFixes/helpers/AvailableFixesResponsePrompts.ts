import type { GetLatestReportByRepoUrlQuery } from '../../../../features/analysis/scm/generates/client_generates'
import { applyFixesPrompt } from '../../base/prompts'

type FixReport = NonNullable<GetLatestReportByRepoUrlQuery['fixReport']>[number]

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
   - Use the \`fix_vulnerabilities\` tool to start a fresh scan
   - This will analyze your current code for security issues

2. **Verify repository access**
   - Ensure the repository is properly connected to Mobb
   - Check that you have the necessary permissions

3. **Check repository URL**
   - Confirm the repository URL matches your remote origin
   - Verify the URL format is correct (e.g., https://github.com/org/repo)

### 🚀 Next Steps
To get started with security scanning:
1. Run \`fix_vulnerabilities\` to perform a new scan
2. Review the results and apply any suggested fixes
3. Set up regular scanning to maintain security

### 💡 Additional Information
- New scans typically take a few minutes to complete
- You'll receive detailed results including:
  - Vulnerability types and severities
  - Specific code locations
  - Recommended fixes
  - Security best practices

For assistance, please:
- Visit our documentation at https://docs.mobb.ai
- Contact support at support@mobb.ai`

const noFixesFoundPrompt = `🔍 **MOBB SECURITY SCAN STATUS**

## No Available Fixes Found

We've analyzed your repository but found no automated fixes available at this time.
`

export const fixesFoundPrompt = (fixReport: FixReport) => {
  if (fixReport.fixes_aggregate.aggregate?.count === 0) {
    return noFixesFoundPrompt
  }

  const totalFixes = fixReport.fixes_aggregate.aggregate?.count || 0
  const criticalFixes = fixReport.CRITICAL?.aggregate?.count || 0
  const highFixes = fixReport.HIGH?.aggregate?.count || 0
  const mediumFixes = fixReport.MEDIUM?.aggregate?.count || 0
  const lowFixes = fixReport.LOW?.aggregate?.count || 0
  const scanDate = new Date(
    fixReport.vulnerabilityReport?.scanDate || ''
  ).toLocaleString()
  const vendor = fixReport.vulnerabilityReport?.vendor || 'Unknown'
  const reportUrl = ''

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
- �� Low: ${lowFixes}

${applyFixesPrompt(fixReport.fixes)}`
}
