# Hash Search Algorithm - TDD Implementation Plan

## Overview
This document outlines the Test-Driven Development (TDD) plan for implementing the salted hash search algorithm as specified in spec.md.

## TDD Approach
1. Create test structure in `__test__` folder
2. Create empty function stubs for implementation
3. Implement all tests (each in separate file)
4. Run tests one by one
5. Implement code to make each test pass

## Phase 1: Setup Structure

### 1.1 Create Error Class
**File**: `errors.ts`
- Create custom `HashSearchError` class extending `Error`

### 1.2 Create Implementation Stubs
**File**: `index.ts`
- Export `createIndex(originalText: string, windowSize?: number): Buffer` - returns empty Buffer
  - windowSize is optional, default 30, minimum 8
- Export `searchIndex(searchText: string, index: Buffer): number[]` - returns empty array
  - Window size is read from index buffer
- Export `HashSearchError` class

### 1.3 Create Test Structure
**Folder**: `__test__/`

All test files will follow naming: `{number}-{description}.test.ts`

## Phase 2: Test Files (in order of implementation)

### Test 1: `01-error-class.test.ts`
**Purpose**: Verify HashSearchError class works
- Test that HashSearchError is instance of Error
- Test that error message is preserved
- Test that error name is 'HashSearchError'

### Test 2: `02-create-index-validation.test.ts`
**Purpose**: Test input validation for createIndex
- Empty string throws HashSearchError
- String with < 30 characters throws HashSearchError
- String with exactly 30 characters succeeds
- Null/undefined throws error

### Test 3: `03-search-index-validation.test.ts`
**Purpose**: Test input validation for searchIndex
- Empty search string throws HashSearchError
- Search string < 30 characters throws HashSearchError
- Search string with exactly 30 characters succeeds
- Invalid index buffer (< 8 bytes) throws HashSearchError
- Invalid buffer length ((length - 8) not multiple of 24) throws HashSearchError

### Test 4: `04-magic-number.test.ts`
**Purpose**: Test magic number functionality
- createIndex writes correct magic number (0x72, 0x83, 0x00, 0x01) at bytes 0-3
- searchIndex throws error when magic number is invalid
- searchIndex succeeds when magic number is correct

### Test 5: `05-buffer-structure.test.ts`
**Purpose**: Test buffer format and size
- Buffer has correct header size (8 bytes)
- Buffer size is exactly 8 + (numChunks × 24) bytes
- Original text length is stored at bytes 4-7 (big-endian)
- Original text length can be read back correctly

### Test 6: `06-exact-30-char-search.test.ts`
**Purpose**: Test exact 30-character search
- Create index for 30-character text
- Search for exact same 30-character text
- Should return [0]

### Test 7: `07-no-match.test.ts`
**Purpose**: Test when no match is found
- Create index for text
- Search for non-existent pattern
- Should return empty array []

### Test 8: `08-single-match-at-start.test.ts`
**Purpose**: Test single match at position 0
- Create index for text starting with known pattern
- Search for pattern at start
- Should return [0]

### Test 9: `09-single-match-in-middle.test.ts`
**Purpose**: Test single match in middle of text
- Create index for text with pattern in middle
- Search for pattern
- Should return correct position (not 0)

### Test 10: `10-multiple-matches.test.ts`
**Purpose**: Test multiple occurrences of same pattern
- Create index for text with repeated pattern
- Search for pattern
- Should return all positions in ascending order

### Test 11: `11-padding-logic.test.ts`
**Purpose**: Test padding for texts not multiple of 30
- Test with text length 31 (requires 29 padding bytes)
- Test with text length 59 (requires 1 padding byte)
- Test with text length 60 (requires 0 padding bytes)
- Verify buffer size is correct in each case

### Test 12: `12-search-padding.test.ts`
**Purpose**: Test search text padding
- Create index for text ending with pattern
- Search for pattern that extends to padded region
- Should find match correctly

### Test 13: `13-different-hashes-same-text.test.ts`
**Purpose**: Verify same text at different positions produces different hashes
- Create index for text with repeated substring
- Read salt-hash pairs from buffer at different positions
- Verify salts are different (randomness)
- Note: Cannot verify hashes directly without knowing original text

### Test 14: `14-consistent-search-results.test.ts`
**Purpose**: Test that same search on same index returns same results
- Create index once
- Search multiple times with same search text
- Results should be identical

### Test 15: `15-search-longer-than-original.test.ts`
**Purpose**: Test search text longer than original
- Create index for short text (30 chars)
- Search with longer text (60 chars)
- Should return empty array []

### Test 16: `16-match-boundary-check.test.ts`
**Purpose**: Test matches don't extend beyond original text length
- Create index for text
- Verify matches at end don't exceed original text length
- Note: This is tested implicitly by other tests, but good to verify explicitly

### Test 17: `17-longer-search-multiple-chunks.test.ts`
**Purpose**: Test searches with multiple chunks (> 30 chars)
- Create index for long text
- Search with 60-character pattern
- Should find match using consecutive hash comparisons

### Test 18: `18-early-termination.test.ts`
**Purpose**: Verify early termination optimization works
- Note: This is a behavior test, not a performance test
- Create index for text
- Search for pattern that doesn't exist
- Verify function returns quickly (implicitly tested by execution)

### Test 19: `19-custom-window-size.test.ts`
**Purpose**: Test configurable window size
- Create index with custom window size (e.g., 10, 15, 20)
- Verify buffer stores window size correctly (bytes 8-11)
- Search using the custom-sized index
- Verify search works correctly with custom window size
- Note: All other tests use default window size 30

## Phase 3: Implementation Order

### Step 1: Implement Error Class
Run test: `01-error-class.test.ts`
Implement: `HashSearchError` class

### Step 2: Implement Validation
Run tests: `02-create-index-validation.test.ts`, `03-search-index-validation.test.ts`
Implement: Input validation logic

### Step 3: Implement Magic Number
Run test: `04-magic-number.test.ts`
Implement: Magic number write/verify logic

### Step 4: Implement Buffer Structure
Run test: `05-buffer-structure.test.ts`
Implement: Buffer allocation and header writing

### Step 5: Implement Basic Hashing
Run test: `06-exact-30-char-search.test.ts`
Implement: Basic BLAKE3 hashing, salt generation, index creation

### Step 6: Implement Search Logic
Run tests in order: `07`, `08`, `09`, `10`
Implement: Search algorithm with hash comparison

### Step 7: Implement Padding
Run tests: `11-padding-logic.test.ts`, `12-search-padding.test.ts`
Implement: Padding logic for both index creation and search

### Step 8: Verify Advanced Behavior
Run tests: `13`, `14`, `15`, `16`, `17`, `18`
Verify: All edge cases and advanced features work

## Phase 4: Final Verification

### Run All Tests
- Execute entire test suite
- All tests should pass
- Fix any failures

### Performance Tests (Optional)
Create separate performance test file:
- Test index creation time for various sizes
- Test search time for various query lengths
- Document results

## File Structure

```
services/node_general_backend/src/ai_blame/search/
├── spec.md                           # Algorithm specification
├── plan.md                           # This file
├── errors.ts                         # Custom error class
├── index.ts                          # Main implementation
└── __test__/
    ├── 01-error-class.test.ts
    ├── 02-create-index-validation.test.ts
    ├── 03-search-index-validation.test.ts
    ├── 04-magic-number.test.ts
    ├── 05-buffer-structure.test.ts
    ├── 06-exact-30-char-search.test.ts
    ├── 07-no-match.test.ts
    ├── 08-single-match-at-start.test.ts
    ├── 09-single-match-in-middle.test.ts
    ├── 10-multiple-matches.test.ts
    ├── 11-padding-logic.test.ts
    ├── 12-search-padding.test.ts
    ├── 13-different-hashes-same-text.test.ts
    ├── 14-consistent-search-results.test.ts
    ├── 15-search-longer-than-original.test.ts
    ├── 16-match-boundary-check.test.ts
    ├── 17-longer-search-multiple-chunks.test.ts
    └── 18-early-termination.test.ts
```

## Testing Framework
- Use existing test framework in the project (vitest)
- Each test file should be independent and focused
- Tests should be short, clear, and self-explanatory
- Use descriptive test names that explain what is being tested

## Implementation Notes
- Follow TypeScript best practices
- Use Buffer for binary data manipulation
- Use crypto.randomBytes(8) for salt generation
- Use hash-wasm package (https://www.npmjs.com/package/hash-wasm) for BLAKE3 hashing
  - Import: `import { blake3 } from 'hash-wasm'`
  - Usage: `await blake3(data, 128)` for 16-byte (128-bit) output
  - Note: hash-wasm returns hex strings, convert to Buffer as needed
- Implement early termination optimization in search
- Add clear comments for complex logic
- Follow existing code style in the project

## Dependencies
- **hash-wasm** (https://www.npmjs.com/package/hash-wasm) - For BLAKE3 hashing
  - Supports direct output length specification (128 bits = 16 bytes)
  - Fast WebAssembly-based implementation
  - Works in both Node.js and browsers
