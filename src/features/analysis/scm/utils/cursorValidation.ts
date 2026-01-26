/**
 * Maximum allowed cursor value to prevent integer overflow and unexpected behavior.
 * This limits pagination to reasonable bounds.
 */
const MAX_CURSOR_VALUE = 100000

/**
 * Safely parses a cursor string into a valid number with comprehensive validation.
 * Returns defaultValue for invalid cursors instead of throwing, since CLI is more
 * permissive than the GraphQL API layer.
 *
 * Security considerations:
 * - Prevents NaN which causes silent failures in array operations
 * - Prevents negative values which could cause unexpected behavior
 * - Prevents excessively large values
 *
 * @param cursor - Cursor string (may be null/undefined/malformed)
 * @param defaultValue - Value to use if cursor is invalid (default: 0)
 * @param maxValue - Maximum allowed cursor value (default: 100000)
 * @returns Validated cursor as a number, or defaultValue if invalid
 *
 * @example
 * ```typescript
 * const offset = parseCursorSafe(cursor, 0) // Returns 0 if cursor is invalid
 * const page = parseCursorSafe(cursor, 1)   // Returns 1 if cursor is invalid
 * ```
 */
export function parseCursorSafe(
  cursor: string | null | undefined,
  defaultValue: number = 0,
  maxValue: number = MAX_CURSOR_VALUE
): number {
  // Handle null/undefined by returning default
  if (cursor === null || cursor === undefined || cursor === '') {
    return defaultValue
  }

  const parsed = parseInt(cursor, 10)

  // Validate result - return default on any validation failure
  if (isNaN(parsed) || parsed < 0 || parsed > maxValue) {
    return defaultValue
  }

  return parsed
}
