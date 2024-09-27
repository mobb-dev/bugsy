import { z } from 'zod'

import { IssueLanguage_Enum } from '../../../generates/client_generates'
import csharp from './csharp'
import java from './java'
import js from './js'
import xml from './xml'

export * from './optionValues'

export const StoredQuestionDataItemZ = z.object({
  content: z.function().args(z.any()).returns(z.string()),
  description: z.function().args(z.any()).returns(z.string()),
  guidance: z.function().args(z.any()).returns(z.string()),
})
export type StoredQuestionDataItem = z.infer<typeof StoredQuestionDataItemZ>

export const languages: {
  [languageName: string]: {
    [vulnerabilityName: string]: {
      [questionKey: string]: StoredQuestionDataItem
    }
  }
} = {
  [IssueLanguage_Enum.Java as string]: java,
  [IssueLanguage_Enum.JavaScript as string]: js,
  [IssueLanguage_Enum.Xml as string]: xml,
  [IssueLanguage_Enum.CSharp as string]: csharp,
}

export type SQLInjection = typeof java.SQL_Injection
export type CMDinjection = typeof java.CMDi_relative_path_command
export type Vulnerability = SQLInjection | CMDinjection
export default languages
