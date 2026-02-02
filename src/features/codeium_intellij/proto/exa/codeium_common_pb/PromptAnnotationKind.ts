// Original file: exa/codeium_common_pb/codeium_common.proto

export const PromptAnnotationKind = {
  PROMPT_ANNOTATION_KIND_UNSPECIFIED: 'PROMPT_ANNOTATION_KIND_UNSPECIFIED',
  PROMPT_ANNOTATION_KIND_COPY: 'PROMPT_ANNOTATION_KIND_COPY',
  PROMPT_ANNOTATION_KIND_PROMPT_CACHE: 'PROMPT_ANNOTATION_KIND_PROMPT_CACHE',
} as const;

export type PromptAnnotationKind =
  | 'PROMPT_ANNOTATION_KIND_UNSPECIFIED'
  | 0
  | 'PROMPT_ANNOTATION_KIND_COPY'
  | 1
  | 'PROMPT_ANNOTATION_KIND_PROMPT_CACHE'
  | 2

export type PromptAnnotationKind__Output = typeof PromptAnnotationKind[keyof typeof PromptAnnotationKind]
