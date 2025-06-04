import { GetMcpFixesQuery } from '../../../../features/analysis/scm/generates/client_generates'

function frienlyType(s: string) {
  // First replace underscores with spaces
  const withoutUnderscores = s.replace(/_/g, ' ')
  // Then handle camelCase by adding spaces before capital letters (but not at the start)
  const result = withoutUnderscores.replace(/([a-z])([A-Z])/g, '$1 $2')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const noFixesFoundPrompt = `🎉 **MOBB SECURITY SCAN COMPLETED SUCCESSFULLY** 🎉

## Congratulations! No Vulnerabilities Found

Your code has been thoroughly analyzed by Mobb's advanced security scanning engine, and we're pleased to report that **no security vulnerabilities were detected** in your codebase.

### 🛡️ What This Means
- Your code follows secure coding practices
- No immediate security risks were identified
- Your application appears to be well-protected against common vulnerabilities

### ✅ Scan Summary
- **Status:** Complete
- **Vulnerabilities Found:** 0
- **Security Rating:** Excellent
- **Action Required:** None

### 🚀 Next Steps
While no vulnerabilities were found in this scan:
1. **Keep up the great work** with secure coding practices
2. **Run regular scans** as your codebase evolves
3. **Stay updated** with the latest security best practices
4. **Consider periodic security reviews** for ongoing protection

### 📊 Scan Details
This scan analyzed your code for common security issues including:
- SQL Injection vulnerabilities
- Cross-Site Scripting (XSS) flaws
- Authentication and authorization issues
- Input validation problems
- And many other security concerns

**Well done on maintaining a secure codebase!** 🏆`

export const fixesPrompt = (fixes: GetMcpFixesQuery['fix']) => {
  const fix = fixes[0]
  if (!fix) {
    return noFixesFoundPrompt
  }
  const fixList = fixes.map((fix) => {
    const vulnerabilityType = frienlyType(fix.safeIssueType!)
    const vulnerabilityDescription =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.extraContext?.fixDescription
        : undefined

    const patch =
      fix.patchAndQuestions?.__typename === 'FixData'
        ? fix.patchAndQuestions.patch
        : undefined

    return {
      vulnerabilityType: vulnerabilityType,
      vulnerabilityDescription: vulnerabilityDescription,
      patch,
    }
  })

  return `Here are the fixes to the vulnerabilities discovered by Mobb MCP

## CRITICAL INSTRUCTIONS - READ CAREFULLY

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

${fixList
  .map(
    (fix, index) => `
## Fix ${index + 1}: ${fix.vulnerabilityType}

**🎯 Target:** Apply this patch to fix a ${fix.vulnerabilityType.toLowerCase()} vulnerability

**📝 Description:** ${fix.vulnerabilityDescription || 'Security vulnerability fix'}

**🔧 Action Required:** Apply the following patch exactly as shown

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
  `
}

export const failedToConnectToApiPrompt = `# CONNECTION ERROR: FAILED TO REACH MOBB API

## ANALYSIS SUMMARY
- **Status:** ❌ Failed
- **Issue Type:** Connection Error
- **Error Details:** Unable to establish connection to the Mobb API service

## TROUBLESHOOTING STEPS FOR THE USER

The Mobb security scanning service is currently not reachable. This may be due to:

1. **Missing or invalid authentication credentials**
   - Ensure the \`API_KEY\` environment variable is properly set with your valid Mobb authentication token
   - Example: \`export API_KEY=your_mobb_api_key_here\`

2. **Incorrect API endpoint configuration**
   - Check if the \`API_URL\` environment variable needs to be set to the correct Mobb service endpoint
   - Example: \`export API_URL=https://api.mobb.ai/graphql\`

3. **Network connectivity issues**
   - Verify your internet connection is working properly
   - Check if any firewall or proxy settings might be blocking the connection

4. **Service outage**
   - The Mobb service might be temporarily unavailable
   - Please try again later or check the Mobb status page

## NEXT STEPS

Please resolve the connection issue using the steps above and try running the security scan again.

For additional assistance, please:
- Visit the Mobb documentation at https://docs.mobb.ai
- Contact Mobb support at support@mobb.ai

`

export const failedToAuthenticatePrompt = `# AUTHENTICATION ERROR: MOBB LOGIN REQUIRED

## ANALYSIS SUMMARY
- **Status:** ❌ Failed
- **Issue Type:** Authentication Error
- **Error Details:** Unable to authenticate with the Mobb service

## AUTHENTICATION REQUIRED

The Mobb security scanning service requires authentication before it can analyze your code for vulnerabilities. You need to:

1. **Login and authorize access to Mobb**
   - A browser window should have opened to complete the authentication process
   - If no browser window opened, please run the command again

2. **Create a Mobb account if you don't have one**
   - If you don't already have a Mobb account, you'll need to sign up
   - Visit https://app.mobb.ai/auth/signup to create your free account
   - Use your work email for easier team collaboration

3. **Authorization flow**
   - After logging in, you'll be asked to authorize the CLI tool
   - This creates a secure token that allows the CLI to access Mobb services
   - You only need to do this once per device

## TROUBLESHOOTING

If you're experiencing issues with authentication:

- Ensure you have an active internet connection
- Check that you can access https://app.mobb.ai in your browser
- Try running the command again with the \`--debug\` flag for more detailed output
- Make sure your browser isn't blocking pop-ups from the authentication window

## NEXT STEPS

Please complete the authentication process and try running the security scan again.

For additional assistance, please:
- Visit the Mobb documentation at https://docs.mobb.ai/cli/authentication
- Contact Mobb support at support@mobb.ai

`
