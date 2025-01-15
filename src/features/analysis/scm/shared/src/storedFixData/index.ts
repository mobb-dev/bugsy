import { z } from 'zod'

import { IssueLanguage_Enum } from '../../../generates/client_generates'
import csharp from './csharp'
import java from './java'
import javascript from './javascript'
import php from './php'
import python from './python'
import sql from './sql'
import xml from './xml'

export const StoredFixDataItemZ = z.object({
  guidance: z.function().returns(z.string()),
})

export const languages = {
  [IssueLanguage_Enum.Java as string]: java,
  [IssueLanguage_Enum.JavaScript as string]: javascript,
  [IssueLanguage_Enum.CSharp as string]: csharp,
  [IssueLanguage_Enum.Sql as string]: sql,
  [IssueLanguage_Enum.Xml as string]: xml,
  [IssueLanguage_Enum.Python as string]: python,
  [IssueLanguage_Enum.Php as string]: php,
}

export type SQLInjection = typeof javascript.SQL_Injection
export default languages
