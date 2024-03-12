/* eslint-disable */
export function keyBy<T extends Record<string, any>>(
  array: Array<T>,
  keyBy: keyof T
): Record<string, T> {
  return array.reduce((acc, item) => {
    return { ...acc, [item[keyBy]]: item }
  }, {})
}
