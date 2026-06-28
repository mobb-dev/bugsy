import { passwordInComment } from '../passwordInComment'
import { missingAntiForgeryValidation } from './missingAntiForgeryValidation'

const vulnerabilities = {
  ['MISSING_ANTIFORGERY_VALIDATION']: missingAntiForgeryValidation,
  ['PASSWORD_IN_COMMENT']: passwordInComment,
}

export default vulnerabilities
