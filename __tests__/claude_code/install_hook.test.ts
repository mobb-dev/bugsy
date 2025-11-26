import fsPromises from 'node:fs/promises'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { installMobbHooks } from '../../src/features/claude_code/install_hook'

// Mock node:fs/promises
vi.mock('node:fs/promises', () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}))

const mockFs = vi.mocked(fsPromises)

describe('installMobbHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.log to avoid noise in test output
    vi.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })

  it('should successfully install Mobb hooks when settings file exists and no hooks exist with --save-env', async () => {
    // Arrange
    const initialSettings = {
      someOtherSetting: 'value',
    }

    vi.stubGlobal('process', {
      env: {
        WEB_LOGIN_URL: 1,
        WEB_APP_URL: 2,
        API_URL: 3,
      },
    })

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialSettings))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installMobbHooks({ saveEnv: true })

    // Assert
    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenSettings = JSON.parse(writtenContent as string)
    const cmd = writtenSettings.hooks.PostToolUse[0].hooks[0].command

    expect(cmd).toContain('WEB_LOGIN_URL="1"')
    expect(cmd).toContain('WEB_APP_URL="2"')
    expect(cmd).toContain('API_URL="3"')
  })

  it('should successfully install Mobb hooks when settings file exists and no hooks exist', async () => {
    // Arrange
    const initialSettings = {
      someOtherSetting: 'value',
    }

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialSettings))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installMobbHooks()

    // Assert
    expect(mockFs.access).toHaveBeenCalledTimes(1)
    expect(mockFs.readFile).toHaveBeenCalledTimes(1)
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    // Verify the settings structure written to file
    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenSettings = JSON.parse(writtenContent as string)
    expect(writtenSettings).toEqual({
      someOtherSetting: 'value',
      hooks: {
        PostToolUse: [
          {
            matcher: 'Edit|Write',
            hooks: [
              {
                type: 'command',
                command: 'npx --yes mobbdev@latest claude-code-process-hook',
              },
            ],
          },
        ],
      },
    })
  })

  it('should successfully update existing Mobb hooks when they already exist', async () => {
    // Arrange
    const initialSettings = {
      hooks: {
        PostToolUse: [
          {
            matcher: 'Edit|Write',
            hooks: [
              {
                type: 'command',
                command: 'npx --yes mobbdev@latest claude-code-process-hook',
              },
            ],
          },
          {
            matcher: 'SomeOtherTool',
            hooks: [
              {
                type: 'command',
                command: 'some-other-command',
              },
            ],
          },
        ],
      },
    }

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialSettings))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installMobbHooks()

    // Assert
    expect(mockFs.access).toHaveBeenCalledTimes(1)
    expect(mockFs.readFile).toHaveBeenCalledTimes(1)
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    // Verify the Mobb hook was updated and other hooks preserved
    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenSettings = JSON.parse(writtenContent as string)
    expect(writtenSettings.hooks.PostToolUse).toHaveLength(2)
    expect(writtenSettings.hooks.PostToolUse[0]).toEqual({
      matcher: 'Edit|Write',
      hooks: [
        {
          type: 'command',
          command: 'npx --yes mobbdev@latest claude-code-process-hook',
        },
      ],
    })
    // Verify other hook is preserved
    expect(writtenSettings.hooks.PostToolUse[1]).toEqual({
      matcher: 'SomeOtherTool',
      hooks: [
        {
          type: 'command',
          command: 'some-other-command',
        },
      ],
    })
  })

  it('should add Mobb hooks to existing PostToolUse hooks when other hooks exist', async () => {
    // Arrange
    const initialSettings = {
      hooks: {
        PostToolUse: [
          {
            matcher: 'SomeOtherTool',
            hooks: [
              {
                type: 'command',
                command: 'some-other-command',
              },
            ],
          },
        ],
      },
    }

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialSettings))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installMobbHooks()

    // Assert
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenSettings = JSON.parse(writtenContent as string)
    expect(writtenSettings.hooks.PostToolUse).toHaveLength(2)

    // Verify existing hook is preserved
    expect(writtenSettings.hooks.PostToolUse[0]).toEqual({
      matcher: 'SomeOtherTool',
      hooks: [
        {
          type: 'command',
          command: 'some-other-command',
        },
      ],
    })

    // Verify Mobb hook was added
    expect(writtenSettings.hooks.PostToolUse[1]).toEqual({
      matcher: 'Edit|Write',
      hooks: [
        {
          type: 'command',
          command: 'npx --yes mobbdev@latest claude-code-process-hook',
        },
      ],
    })
  })
})
