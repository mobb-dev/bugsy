import { z } from 'zod'

import {
  IssueLanguage_Enum,
  IssueType_Enum,
  Language,
  ManifestAction,
} from '../../generates/client_generates'
import {
  languages as fixDataLanguages,
  StoredFixDataItemZ,
} from './storedFixData'
import languages, {
  StoredQuestionDataItemZ,
  Vulnerability,
} from './storedQuestionData'
import {
  ExtraContext,
  FixExtraContext,
  FixQuestionData,
  ManifestActionRequired,
  Question,
} from './types'

export function toQuestion(userInput: FixQuestionData): Question {
  const { key, defaultValue } = userInput
  const value = userInput.value || defaultValue
  return { ...userInput, defaultValue, value, key, error: false }
}

export function getQuestionInformation({
  fixQuestionData,
  issueType,
  language,
}: {
  fixQuestionData: FixQuestionData
  issueType: IssueType_Enum
  language: IssueLanguage_Enum
}) {
  const { name } = fixQuestionData
  const storedQuestionDataItem = languages[language]?.[issueType]?.[
    name as keyof Vulnerability
  ] ?? {
    content: () => '',
    description: () => '',
    guidance: () => '',
  }
  return StoredQuestionDataItemZ.parse(storedQuestionDataItem)
}

export type CurriedQuestionInformationByQuestion =
  typeof curriedQuestionInformationByQuestion

export function curriedQuestionInformationByQuestion({
  issueType,
  language,
}: {
  issueType: IssueType_Enum
  language: IssueLanguage_Enum
}) {
  return (fixQuestionData: FixQuestionData) =>
    getQuestionInformation({
      issueType,
      language,
      fixQuestionData,
    })
}

function getPackageFixGuidance(
  actionsRequired: ManifestActionRequired[]
): string[] {
  const actionRequiredStrings = actionsRequired.map((action) => {
    if (action.language === Language.Js) {
      if (action.action === ManifestAction.Add) {
        let actionRequired = `We use \`${action.lib.name}\` package to sanitize user input. Please make sure you add the latest [\`${action.lib.name}\`](https://www.npmjs.com/package/${action.lib.name}) to your \`package.json\` file.`
        if (action.typesLib) {
          actionRequired += ` For TypeScript users, consider adding [\`${action.typesLib.name}\`](https://www.npmjs.com/package/${action.typesLib.name}) to your \`package.json\` as well`
        }
        return actionRequired
      }
      if (action.action === ManifestAction.Relock) {
        const actionRequired = `A lock file was detected, please make sure to relock the lock file using your package manager.`
        return actionRequired
      }
      if (action.action === ManifestAction.Upgrade) {
        return `We use \`${action.lib.name}\` package to sanitize user input. Please make sure you upgrade the package [\`${action.lib.name}\`](https://www.npmjs.com/package/${action.lib.name}) to the latest version in your \`package.json\` file.`
      }
    }
    if (action.language === Language.Java) {
      const names = action.lib.name.split(':')
      const groupId = names[0]
      const artifactId = names[1]
      if (action.action === ManifestAction.Add) {
        return `We use \`${artifactId}\` package in the fix. Please make sure you add the latest [\`${artifactId}\`](https://mvnrepository.com/artifact/${groupId}/${artifactId}) to your pom file.`
      }
      if (action.action === ManifestAction.Upgrade) {
        return `We use \`${artifactId}\` package in the fix. Please make sure you upgrade the package [\`${artifactId}\`](https://mvnrepository.com/artifact/${groupId}/${artifactId}) to the latest version in your pom file.`
      }
    }
    return undefined
  })
  return actionRequiredStrings.filter((action) => !!action) as string[]
}

export function getFixGuidances({
  issueType,
  issueLanguage,
  fixExtraContext,
  questions,
}: {
  issueType: IssueType_Enum | null
  issueLanguage: IssueLanguage_Enum | null
  fixExtraContext: FixExtraContext
  questions: Question[]
}) {
  const storedFixGuidanceDataItem =
    fixDataLanguages[issueLanguage || '']?.[issueType || ''] ?? {}
  const storeFixResult = StoredFixDataItemZ.safeParse(storedFixGuidanceDataItem)
  const libGuidances = getPackageFixGuidance(
    fixExtraContext.manifestActionsRequired
  )
  const extraContext = fixExtraContext.extraContext.reduce(
    (acc, obj) => {
      acc[obj.key] = obj.value
      return acc
    },
    {} as { [key: string]: ExtraContext }
  )
  const fixGuidance: string[] = storeFixResult.success
    ? [storeFixResult.data.guidance({ questions, ...extraContext })]
    : []
  return libGuidances.concat(fixGuidance).filter((guidance) => !!guidance)
}

// Note: we're merging the guidance from specific questions and from the fix general guidance
export function getGuidances({
  questions,
  issueType,
  issueLanguage,
  fixExtraContext,
}: {
  questions: Question[]
  issueType: IssueType_Enum | null
  issueLanguage: IssueLanguage_Enum | null
  fixExtraContext: FixExtraContext
}) {
  const fixGuidances = getFixGuidances({
    issueType,
    issueLanguage,
    fixExtraContext,
    questions,
  }).map((guidance, index) => ({ guidance, key: `fixGuidance_index_${index}` }))
  return questions
    .map((question) => {
      let questionGuidance = question.guidance
      if (!questionGuidance && issueType && issueLanguage) {
        const getFixInformation = curriedQuestionInformationByQuestion({
          issueType: z.nativeEnum(IssueType_Enum).parse(issueType),
          language: z.nativeEnum(IssueLanguage_Enum).parse(issueLanguage),
        })
        const { guidance } = getFixInformation(question)

        questionGuidance = guidance({
          userInputValue: question.value,
        })
      }
      return {
        ...question,
        guidance: questionGuidance,
      }
    })
    .filter(({ guidance }) => !!guidance)
    .map(({ guidance, key }) => ({ guidance, key }))
    .concat(fixGuidances)
}
