import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { parseArgs } from '@mobb/bugsy/args/yargs'
import { mobbCliCommand } from '@mobb/bugsy/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock uploadFile to avoid real network
vi.mock('@mobb/bugsy/features/analysis/upload-file', () => ({
  uploadFile: vi.fn(async () => undefined),
}))

// Mock Configstore
vi.mock('configstore', () => ({
  default: vi.fn().mockImplementation(() => ({
    get: vi.fn(() => 'test-api-token'),
    set: vi.fn(),
  })),
}))

// Create a mock GQL client
const createMockGQLClient = () => ({
  uploadAIBlameInferencesInitRaw: vi.fn(async ({ sessions }: any) => ({
    uploadAIBlameInferencesInit: {
      uploadSessions: sessions.map((s: any, idx: number) => ({
        aiBlameInferenceId: `session-${idx}`,
        prompt: {
          url: 'https://s3.example/prompt',
          uploadFieldsJSON: JSON.stringify({ key: 'v' }),
          uploadKey: `ai-blame/user/session-${idx}/prompt/${s.promptFileName}`,
          fileName: s.promptFileName,
          artifactId: `art-${idx}-p`,
        },
        inference: {
          url: 'https://s3.example/inference',
          uploadFieldsJSON: JSON.stringify({ key: 'v' }),
          uploadKey: `ai-blame/user/session-${idx}/inference/${s.inferenceFileName}`,
          fileName: s.inferenceFileName,
          artifactId: `art-${idx}-i`,
        },
      })),
    },
  })),
  finalizeAIBlameInferencesUploadRaw: vi.fn(async () => ({
    finalizeAIBlameInferencesUpload: { status: 'OK', error: null },
  })),
  verifyApiConnection: vi.fn(async () => true),
  validateUserToken: vi.fn(async () => 'test-user'),
})

// Mock GQLClient
vi.mock('@mobb/bugsy/features/analysis/graphql', () => ({
  GQLClient: vi.fn().mockImplementation(() => createMockGQLClient()),
}))

// Mock handleMobbLogin
vi.mock('@mobb/bugsy/commands/handleMobbLogin', () => ({
  handleMobbLogin: vi.fn(async ({ inGqlClient }) => inGqlClient),
  getAuthenticatedGQLClient: vi.fn(async () => createMockGQLClient()),
}))

// Mock the GQL client factory to return a fake client with raw methods
vi.mock('@mobb/bugsy/mcp/services/McpGQLClient', async () => {
  const actual = await vi.importActual<any>(
    '@mobb/bugsy/mcp/services/McpGQLClient'
  )
  return {
    ...actual,
    createAuthenticatedMcpGQLClient: vi.fn(async () => createMockGQLClient()),
  }
})

async function runCommand(args: string[]) {
  return parseArgs(args)
}

describe('CLI: upload-ai-blame', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-blame-'))
    vi.clearAllMocks()
  })

  it('uploads a single session and finalizes successfully', async () => {
    const promptPath = path.join(tmpDir, 'prompt.json')
    const inferencePath = path.join(tmpDir, 'inference.json')
    await fs.writeFile(promptPath, '{"p":1}')
    await fs.writeFile(inferencePath, '{"i":2}')

    const iso = '2025-02-14T10:30:00Z'
    const args = [
      mobbCliCommand.uploadAiBlame,
      '--prompt',
      promptPath,
      '--inference',
      inferencePath,
      '--ai-response-at',
      iso,
      '--model',
      'gpt-4o',
      '--tool-name',
      'Cursor',
    ]

    const uploadMod = await import('@mobb/bugsy/features/analysis/upload-file')
    const uploadSpy = vi.spyOn(uploadMod, 'uploadFile')

    await runCommand(args)

    // Two uploads: prompt + inference
    expect(uploadSpy).toHaveBeenCalledTimes(2)
    const first = uploadSpy.mock.calls[0]?.[0]
    const second = uploadSpy.mock.calls[1]?.[0]
    expect(first?.url).toContain('https://s3.example/prompt')
    expect(second?.url).toContain('https://s3.example/inference')
  })

  describe('uploadAiBlameHandler', () => {
    it('should authenticate a client and upload files successfully', async () => {
      const { uploadAiBlameHandler } = await import(
        '@mobb/bugsy/args/commands/upload_ai_blame'
      )
      const { getAuthenticatedGQLClient } = await import(
        '@mobb/bugsy/commands/handleMobbLogin'
      )
      const uploadMod = await import(
        '@mobb/bugsy/features/analysis/upload-file'
      )
      const uploadSpy = vi.spyOn(uploadMod, 'uploadFile')

      const promptPath = path.join(tmpDir, 'prompt-no-auth.json')
      const inferencePath = path.join(tmpDir, 'inference-no-auth.json')
      await fs.writeFile(promptPath, '{"p":1}')
      await fs.writeFile(inferencePath, '{"i":2}')

      // Reset mock to track calls
      vi.clearAllMocks()

      await uploadAiBlameHandler({
        prompt: [promptPath],
        inference: [inferencePath],
      })

      // Should call handleMobbLogin to authenticate
      expect(getAuthenticatedGQLClient).toHaveBeenCalledWith({
        isSkipPrompts: true,
      })
      // Should upload files
      expect(uploadSpy).toHaveBeenCalledTimes(2)
    })

    it('should not exit on error when exitOnError is false', async () => {
      const { uploadAiBlameHandler } = await import(
        '@mobb/bugsy/args/commands/upload_ai_blame'
      )
      const { getAuthenticatedGQLClient } = await import(
        '@mobb/bugsy/commands/handleMobbLogin'
      )

      const promptPath = path.join(tmpDir, 'prompt-error.json')
      const inferencePath = path.join(tmpDir, 'inference-error.json')
      await fs.writeFile(promptPath, '{"p":1}')
      await fs.writeFile(inferencePath, '{"i":2}')

      // Create a mock client that fails on init
      const mockClient = createMockGQLClient()
      mockClient.uploadAIBlameInferencesInitRaw = vi.fn(async () => ({
        uploadAIBlameInferencesInit: {
          uploadSessions: [], // Empty array to trigger error
        },
      }))

      // Mock to return our failing client
      vi.mocked(getAuthenticatedGQLClient).mockResolvedValueOnce(
        mockClient as any
      )

      // Should throw error instead of exiting
      await expect(
        uploadAiBlameHandler(
          {
            prompt: [promptPath],
            inference: [inferencePath],
          },
          false
        )
      ).rejects.toThrow('Init failed to return expected number of sessions')
    })
  })
})
