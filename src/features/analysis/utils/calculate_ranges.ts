export function calculateRanges(integers: number[]): [number, number][] {
  // Sort the array in ascending order
  if (integers.length === 0) {
    return []
  }

  integers.sort((a, b) => a - b)

  const ranges = integers.reduce<[number, number][]>(
    (result, current, index) => {
      if (index === 0) {
        // Initialize the first range
        return [...result, [current, current]]
      }
      const currentRange = result[result.length - 1] as [number, number]
      const [_start, end] = currentRange
      if (current === end + 1) {
        // Expand the current range
        currentRange[1] = current
      } else {
        // Start a new range
        result.push([current, current])
      }

      return result
    },
    [] as [number, number][]
  )

  return ranges
}
