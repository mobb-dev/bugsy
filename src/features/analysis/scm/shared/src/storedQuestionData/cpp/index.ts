import { commandInjection } from './commandInjection'
import { pathManipulation } from './pathManipulation'

const vulnerabilities = {
  ['CMDi']: commandInjection,
  ['PT']: pathManipulation,
}

export default vulnerabilities
