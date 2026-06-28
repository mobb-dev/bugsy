import { z } from 'zod'

import { IssueLanguage_Enum } from '../../../generates/client_generates'
import csharp from './csharp'
import dockerfile from './dockerfile'
import go from './go'
import hcl from './hcl'
import java from './java'
import javascript from './javascript'
import php from './php'
import python from './python'
import sql from './sql'
import xml from './xml'

export const StoredFixDataItemZ = z.object({
  guidance: z.function().args(z.any()).returns(z.string()),
})

// String-indexed (issue types are opaque strings keyed by their DB value). The
// per-issue-type entries have heterogeneous guidance arities, so the value is
// `unknown` and validated at the lookup site via StoredFixDataItemZ.safeParse.
export const languages: Record<string, Record<string, unknown>> = {
  [IssueLanguage_Enum.Java as string]: java,
  [IssueLanguage_Enum.JavaScript as string]: javascript,
  [IssueLanguage_Enum.CSharp as string]: csharp,
  [IssueLanguage_Enum.Sql as string]: sql,
  [IssueLanguage_Enum.Xml as string]: xml,
  [IssueLanguage_Enum.Python as string]: python,
  [IssueLanguage_Enum.Php as string]: php,
  [IssueLanguage_Enum.Go as string]: go,
  [IssueLanguage_Enum.Dockerfile as string]: dockerfile,
  [IssueLanguage_Enum.Hcl as string]: hcl,
}

export default languages
