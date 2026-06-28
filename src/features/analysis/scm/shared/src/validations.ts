import { z } from 'zod'

import {
  getIssueTypeFriendlyString,
  SafeIssueTypeStringZ,
} from './getIssueType'
import { listIssueTypeCatalog } from './issueTypeCatalog'

export const IssueTypeSettingZ = z.object({
  autoPrEnabled: z.boolean(),
  enabled: z.boolean(),
  issueType: SafeIssueTypeStringZ,
})

export const IssueTypeSettingsZ = z
  .array(IssueTypeSettingZ)
  .transform((issueTypeSettings) => {
    const catalogValues = listIssueTypeCatalog().map((entry) => entry.value)
    // NO FALLBACK: the catalog must be hydrated before defaults are derived.
    // An empty catalog would otherwise silently drop every default fix-policy
    // setting (and is persisted by the user server), so fail loudly instead.
    if (catalogValues.length === 0) {
      throw new Error(
        'Issue-type catalog is not hydrated; cannot derive default issue-type settings'
      )
    }
    // Index existing settings by issue type so the merge is O(catalog + settings)
    // instead of an O(catalog × settings) nested find.
    const existingByIssueType = new Map(
      issueTypeSettings.map((setting) => [setting.issueType, setting])
    )
    return (
      catalogValues
        .map(
          (issueType) =>
            existingByIssueType.get(issueType) ?? {
              autoPrEnabled: false,
              enabled: true,
              issueType,
            }
        )
        // Decorate-sort-undecorate so the friendly label is computed once per entry
        // rather than twice per comparison.
        .map((setting) => ({
          setting,
          label: getIssueTypeFriendlyString(setting.issueType),
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ setting }) => setting)
    )
  })
