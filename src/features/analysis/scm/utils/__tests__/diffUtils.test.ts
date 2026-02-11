import { describe, expect, it } from 'vitest'

import { parseAddedLinesByFile, parseAddedLinesFromPatch } from '../diffUtils'

describe('parseAddedLinesFromPatch', () => {
  it('should parse added lines from a simple patch', () => {
    const patch = `@@ -1,3 +1,5 @@
 line1
+added line 1
 line2
+added line 2
 line3`

    const addedLines = parseAddedLinesFromPatch(patch)
    expect(addedLines).toEqual([2, 4])
  })

  it('should handle patch with multiple hunks', () => {
    const patch = `@@ -1,3 +1,4 @@
 line1
+added at line 2
 line2
 line3
@@ -10,3 +11,4 @@
 line10
+added at line 12
 line11
 line12`

    const addedLines = parseAddedLinesFromPatch(patch)
    expect(addedLines).toEqual([2, 12])
  })

  it('should return empty array for patch with no additions', () => {
    const patch = `@@ -1,3 +1,2 @@
 line1
-removed line
 line2`

    const addedLines = parseAddedLinesFromPatch(patch)
    expect(addedLines).toEqual([])
  })

  it('should handle patch with file headers', () => {
    const patch = `--- a/file.ts
+++ b/file.ts
@@ -1,2 +1,3 @@
 existing line
+new line
 another existing line`

    const addedLines = parseAddedLinesFromPatch(patch)
    expect(addedLines).toEqual([2])
  })

  it('should handle empty patch', () => {
    const addedLines = parseAddedLinesFromPatch('')
    expect(addedLines).toEqual([])
  })
})

describe('parseAddedLinesByFile', () => {
  it('should parse added lines from a multi-file diff', () => {
    const diff = `diff --git a/file1.ts b/file1.ts
--- a/file1.ts
+++ b/file1.ts
@@ -1,2 +1,3 @@
 line1
+new line in file1
 line2
diff --git a/file2.ts b/file2.ts
--- a/file2.ts
+++ b/file2.ts
@@ -1,2 +1,3 @@
 lineA
+new line in file2
 lineB`

    const result = parseAddedLinesByFile(diff)
    expect(result.get('file1.ts')).toEqual([2])
    expect(result.get('file2.ts')).toEqual([2])
  })

  it('should skip deleted files', () => {
    const diff = `diff --git a/deleted.ts b/deleted.ts
--- a/deleted.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-line1
-line2`

    const result = parseAddedLinesByFile(diff)
    expect(result.size).toBe(0)
  })
})
