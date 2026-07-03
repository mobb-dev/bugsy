import { Language, ManifestAction } from '../../generates/client_generates'
import {
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

// E-2015: per-question text (content/description/guidance) is computed by
// the owning fix in the analyzer and served directly on the FixQuestion, so the
// FE reads it off the question — the getQuestionInformation/curried accessor and
// its TS storedQuestionData fallback have been removed.

export function getPackageFixGuidance(
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
  fixExtraContext,
}: {
  fixExtraContext: FixExtraContext
}) {
  // E-2015: fix-level guidance is served by the analyzer on
  // FixExtraContext.guidances; the TS storedFixData fallback has been removed.
  const libGuidances = getPackageFixGuidance(
    fixExtraContext.manifestActionsRequired
  )
  const servedFixGuidances = fixExtraContext.guidances ?? []
  return libGuidances
    .concat(servedFixGuidances)
    .filter((guidance) => !!guidance)
}

// Note: we're merging the guidance from specific questions and from the fix general guidance
export function getGuidances(args: {
  questions: Question[]
  issueType: string | null
  issueLanguage: string | null
  fixExtraContext: FixExtraContext
}) {
  const { questions, fixExtraContext } = args
  // E-2015: guidance is served on the FixQuestion / FixExtraContext, so it is
  // surfaced directly — regardless of whether the issue type/language are
  // recognized enum members (issue types are opaque, analyzer-served strings).
  const fixGuidances = getFixGuidances({ fixExtraContext }).map(
    (guidance, index) => ({ guidance, key: `fixGuidance_index_${index}` })
  )
  return questions
    .map((question) => ({ guidance: question.guidance, key: question.key }))
    .filter(({ guidance }) => !!guidance)
    .concat(fixGuidances)
}
