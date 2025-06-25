/* eslint-disable */
// Enhanced assertion helpers for E2E tests with colorized diff output

import chalk from 'chalk'

const colorExpected = (val) => chalk.green(val)
const colorActual = (val) => chalk.red(val)
const colorPath = (p) => chalk.bold.yellow(p)

/**
 * Simple truthy check with clear error message
 */
export const assert = (condition, msg = 'Expected condition to be truthy') => {
  if (!condition) {
    throw new Error(msg)
  }
}

/**
 * Recursively compares two values and returns array of difference strings.
 * E.g. ["user.name expected=Bob actual=Alice"].
 */
const collectDiffs = (actual, expected, path = '') => {
  const diffs = []

  // Handle primitive or strictly equal cases early
  if (actual === expected) {
    return diffs
  }

  const typeA = typeof actual
  const typeE = typeof expected

  if (typeA !== typeE) {
    diffs.push({
      path,
      expected: `<${typeE}>`,
      actual: `<${typeA}>`,
      note: 'type mismatch',
    })
    return diffs
  }

  // If they are arrays, compare length and each element
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      diffs.push({
        path,
        expected: expected.length,
        actual: actual.length,
        note: 'array length',
      })
    }
    const max = Math.max(actual.length, expected.length)
    for (let i = 0; i < max; i++) {
      diffs.push(
        ...collectDiffs(actual[i], expected[i], `${path}[${i}]`)
      )
    }
    return diffs
  }

  // If objects, iterate keys
  if (typeA === 'object' && actual && expected) {
    const keys = new Set([...Object.keys(actual), ...Object.keys(expected)])
    for (const key of keys) {
      if (!(key in actual)) {
        diffs.push({ path: `${path}.${key}`, expected: expected[key], actual: undefined, note: 'missing' })
      } else if (!(key in expected)) {
        diffs.push({ path: `${path}.${key}`, expected: undefined, actual: actual[key], note: 'extra' })
      } else {
        diffs.push(
          ...collectDiffs(actual[key], expected[key], path ? `${path}.${key}` : key)
        )
      }
    }
    return diffs
  }

  // Fallback primitive mismatch
  diffs.push({ path, expected, actual })
  return diffs
}

// Helper to highlight character-level differences between two strings
const highlightDiff = (
  base,
  compare,
  unchangedColorFn,
  diffBgColorFn,
) => {
  const maxLen = Math.max(base.length, compare.length)
  let res = ''
  for (let i = 0; i < maxLen; i += 1) {
    const charBase = base[i] ?? ''
    const charCompare = compare[i] ?? ''
    if (charBase === charCompare) {
      res += unchangedColorFn(charBase)
    } else {
      // Use space to keep alignment when one string is shorter
      res += diffBgColorFn(charBase || ' ')
    }
  }
  return res
}

// Returns expected string with differing chars highlighted (green background)
const colorExpectedWithDiff = (expectedStr, actualStr) =>
  highlightDiff(expectedStr, actualStr, chalk.green, chalk.bgGreen.black)

// Returns actual string with differing chars highlighted (red background)
const colorActualWithDiff = (actualStr, expectedStr) =>
  highlightDiff(actualStr, expectedStr, chalk.red, chalk.bgRed.white)

/**
 * Deep equality helper that prints detailed diff when mismatch occurs.
 */
export const assertDeepEqual = (actual, expected, msg) => {
  const diffs = collectDiffs(actual, expected)
  if (diffs.length > 0) {
    const lines = diffs.map((d) => {
      const p = colorPath(d.path || '(root)')
      const expRaw = JSON.stringify(d.expected)
      const actRaw = JSON.stringify(d.actual)
      const exp = colorExpectedWithDiff(expRaw, actRaw)
      const act = colorActualWithDiff(actRaw, expRaw)
      const note = d.note ? chalk.cyan(` (${d.note})`) : ''
      return `${p}:
       expected: ${exp}
       actual: ${act}${note}`
    })

    /* eslint-disable no-console */
    console.log(lines.join('\n- '))
    /* eslint-enable no-console */

    const defaultMsg = `Objects are not deeply equal. Diff:\n- ${lines.join('\n- ')}`
    throw new Error(msg ? `${msg}\n${defaultMsg}` : defaultMsg)
  }
}

/**
 * Asserts that a string contains a substring and prints helpful context
 */
export const assertIncludes = (
  text,
  substring,
  msg,
  isExpectedToInclude = true,
) => {
  const has = text.includes(substring)
  const pass = isExpectedToInclude ? has : !has

  if (!pass) {
    const defaultMsg = isExpectedToInclude
      ? 'Expected text to include substring'
      : 'Expected text NOT to include substring'

    /* eslint-disable no-console */
    console.log(chalk.red('Assertion failure in assertIncludes'))
    console.log(`${chalk.cyan('Substring:')} ${colorExpected(substring)}`)
    console.log(`${chalk.cyan('Actual text:')}`)
    console.log(colorActual(text))
    /* eslint-enable no-console */

    // Throw concise error message (without large text payload)
    throw new Error(msg ?? defaultMsg)
  }
}
