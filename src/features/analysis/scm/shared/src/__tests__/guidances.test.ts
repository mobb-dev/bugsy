import { describe, expect, it } from 'vitest'

import {
  FixQuestionInputType,
  IssueLanguage_Enum,
  IssueType_Enum,
  Language,
  ManifestAction,
} from '../../../generates/client_generates'
import { getGuidances } from '../guidances'
import { FixExtraContext, Question } from '../types'

describe('getGuidances', () => {
  const mockFixExtraContext: FixExtraContext = {
    manifestActionsRequired: [
      {
        action: ManifestAction.Add,
        language: Language.Java,
        lib: {
          name: 'org.springframework:spring-web',
          version: '4.0.9',
          envName: 'compile',
        },
        typesLib: null,
      },
    ],
    extraContext: [],
    fixDescription: 'Mocked fix description',
  }

  it('should return an empty array for invalid issue type or language', () => {
    const result = getGuidances({
      questions: [],
      issueType: 'InvalidType',
      issueLanguage: 'InvalidLanguage',
      fixExtraContext: mockFixExtraContext,
    })

    expect(result).toEqual([])
  })

  // it('should handle questions specific guidance', () => {
  //   // todo
  // })

  it('should return fix guidances for getPackageFixGuidance', () => {
    const mockQuestions: Question[] = [
      {
        key: 'questionWithoutGuidance',
        name: 'questionWithoutGuidance',
        value: 'testValue',
        defaultValue: 'defaultValue',
        error: false,
        extraContext: [],
        inputType: FixQuestionInputType.Select,
        options: [],
        index: 0,
      },
    ]

    const result = getGuidances({
      questions: mockQuestions,
      issueType: IssueType_Enum.SqlInjection,
      issueLanguage: IssueLanguage_Enum.Java,
      fixExtraContext: mockFixExtraContext,
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "guidance": "We use \`spring-web\` package in the fix. Please make sure you add the latest [\`spring-web\`](https://mvnrepository.com/artifact/org.springframework/spring-web) to your pom file.",
        "key": "fixGuidance_index_0",
      }
    `)
  })
})
