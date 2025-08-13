import { z } from 'zod'

import { IssueLanguage_Enum } from '../../../generates/client_generates'
import csharp from './csharp'
import go from './go'
import java from './java'
import js from './js'
import python from './python'
import xml from './xml'
import yaml from './yaml'

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
  [IssueLanguage_Enum.Python as string]: python,
  [IssueLanguage_Enum.Go as string]: go,
  [IssueLanguage_Enum.Yaml as string]: yaml,
}

export type SQLInjection = typeof java.SQL_Injection
export type CMDinjection = typeof java.CMDi_relative_path_command
export type Vulnerability = SQLInjection | CMDinjection
export default languages
