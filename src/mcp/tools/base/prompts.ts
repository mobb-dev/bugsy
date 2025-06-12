import { GetMcpFixesQuery } from '@mobb/bugsy/features/analysis/scm/generates/client_generates'

function frienlyType(s: string) {
  // First replace underscores with spaces
  const withoutUnderscores = s.replace(/_/g, ' ')
  // Then handle camelCase by adding spaces before capital letters (but not at the start)
  const result = withoutUnderscores.replace(/([a-z])([A-Z])/g, '$1 $2')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const applyFixesPrompt = (fixes: GetMcpFixesQuery['fix']) => {
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
