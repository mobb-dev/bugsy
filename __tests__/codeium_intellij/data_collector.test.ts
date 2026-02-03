import { beforeEach, describe, expect, it, vi } from 'vitest'

import { uploadAiBlameHandlerFromExtension } from '../../src/args/commands/upload_ai_blame'
import { readStdinData } from '../../src/features/claude_code/data_collector'
import { getGrpcClient } from '../../src/features/codeium_intellij/codeium_language_server_grpc_client'
import { processAndUploadHookData } from '../../src/features/codeium_intellij/data_collector'
import { findRunningCodeiumLanguageServers } from '../../src/features/codeium_intellij/parse_intellij_logs'

vi.mock('../../src/features/claude_code/data_collector', () => ({
  readStdinData: vi.fn(),
}))

vi.mock('../../src/features/codeium_intellij/parse_intellij_logs', () => ({
  findRunningCodeiumLanguageServers: vi.fn(),
}))

vi.mock(
  '../../src/features/codeium_intellij/codeium_language_server_grpc_client',
  () => ({
    getGrpcClient: vi.fn(),
  })
)

vi.mock('../../src/args/commands/upload_ai_blame', () => ({
  uploadAiBlameHandlerFromExtension: vi.fn(),
}))

const mockReadStdinData = vi.mocked(readStdinData)
const mockUpload = vi.mocked(uploadAiBlameHandlerFromExtension)
const mockFindServers = vi.mocked(findRunningCodeiumLanguageServers)
const mockGetGrpcClient = vi.mocked(getGrpcClient)

describe('processAndUploadHookData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {
      return
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {
      return
    })
  })

  it('should process hook data and upload trace', async () => {
    const trajectoryId = 'test-trajectory-id'

    mockReadStdinData.mockResolvedValue({ trajectory_id: trajectoryId })

    mockFindServers.mockReturnValue([
      { port: 1234, csrf: 'csrf-token', ide: 'intellij' },
    ])

    mockGetGrpcClient.mockResolvedValue({
      GetAllCascadeTrajectories: vi.fn().mockResolvedValue({
        trajectorySummaries: {
          'cascade-1': { trajectoryId },
        },
      }),
      GetCascadeTrajectory: vi.fn().mockResolvedValue({
        trajectory: {
          steps: [
            {
              type: 'CORTEX_STEP_TYPE_USER_INPUT',
              userInput: { query: 'test query' },
            },
            {
              type: 'CORTEX_STEP_TYPE_CODE_ACTION',
              metadata: { toolCall: { name: 'write_file' } },
              codeAction: {
                actionResult: {
                  edit: {
                    diff: {
                      unifiedDiff: {
                        lines: [
                          {
                            type: 'UNIFIED_DIFF_LINE_TYPE_INSERT',
                            text: 'new code',
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
          generatorMetadata: [{ chatModel: { modelUid: 'gpt-4' } }],
        },
      }),
    } as never)

    mockUpload.mockResolvedValue({
      promptsCounts: { detections: { total: 0, high: 0, medium: 0, low: 0 } },
      inferenceCounts: { detections: { total: 0, high: 0, medium: 0, low: 0 } },
    })

    await processAndUploadHookData()

    expect(mockUpload).toHaveBeenCalledTimes(1)
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4',
        tool: 'Windsurf Intellij',
        sessionId: 'cascade-1',
      })
    )
  })
})
