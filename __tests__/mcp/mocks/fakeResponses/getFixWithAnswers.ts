import {
  FixQuestionInputType,
  type GetFixWithAnswersQuery,
} from '../../../../src/features/analysis/scm/generates/client_generates'

// Tailored patch, zero remaining questions.
export const mockGetFixWithAnswers: { data: GetFixWithAnswersQuery } = {
  data: {
    fixData: {
      __typename: 'FixData' as const,
      patch: `diff --git a/src/render.js b/src/render.js
--- a/src/render.js
+++ b/src/render.js
@@ -1,3 +1,3 @@
-document.body.innerHTML = userBio;
+document.body.textContent = userBio;
`,
      patchOriginalEncodingBase64:
        'ZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCA9IHVzZXJCaW87',
      questions: [],
      extraContext: {
        __typename: 'FixExtraContextResponse' as const,
        fixDescription:
          'Replace innerHTML with textContent based on isServerSideCode=no.',
        extraContext: [],
      },
    },
  },
}

// Backend returned another question after the first answer (true cascading).
export const mockGetFixWithAnswersCascading: {
  data: GetFixWithAnswersQuery
} = {
  data: {
    fixData: {
      __typename: 'FixData' as const,
      patch: 'placeholder patch',
      patchOriginalEncodingBase64: 'cGxhY2Vob2xkZXIgcGF0Y2g=',
      questions: [
        {
          __typename: 'FixQuestion' as const,
          key: 'shouldNormalizeUnicode',
          name: 'shouldNormalizeUnicode',
          inputType: FixQuestionInputType.Select,
          options: ['yes', 'no'],
          defaultValue: 'no',
          value: null,
          index: 0,
          extraContext: [],
        },
      ],
      extraContext: {
        __typename: 'FixExtraContextResponse' as const,
        fixDescription:
          'Path traversal sanitizer needs to know whether to normalize unicode characters first.',
        extraContext: [],
      },
    },
  },
}

// Same question keys returned ⇒ answers were not applied (distinct from cascading).
export const mockGetFixWithAnswersAnswersIgnored: {
  data: GetFixWithAnswersQuery
} = {
  data: {
    fixData: {
      __typename: 'FixData' as const,
      patch: 'unchanged-original-patch',
      patchOriginalEncodingBase64: 'dW5jaGFuZ2Vk',
      questions: [
        {
          __typename: 'FixQuestion' as const,
          key: 'isServerSideCode',
          name: 'isServerSideCode',
          inputType: FixQuestionInputType.Select,
          options: ['yes', 'no'],
          defaultValue: 'no',
          value: null,
          index: 0,
          extraContext: [],
        },
      ],
      extraContext: {
        __typename: 'FixExtraContextResponse' as const,
        fixDescription: 'Replace innerHTML with textContent.',
        extraContext: [],
      },
    },
  },
}

// GetFixNoFixError branch.
export const mockGetFixWithAnswersNoFix: { data: GetFixWithAnswersQuery } = {
  data: {
    fixData: {
      __typename: 'GetFixNoFixError' as const,
    },
  },
}

// Unknown fixId: runtime null; cast satisfies codegen non-null fixData.
export const mockGetFixWithAnswersNotFound: {
  data: GetFixWithAnswersQuery
} = {
  data: {
    fixData: null as unknown as GetFixWithAnswersQuery['fixData'],
  },
}
