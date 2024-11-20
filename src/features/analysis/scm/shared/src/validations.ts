import { z } from 'zod'

import { IssueType_Enum } from '../../generates/client_generates'
import { getIssueTypeFriendlyString } from './getIssueType'

export const IssueTypeSettingZ = z.object({
  autoPrEnabled: z.boolean(),
  enabled: z.boolean(),
  issueType: z.nativeEnum(IssueType_Enum),
})

export const IssueTypeSettingsZ = z
  .array(IssueTypeSettingZ)
  .transform((issueTypeSettings) => {
    return Object.values(IssueType_Enum)
      .map((issueTypeEnum) => {
        const existingIssueTypeSetting = issueTypeSettings.find(
          ({ issueType: dbIssueType }) => dbIssueType === issueTypeEnum
        )
        if (existingIssueTypeSetting) {
          return existingIssueTypeSetting
        }
        return {
          autoPrEnabled: false,
          enabled: true,
          issueType: issueTypeEnum,
        }
      })
      .sort((a, b) => {
        return getIssueTypeFriendlyString(a.issueType).localeCompare(
          getIssueTypeFriendlyString(b.issueType)
        )
      })
  })
