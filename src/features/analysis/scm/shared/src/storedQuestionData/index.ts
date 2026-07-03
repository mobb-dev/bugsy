// E-2015: all per-question text (content/description/guidance) is now
// computed in the analyzer's get_questions() and served on the FixQuestion, so
// the TS storedQuestionData collection is gone. Only the option-label helper
// remains (a generic, non-per-issue-type util consumed by the CLI and app).
export * from './optionValues'
