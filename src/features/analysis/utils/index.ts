export * from './by_key'
export * from './calculate_ranges'
export * from './send_report'

// this method is making sure all items in the array are not null
export function getFromArraySafe<T>(array: Array<T | null>): T[] {
  return array.reduce((acc, nullableItem) => {
    if (nullableItem) {
      acc.push(nullableItem)
    }
    return acc
  }, [] as T[])
}
