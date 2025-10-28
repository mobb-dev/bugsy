# Salted Hash Search Algorithm Implementation (Per-Chunk Salt)

## Overview
Implement a search algorithm that allows searching for exact text matches in a pre-processed index without storing the original text. Uses BLAKE3 hashing with per-chunk random salt to prevent decryption attacks.

## Requirements
- Language: TypeScript
- Hashing: BLAKE3 (use `hash-wasm` npm package)
- Configurable window size (default: 30 characters, minimum: 8 characters)
- Minimum search text length: must match or exceed window size
- Uses sliding window approach with 1-character step
- Per-chunk random salting (8 bytes per chunk)
- Truncated hash output (16 bytes per chunk)
- Null byte padding to ensure text length is multiple of window size

## Algorithm Description

### Index Creation
1. Validate and set window size (default 30, minimum 8)
2. Pad the original text with null bytes (\0) to make length a multiple of windowSize
3. Slide a windowSize-character window through the padded text (step size: 1 character)
4. For each windowSize-character chunk at position i:
   - Generate a random 8-byte salt
   - Compute: `BLAKE3(salt || chunk)`
   - Truncate hash to first 16 bytes
   - Store: [salt (8 bytes)] [hash (16 bytes)]
5. Result: magic number + original length + window size + sequence of salt-hash pairs

### Searching
1. Read window size from index header
2. Pad the search text with null bytes (\0) to make length a multiple of windowSize
3. Extract original text length from index header
4. Slide a windowSize-character window through padded search text
5. For each possible starting position in the index:
   - For each chunk in the search pattern:
     - Read the salt from the index at that position
     - Compute: `BLAKE3(salt || search_chunk)` and truncate to 16 bytes
     - Compare with stored hash at that position
   - If all consecutive hashes match, record this starting position
   - Verify position + search length <= original text length
6. Return all matching positions

## Function Signatures

**createIndex function:**
- Signature: `async function createIndex(originalText: string, windowSize?: number): Promise<Buffer>`
- Takes:
  - originalText: string (minimum length must be >= windowSize)
  - windowSize: number (optional, default 30, minimum 8)
- Returns: Promise<Buffer> containing [magic_number (4 bytes)] [original_length (4 bytes)] [window_size (4 bytes)] [salt0 (8 bytes)] [hash0 (16 bytes)] [salt1 (8 bytes)] [hash1 (16 bytes)] ...
- Purpose: Creates a searchable index from original text
- Note: Async function due to hash-wasm BLAKE3 implementation

**searchIndex function:**
- Signature: `async function searchIndex(searchText: string, index: Buffer): Promise<number[]>`
- Takes:
  - searchText: string (minimum length must be >= window size stored in index)
  - index: Buffer
- Returns: Promise<number[]> - Array of numbers (positions where matches start, 0-indexed), empty array if not found
- Purpose: Searches for text in the index
- Notes:
  - Window size is read from the index, no need to pass it
  - Async function due to hash-wasm BLAKE3 implementation

## Buffer Format

The buffer structure starts with a magic number header, followed by metadata, then salt-hash pairs:

**Magic Number (4 bytes):**
- Bytes 0-3: `\x72\x83\x00\x01` (HS = Hash Search, 01 = version 1)

**Original Length (4 bytes):**
- Bytes 4-7: original text length (uint32, big-endian)

**Window Size (4 bytes):**
- Bytes 8-11: window size used for hashing (uint32, big-endian)

**Salt-hash pairs:**
- Bytes 12-19: salt for position 0
- Bytes 20-35: BLAKE3(salt0 || chars[0 to windowSize-1]) truncated to 16 bytes
- Bytes 36-43: salt for position 1
- Bytes 44-59: BLAKE3(salt1 || chars[1 to windowSize]) truncated to 16 bytes
- Bytes 60-67: salt for position 2
- Bytes 68-83: BLAKE3(salt2 || chars[2 to windowSize+1]) truncated to 16 bytes
- And so on...

Each position uses 24 bytes total (8 bytes salt + 16 bytes hash).

## Design Decisions

### Why padding to multiple of windowSize?

**The problem without padding:**
- Text with length not divisible by windowSize cannot create complete chunks at the end
- Example with windowSize=30: Text with 1005 characters cannot create a complete 30-char chunk starting at position 1005
- Positions near the end (976-1004) can start a 30-char chunk, but positions after cannot
- Last ~(windowSize-1) positions would be unsearchable

**Solution: Pad with null bytes (\0):**
- Example with windowSize=30: 1005 characters → pad to 1020 (add 15 null bytes)
- Now position 1005 can create chunk [1005-1034] (includes padding)
- Every position is searchable
- Padding characters never shown to user (original length stored in header)

**Search text padding:**
- Search text is also padded with null bytes to multiple of windowSize
- Ensures hashes match correctly when search spans into padded region
- Both index and search use same padding character for consistency

**Why null bytes (\0):**
- Unlikely to appear in normal text
- Clear boundary marker
- Standard padding character
- Can be easily filtered if needed

### Why per-chunk random salt?

**Security requirement:** Each chunk must have unique random salt to prevent decryption attacks.

**Attack scenario without unique salts:**
If chunks at positions 100 and 130 share the same salt:
1. Attacker finds match at position 100, knows chars [100-129]
2. Hash at position 130 covers chars [130-159]
3. Chars [130-159] overlap with known chars [100-129] by 0 characters... wait, let me recalculate
4. Actually, if position 100 chunk is [100-129] and position 130 chunk is [130-159], there's no overlap
5. But position 101 chunk is [101-130], which overlaps with [100-129] by 29 characters!
6. Attacker only needs to brute-force 1 character (char 130): only 256 attempts!

**With unique random salt per chunk:**
- Even with 29 characters known, must brute-force the unknown character PLUS the 8-byte salt
- 256 characters × 2^64 salt values = ~4.7 sextillion attempts per character
- Computationally infeasible

### Why 8-byte salt?

**Attack resistance with per-chunk salts:**
- To brute-force the next character, attacker must try all combinations of:
  - Unknown character: ~256 possibilities
  - Random salt: 2^64 = 18.4 quintillion possibilities
- Total: ~4.7 sextillion attempts per character

**Time to crack one character:**
- High-end GPU (10 billion hashes/sec): ~14,900 years
- 1000-GPU farm: ~15 years
- Million-GPU supercluster: ~5.4 days

**Why 8 bytes specifically:**
- 4 bytes: Crackable in hours with GPU farm (insufficient)
- 6 bytes: Crackable in weeks with large GPU farm (marginal)
- 8 bytes: Requires nation-state level resources and years (secure)
- More than 8 bytes: No practical security benefit

### Why truncate hash to 16 bytes?

**Collision resistance:**
- 16 bytes = 128 bits of entropy
- Collision probability: ~1 in 2^64 attempts (18 quintillion)
- For a 10MB document (~10 million chunks): ~0.00003% collision probability

**Practical security:**
- Even a 1GB document with 1 billion chunks: ~0.003% collision risk
- Essentially zero for any realistic use case

**Storage savings:**
- Full hash: 8 + 32 = 40 bytes per character
- Truncated: 8 + 16 = 24 bytes per character
- Savings: 40% reduction

**Why not truncate further:**
- 12 bytes (96 bits): Acceptable but lower safety margin
- 8 bytes (64 bits): Birthday paradox makes collisions likely in large documents
- 16 bytes: Sweet spot between security and efficiency

BLAKE3 is designed to be safely truncatable - using first 16 bytes maintains full cryptographic properties.

## Implementation Notes

### For createIndex():

1. Validate input (non-empty string, at least windowSize characters)
2. Validate window size (minimum 8, default 30)
3. Store original text length
4. Calculate padding needed: `paddingNeeded = (windowSize - (textLength % windowSize)) % windowSize`
5. Pad text with null bytes: `paddedText = originalText + '\0'.repeat(paddingNeeded)`
6. Calculate number of chunks: `numChunks = paddedText.length - windowSize + 1`
7. Allocate buffer: `12 + (numChunks * 24)` bytes
8. Write magic number to bytes 0-3: `\x72\x83\x00\x01`
9. Write original text length to bytes 4-7 (uint32, big-endian)
10. Write window size to bytes 8-11 (uint32, big-endian)
11. For position i from 0 to (paddedText.length - windowSize):
   - Generate cryptographically secure random 8-byte salt
   - Extract chunk: `paddedText.slice(i, i + windowSize)`
   - Compute: `BLAKE3(salt || chunk)`
   - Truncate hash to first 16 bytes
   - Write to buffer at position `12 + (i * 24)`:
     - Bytes 0-7: salt
     - Bytes 8-23: truncated hash
12. Return buffer

### For searchIndex():

1. Validate searchText (non-empty string)
2. Verify magic number (bytes 0-3) matches `\x72\x83\x00\x01`
3. Read window size from bytes 8-11 of index (uint32, big-endian)
4. Validate searchText length (minimum windowSize characters)
5. Read original text length from bytes 4-7 of index (uint32, big-endian)
6. Calculate padding needed for search: `paddingNeeded = (windowSize - (searchText.length % windowSize)) % windowSize`
7. Pad search text: `paddedSearch = searchText + '\0'.repeat(paddingNeeded)`
8. Calculate number of index positions: `numPositions = (index.length - 12) / 24`
9. Calculate search pattern length: `searchChunks = paddedSearch.length - windowSize + 1`
10. For each possible starting position `startPos` from 0 to (numPositions - searchChunks):
   - Check if search pattern matches at this position:
     - For each chunk j in paddedSearch (j = 0 to searchChunks - 1):
       - Extract search chunk: `paddedSearch.slice(j, j + windowSize)`
       - Read salt from index at byte position: `12 + ((startPos + j) * 24)`
       - Compute expected hash: `BLAKE3(salt || search_chunk)` truncated to 16 bytes
       - Read actual hash from index at byte position: `12 + ((startPos + j) * 24) + 8`
       - If hashes don't match, break and try next startPos (early termination)
     - If all hashes match consecutively:
       - Verify: `startPos + searchText.length <= originalTextLength`
       - If valid, add startPos to results
11. Return array of match positions

### Salt Generation
- Use cryptographically secure random number generator
- Generate 8 bytes (64 bits) per chunk
- In Node.js: use `crypto.randomBytes(8)`
- Each chunk must have unique random salt

### Hash Truncation
- Compute full BLAKE3 hash
- Take only the first 16 bytes
- BLAKE3 supports direct 16-byte output in some implementations - use if available for performance
- Discard remaining bytes

### Edge Cases to Handle
- Original text shorter than windowSize characters (throw error)
- Search text shorter than windowSize characters (throw error)
- Window size smaller than minimum (8) (throw error)
- Empty strings (throw error)
- Search text longer than original text (return empty array)
- Multiple matches (return all positions)
- No matches (return empty array)
- Invalid index buffer (length < 12 or (length - 12) not multiple of 24 - throw error)
- Invalid magic number in index buffer (throw error)
- Matches extending beyond original text length (filter out)

## Usage Example

Creating an index:

    const originalText = "The quick brown fox jumps over the lazy dog. The quick brown fox is fast.";
    const index = await createIndex(originalText);
    // Save index to file/database, discard originalText

Creating an index with custom window size:

    const originalText = "Short text with small window";
    const index = await createIndex(originalText, 10); // 10-character window
    // Allows smaller search patterns (minimum 10 chars instead of 30)

Searching later:

    const searchText = "The quick brown fox jumps over";
    const positions = await searchIndex(searchText, index);
    console.log(positions); // [0] - found at position 0

    const searchText2 = "The quick brown fox is fast.!!"; // 31 chars
    const positions2 = await searchIndex(searchText2, index);
    console.log(positions2); // [45] - found at position 45

## Dependencies

Install these npm packages:
- **hash-wasm** - For BLAKE3 hashing with direct output length specification
  - Fast WebAssembly-based implementation
  - Usage: `await blake3(data, 128)` for 16-byte (128-bit) output
  - Returns hex string, convert to Buffer
- **crypto** (built-in) - For cryptographically secure random salt generation
  - Usage: `randomBytes(8)` for 8-byte salts
- @types/node version 20.0.0 or higher (dev)
- typescript version 5.0.0 or higher (dev)

## Performance Analysis

### Index Creation Performance

**Time complexity:** O(n) where n is text length
- One pass through text generating hashes
- BLAKE3 speed: ~1-2 GB/s on modern CPU

**Concrete example (1MB text file):**
- Text size: 1,000,000 characters
- Chunks to hash: ~1,000,000
- At 50 million hashes/sec: ~0.02 seconds (20 milliseconds)

**Storage:**
- Header: 12 bytes (4-byte magic number + 4-byte original length + 4-byte window size)
- Per character: 24 bytes (8-byte salt + 16-byte hash)
- 1MB text → ~24MB index
- 10MB text → ~240MB index

### Search Performance

**Time complexity:** O(n × m) where:
- n = number of positions in index (≈ original text length)
- m = number of chunks in search query (≈ search text length)

**Worst case:** Must check every position in index
- For each position: compute m hashes and compare

**Best case with early termination:**
- First hash mismatch → skip to next position
- In practice, most positions fail on first hash

**Concrete examples:**

**Example 1: Search 100 chars in 1MB document**
- Index positions: 1,000,000
- Search chunks: ~100
- Worst case hashes: 1,000,000 × 100 = 100 million
- At 50M hashes/sec: ~2 seconds
- With early termination (90% fail on first hash): ~0.2 seconds

**Example 2: Search 1000 chars in 1MB document**
- Index positions: 1,000,000
- Search chunks: ~1,000
- Worst case hashes: 1 billion
- At 50M hashes/sec: ~20 seconds
- With early termination: ~2 seconds

**Example 3: Search 100 chars in 10MB document**
- Index positions: 10,000,000
- Search chunks: ~100
- Worst case hashes: 1 billion
- At 50M hashes/sec: ~20 seconds
- With early termination: ~2 seconds

**Example 4: Multiple searches**
- 1000 searches of 100 chars each in 1MB document
- With early termination: ~200 seconds (~3.3 minutes)

### Performance Optimization Opportunities

1. **Early termination:** Stop checking position on first hash mismatch (typically 90%+ positions)
2. **Parallel search:** Check multiple starting positions simultaneously across CPU cores
3. **SIMD acceleration:** Use vectorized hash comparison
4. **GPU acceleration:** Offload hash computation to GPU for large searches
5. **Index sampling:** For very long searches, check every Nth position first to find candidates

### Memory Usage

**Index in memory:**
- 1MB text: ~24MB index
- 10MB text: ~240MB index
- Fits easily in modern system RAM

**Search memory:**
- Generate m hashes for search pattern: m × 16 bytes
- 100-char search: ~1.6 KB
- 1000-char search: ~16 KB
- Negligible memory footprint

## Security Considerations
- Each chunk has unique random 8-byte salt providing maximum practical security
- Prevents frequency analysis: same text at different positions produces different hashes
- Prevents decryption attacks: brute-forcing next character requires nation-state level resources
- 8-byte salt provides 2^64 (18.4 quintillion) possible values per chunk
- 16-byte truncated hash provides 2^128 collision resistance (essentially zero collision probability)
- Hash collisions are theoretically possible but astronomically unlikely
- Original text cannot be recovered from the index with any realistic computational resources
- Padding with null bytes does not compromise security

## Attack Resistance

**Decryption attack scenario:**
Attacker finds match at position 100 (knows chars 100-129):
1. Wants to discover character at position 130
2. Hash at position 101 covers chars [101-130]
3. Attacker knows chars [101-129] (29 characters)
4. To brute-force position 101's hash:
   - Must try all values for char 130: 256 possibilities
   - Must try all salt values: 2^64 possibilities
   - Total: 256 × 2^64 = ~4.7 sextillion attempts

**Time to crack:**
- Single GPU: ~14,900 years per character
- 1000-GPU farm: ~15 years per character
- For 1000-char document: millions of years even with massive resources

**Why per-chunk salt is critical:**
- Without unique salts, adjacent positions could share salts
- Attacker could brute-force just the unknown character (256 attempts)
- With unique salts, must also brute-force the salt (adds 2^64 factor)
- This makes the attack computationally infeasible

## Why Per-Chunk Random Salt?
- **Prevents decryption**: Cannot brute-force adjacent characters even with known partial text
- **Prevents frequency analysis**: Same text produces different hashes at different positions
- **Maximum security**: Each chunk independently secured with 8-byte random salt
- **No shared secrets**: Each salt is unique and stored with its hash
- **Future-proof**: Secure against advances in computing power

## Testing Requirements
1. Test with exact windowSize-character search (default 30)
2. Test with longer search text (multiple chunks)
3. Test with multiple matches in original text
4. Test with repeated patterns (verify different hashes for same text at different positions)
5. Test with no matches
6. Test edge cases (empty strings, too short strings)
7. Verify same search text at same position returns consistent results
8. Verify same text at different positions produces different hashes
9. Verify buffer length is correct: 12 + (numChunks × 24) bytes
10. Verify magic number is correctly written and validated
11. Verify window size is correctly written and read
12. Test padding logic (texts with length % windowSize != 0)
13. Verify search text padding works correctly
14. Test that matches extending beyond original text length are filtered out
15. Test custom window sizes (8, 10, 15, 20, 30)
16. Performance test: measure index creation time for various document sizes
17. Performance test: measure search time for various query lengths
18. Verify early termination optimization works correctly
