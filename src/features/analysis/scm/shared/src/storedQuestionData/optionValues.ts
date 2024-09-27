export function optionEnumToString(str: string): string {
  switch (str) {
    case 'stringEscapeUtils':
      return 'org.apache.commons.text.StringEscapeUtils'
    case 'htmlUtils':
      return 'org.springframework.web.util.HtmlUtils'
    case 'throw':
      return 'throw NullPointerException'
    case 'setDefaultEmptyString':
      return 'set value to empty string by default'
    case 'returnNull':
      return 'return nullish'
    default:
      return str
  }
}
