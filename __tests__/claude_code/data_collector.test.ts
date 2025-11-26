import fs from 'node:fs/promises'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { processAndUploadHookData } from '../../src/features/claude_code/data_collector'

// Mock uploadAiBlameHandlerFromExtension
vi.mock('../../src/args/commands/upload_ai_blame', () => ({
  uploadAiBlameHandlerFromExtension: vi.fn(),
}))

describe('processAndUploadHookData', () => {
  let tmpDirs: tmp.DirectoryResult[] = []

  beforeEach(() => {
    vi.clearAllMocks()
    tmpDirs = []
    // Mock console methods to avoid noise in test output
    vi.spyOn(console, 'log').mockImplementation(() => {
      return
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {
      return
    })
  })

  afterEach(async () => {
    // Clean up all temp directories created during tests
    for (const tmpDir of tmpDirs) {
      await tmpDir.cleanup()
    }
  })

  it('should extract inference correctly for Edit tool', async () => {
    // Get the mock function
    const { uploadAiBlameHandlerFromExtension } = await vi.importMock(
      '../../src/args/commands/upload_ai_blame'
    )
    const mockUpload = vi.mocked(uploadAiBlameHandlerFromExtension as any)

    // Arrange - Create temp directory and copy assets for CI/CD compatibility
    const tmpDir = await tmp.dir({ unsafeCleanup: true })

    tmpDirs.push(tmpDir)

    // Copy transcript file to temp directory
    const transcriptFileName = 'dcc484f5-c9f4-4c34-b5c0-791b746026b4.jsonl'
    const srcTranscriptPath = path.join(__dirname, 'assets', transcriptFileName)
    const tmpTranscriptPath = path.join(tmpDir.path, transcriptFileName)
    await fs.copyFile(srcTranscriptPath, tmpTranscriptPath)

    // Read and modify edit test data to use temp transcript path
    const editDataRaw = await fs.readFile(
      path.join(__dirname, 'assets', '_edit.txt'),
      'utf-8'
    )
    const editData = editDataRaw.replace(
      /("transcript_path":\s*")[^"]*(")/,
      `$1${tmpTranscriptPath.replace(/\\/g, '\\\\')}$2`
    )

    // Mock stdin to provide the edit data
    const mockStdin = {
      setEncoding: vi.fn(),
      on: vi.fn((event: string, callback: (data?: string) => void) => {
        if (event === 'data') {
          callback(editData)
        } else if (event === 'end') {
          callback()
        }
      }),
    }

    vi.stubGlobal('process', {
      stdin: mockStdin,
    })

    mockUpload.mockResolvedValue(undefined)

    // Act
    const result = await processAndUploadHookData()

    // Assert
    expect(result.inference).toBe(
      '**Kirill** - [kirill89@gmail.com](mailto:kirill89@gmail.com) - [@kirill89](https://github.com/kirill89)'
    )

    const uploadArgs = mockUpload.mock.calls[0]?.[0]
    const userPrompts = uploadArgs.prompts.filter(
      (p: any) => p.type === 'USER_PROMPT'
    )
    const aiResponses = uploadArgs.prompts.filter(
      (p: any) => p.type === 'AI_RESPONSE'
    )

    expect(userPrompts.length).toBeGreaterThan(0)
    expect(aiResponses.length).toBeGreaterThan(0)
    expect(userPrompts[1].text).toBe('update author, add email')
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        inference:
          '**Kirill** - [kirill89@gmail.com](mailto:kirill89@gmail.com) - [@kirill89](https://github.com/kirill89)',
      })
    )
  })

  it('should extract inference correctly for Write tool', async () => {
    // Get the mock function
    const { uploadAiBlameHandlerFromExtension } = await vi.importMock(
      '../../src/args/commands/upload_ai_blame'
    )
    const mockUpload = vi.mocked(uploadAiBlameHandlerFromExtension as any)

    // Arrange - Create temp directory and copy assets for CI/CD compatibility
    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    // Copy transcript file to temp directory
    const transcriptFileName = '2e251410-b29f-4ff4-817a-7bc61c76d1fb.jsonl'
    const srcTranscriptPath = path.join(__dirname, 'assets', transcriptFileName)
    const tmpTranscriptPath = path.join(tmpDir.path, transcriptFileName)
    await fs.copyFile(srcTranscriptPath, tmpTranscriptPath)

    // Read and modify write test data to use temp transcript path
    const writeDataRaw = await fs.readFile(
      path.join(__dirname, 'assets', '_write.txt'),
      'utf-8'
    )
    const writeData = writeDataRaw.replace(
      /("transcript_path":\s*")[^"]*(")/,
      `$1${tmpTranscriptPath.replace(/\\/g, '\\\\')}$2`
    )

    // Mock stdin to provide the write data
    const mockStdin = {
      setEncoding: vi.fn(),
      on: vi.fn((event: string, callback: (data?: string) => void) => {
        if (event === 'data') {
          callback(writeData)
        } else if (event === 'end') {
          callback()
        }
      }),
    }
    vi.stubGlobal('process', {
      stdin: mockStdin,
    })

    mockUpload.mockResolvedValue(undefined)

    // Act
    await processAndUploadHookData()

    // Assert
    const uploadArgs = mockUpload.mock.calls[0]?.[0]

    expect(uploadArgs.prompts[10].text).toBe(
      'now create a new file with the license'
    )
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        inference: expect.stringContaining('THE SOFTWARE IS PROVIDED "AS IS"'),
      })
    )
  })
})
