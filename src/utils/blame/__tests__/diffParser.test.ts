import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import { extractDiffStats } from '../diffParser'

function readFixture(name: string): string {
  return readFileSync(join(__dirname, 'fixtures', name), 'utf-8')
}

describe('extractDiffStats', () => {
  it('should extract added lines from a simple diff', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -7,6 +7,8 @@ export function example() {
   console.log('line 7')
   console.log('line 8')
   console.log('line 9')
+  console.log('line 10')
+  console.log('line 11')
   console.log('line 12')
   console.log('line 13')
   console.log('line 14')
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([
      {
        filePath: 'src/file1.ts',
        changedLines: [10, 11],
      },
    ])
    expect(result.additions).toBe(2)
    expect(result.deletions).toBe(0)
  })

  it('should extract added lines from multiple files', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -7,6 +7,8 @@ export function example() {
   console.log('line 7')
   console.log('line 8')
   console.log('line 9')
+  console.log('line 10')
+  console.log('line 11')
   console.log('line 12')
   console.log('line 13')
   console.log('line 14')
diff --git a/src/file2.ts b/src/file2.ts
index 7654321..fedcba9 100644
--- a/src/file2.ts
+++ b/src/file2.ts
@@ -17,6 +17,7 @@ export function another() {
   console.log('line 17')
   console.log('line 18')
   console.log('line 19')
+  console.log('line 20')
   console.log('line 21')
   console.log('line 22')
   console.log('line 23')
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([
      {
        filePath: 'src/file1.ts',
        changedLines: [10, 11],
      },
      {
        filePath: 'src/file2.ts',
        changedLines: [20],
      },
    ])
    expect(result.additions).toBe(3)
    expect(result.deletions).toBe(0)
  })

  it('should skip deleted files', () => {
    const diff = `diff --git a/src/deleted.ts b/src/deleted.ts
deleted file mode 100644
index 1234567..0000000
--- a/src/deleted.ts
+++ /dev/null
@@ -1,3 +0,0 @@
-export function deleted() {
-  console.log('deleted')
-}
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([])
    expect(result.additions).toBe(0)
    expect(result.deletions).toBe(3)
  })

  it('should handle files with only deletions', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -7,8 +7,6 @@ export function example() {
   console.log('line 7')
   console.log('line 8')
-  console.log('line 9')
-  console.log('line 10')
   console.log('line 11')
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([])
    expect(result.additions).toBe(0)
    expect(result.deletions).toBe(2)
  })

  it('should handle empty diff', () => {
    const result = extractDiffStats('')

    expect(result.changedFiles).toEqual([])
    expect(result.additions).toBe(0)
    expect(result.deletions).toBe(0)
  })

  it('should handle multiple chunks in same file', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -6,6 +6,7 @@ export function example() {
   console.log('line 6')
   console.log('line 7')
   console.log('line 8')
+  console.log('line 9')
   console.log('line 10')
   console.log('line 11')
   console.log('line 12')
@@ -18,6 +19,8 @@ export function example() {
   console.log('line 18')
   console.log('line 19')
   console.log('line 20')
+  console.log('line 21')
+  console.log('line 22')
   console.log('line 23')
   console.log('line 24')
   console.log('line 25')
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([
      {
        filePath: 'src/file1.ts',
        changedLines: [9, 22, 23],
      },
    ])
    expect(result.additions).toBe(3)
    expect(result.deletions).toBe(0)
  })

  it('should correctly track line numbers with mixed changes', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -5,10 +5,11 @@ export function example() {
   console.log('line 5')
   console.log('line 6')
   console.log('line 7')
-  console.log('line 8')
+  console.log('line 8 modified')
   console.log('line 9')
+  console.log('line 10 added')
   console.log('line 11')
-  console.log('line 12')
   console.log('line 13')
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([
      {
        filePath: 'src/file1.ts',
        changedLines: [8, 10],
      },
    ])
    expect(result.additions).toBe(2)
    expect(result.deletions).toBe(2)
  })

  it('should handle new file creation', () => {
    const diff = `diff --git a/src/newfile.ts b/src/newfile.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/newfile.ts
@@ -0,0 +1,5 @@
+export function newFunction() {
+  console.log('line 1')
+  console.log('line 2')
+  return true
+}
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([
      {
        filePath: 'src/newfile.ts',
        changedLines: [1, 2, 3, 4, 5],
      },
    ])
    expect(result.additions).toBe(5)
    expect(result.deletions).toBe(0)
  })

  it('should handle renamed files with changes', () => {
    const diff = `diff --git a/src/old-name.ts b/src/new-name.ts
similarity index 80%
rename from src/old-name.ts
rename to src/new-name.ts
index 1234567..abcdefg 100644
--- a/src/old-name.ts
+++ b/src/new-name.ts
@@ -1,3 +1,4 @@
 export function example() {
   console.log('existing')
+  console.log('new line')
 }
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([
      {
        filePath: 'src/new-name.ts',
        changedLines: [3],
      },
    ])
    expect(result.additions).toBe(1)
    expect(result.deletions).toBe(0)
  })

  it('should handle renamed files without changes', () => {
    const diff = `diff --git a/src/old-name.ts b/src/new-name.ts
similarity index 100%
rename from src/old-name.ts
rename to src/new-name.ts
`

    const result = extractDiffStats(diff)

    expect(result.changedFiles).toEqual([])
    expect(result.additions).toBe(0)
    expect(result.deletions).toBe(0)
  })

  it('should sum additions and deletions across multiple files', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -5,4 +5,5 @@ export function example() {
   console.log('line 5')
   console.log('line 6')
-  console.log('line 7')
+  console.log('line 7 modified')
+  console.log('line 8 added')
   console.log('line 9')
diff --git a/src/file2.ts b/src/file2.ts
index 7654321..fedcba9 100644
--- a/src/file2.ts
+++ b/src/file2.ts
@@ -1,5 +1,3 @@
 export function another() {
-  console.log('removed 1')
-  console.log('removed 2')
   console.log('kept')
 }
`

    const result = extractDiffStats(diff)

    expect(result.additions).toBe(2)
    expect(result.deletions).toBe(3)
  })

  // =========================================================================
  // Real-world git diff tests
  // These read actual diffs from this repository's history (saved as fixture
  // files to preserve exact whitespace) and validate against git's own
  // --numstat output as ground truth.
  // =========================================================================

  describe('real git diff: new file + deleted file + modified file', () => {
    // From commit 00dc05589: feat: T-215 add Tracy context to AI code review workflows
    // git diff --numstat:
    //   75  0  .github/workflows/_reusable-code-review.yml     (new file)
    //   0  28  .github/workflows/code-review-opus.yml           (deleted file)
    //   40 14  .github/workflows/code-review.yml                (modified)
    // Total: 115 insertions, 42 deletions
    const realDiff = readFixture('real-diff-new-deleted-modified.diff')

    it('should match git --numstat totals (115 additions, 42 deletions)', () => {
      const result = extractDiffStats(realDiff)
      expect(result.additions).toBe(115)
      expect(result.deletions).toBe(42)
    })

    it('should produce changedFiles only for new and modified files (not deleted)', () => {
      const result = extractDiffStats(realDiff)
      const fileNames = result.changedFiles.map((f) => f.filePath)

      // New file and modified file should appear
      expect(fileNames).toContain('.github/workflows/_reusable-code-review.yml')
      expect(fileNames).toContain('.github/workflows/code-review.yml')

      // Deleted file must NOT appear
      expect(fileNames).not.toContain('.github/workflows/code-review-opus.yml')
    })

    it('should list all 75 lines of the new file as changed', () => {
      const result = extractDiffStats(realDiff)
      const newFile = result.changedFiles.find(
        (f) => f.filePath === '.github/workflows/_reusable-code-review.yml'
      )!
      expect(newFile).toBeDefined()
      expect(newFile.changedLines).toHaveLength(75)
      // Lines should be 1..75
      expect(newFile.changedLines[0]).toBe(1)
      expect(newFile.changedLines[74]).toBe(75)
    })

    it('should list only added lines (not context/deleted) for the modified file', () => {
      const result = extractDiffStats(realDiff)
      const modifiedFile = result.changedFiles.find(
        (f) => f.filePath === '.github/workflows/code-review.yml'
      )!
      expect(modifiedFile).toBeDefined()
      // git --numstat says 40 additions for this file
      expect(modifiedFile.changedLines).toHaveLength(40)
    })
  })

  describe('real git diff: deleted file + new file + renamed with changes + pure renames', () => {
    // From commit 763ff2d1f: fix progress stage migration
    // git diff --numstat:
    //   0  6  .../down.sql                        (deleted)
    //   1  0  .../fix_progress_stage/down.sql      (new)
    //   5  2  .../up.sql                           (renamed + modified)
    //   0  0  .../down.sql                         (pure rename)
    //   0  0  .../up.sql                           (pure rename)
    // Total: 6 insertions, 8 deletions
    const realDiff = readFixture('real-diff-renames.diff')

    it('should match git --numstat totals (6 additions, 8 deletions)', () => {
      const result = extractDiffStats(realDiff)
      expect(result.additions).toBe(6)
      expect(result.deletions).toBe(8)
    })

    it('should include new file and renamed+modified file, exclude deleted and pure renames', () => {
      const result = extractDiffStats(realDiff)
      const fileNames = result.changedFiles.map((f) => f.filePath)

      // New file (1 added line)
      expect(fileNames).toContain(
        'services/app_api/migrations/default/1769428063048_fix_progress_stage/down.sql'
      )

      // Renamed + modified file (5 added lines)
      expect(fileNames).toContain(
        'services/app_api/migrations/default/1769428063048_fix_progress_stage/up.sql'
      )

      // Deleted file must NOT appear
      expect(fileNames).not.toContain(
        'services/app_api/migrations/default/1768700000000_add_progress_to_blame_requests/down.sql'
      )

      // Pure renames (0 changes) must NOT appear
      expect(fileNames).not.toContain(
        'services/app_api/migrations/default/1769456476713_add_attribution_query_indexes/down.sql'
      )
      expect(fileNames).not.toContain(
        'services/app_api/migrations/default/1769456476713_add_attribution_query_indexes/up.sql'
      )

      expect(result.changedFiles).toHaveLength(2)
    })

    it('should correctly count added lines in the renamed+modified file', () => {
      const result = extractDiffStats(realDiff)
      const renamedFile = result.changedFiles.find((f) =>
        f.filePath.includes('fix_progress_stage/up.sql')
      )!
      expect(renamedFile).toBeDefined()
      // git --numstat says 5 additions for this file
      expect(renamedFile.changedLines).toHaveLength(5)
    })

    it('should correctly count the single line in the new file', () => {
      const result = extractDiffStats(realDiff)
      const newFile = result.changedFiles.find((f) =>
        f.filePath.includes('fix_progress_stage/down.sql')
      )!
      expect(newFile).toBeDefined()
      // git --numstat says 1 addition for this file
      expect(newFile.changedLines).toHaveLength(1)
      expect(newFile.changedLines[0]).toBe(1)
    })
  })
})
