import fsPromises from 'node:fs/promises'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { installWindsurfHooks } from '../../src/features/codeium_intellij/install_hook'

// Mock node:fs/promises
vi.mock('node:fs/promises', () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
}))

const mockFs = vi.mocked(fsPromises)

describe('installWindsurfHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.log to avoid noise in test output
    vi.spyOn(console, 'log').mockImplementation(() => {
      return
    })
    // Default mkdir to success
    mockFs.mkdir.mockResolvedValue(undefined)
  })

  it('should successfully install Mobb hooks when hooks file exists and no hooks exist with --save-env', async () => {
    // Arrange
    const initialConfig = {
      someOtherSetting: 'value',
    }

    vi.stubGlobal('process', {
      env: {
        WEB_APP_URL: 2,
        API_URL: 3,
      },
    })

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialConfig))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installWindsurfHooks({ saveEnv: true })

    // Assert
    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenConfig = JSON.parse(writtenContent as string)
    const cmd = writtenConfig.hooks.post_write_code[0].command

    expect(cmd).toContain('WEB_APP_URL="2"')
    expect(cmd).toContain('API_URL="3"')
  })

  it('should successfully install Mobb hooks when hooks file exists and no hooks exist', async () => {
    // Arrange
    const initialConfig = {
      someOtherSetting: 'value',
    }

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialConfig))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installWindsurfHooks()

    // Assert
    expect(mockFs.readFile).toHaveBeenCalledTimes(1)
    expect(mockFs.mkdir).toHaveBeenCalledTimes(1)
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    // Verify the config structure written to file
    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenConfig = JSON.parse(writtenContent as string)
    expect(writtenConfig).toEqual({
      someOtherSetting: 'value',
      hooks: {
        post_write_code: [
          {
            command: 'npx --yes mobbdev@latest windsurf-intellij-process-hook',
            show_output: true,
          },
        ],
      },
    })
  })

  it('should successfully update existing Mobb hooks when they already exist', async () => {
    // Arrange
    const initialConfig = {
      hooks: {
        post_write_code: [
          {
            command: 'npx --yes mobbdev@latest windsurf-intellij-process-hook',
            show_output: true,
          },
          {
            command: 'some-other-command',
            show_output: false,
          },
        ],
      },
    }

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialConfig))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installWindsurfHooks()

    // Assert
    expect(mockFs.readFile).toHaveBeenCalledTimes(1)
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    // Verify the Mobb hook was updated and other hooks preserved
    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenConfig = JSON.parse(writtenContent as string)
    expect(writtenConfig.hooks.post_write_code).toHaveLength(2)
    expect(writtenConfig.hooks.post_write_code[0]).toEqual({
      command: 'npx --yes mobbdev@latest windsurf-intellij-process-hook',
      show_output: true,
    })
    // Verify other hook is preserved
    expect(writtenConfig.hooks.post_write_code[1]).toEqual({
      command: 'some-other-command',
      show_output: false,
    })
  })

  it('should add Mobb hooks to existing post_write_code hooks when other hooks exist', async () => {
    // Arrange
    const initialConfig = {
      hooks: {
        post_write_code: [
          {
            command: 'some-other-command',
            show_output: false,
          },
        ],
      },
    }

    mockFs.access.mockResolvedValue(undefined) // File exists
    mockFs.readFile.mockResolvedValue(JSON.stringify(initialConfig))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installWindsurfHooks()

    // Assert
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenConfig = JSON.parse(writtenContent as string)
    expect(writtenConfig.hooks.post_write_code).toHaveLength(2)

    // Verify existing hook is preserved
    expect(writtenConfig.hooks.post_write_code[0]).toEqual({
      command: 'some-other-command',
      show_output: false,
    })

    // Verify Mobb hook was added
    expect(writtenConfig.hooks.post_write_code[1]).toEqual({
      command: 'npx --yes mobbdev@latest windsurf-intellij-process-hook',
      show_output: true,
    })
  })

  it('should create hooks file when it does not exist', async () => {
    // Arrange
    mockFs.access.mockRejectedValue(new Error('File not found')) // File doesn't exist
    mockFs.readFile.mockRejectedValue(new Error('File not found'))
    mockFs.writeFile.mockResolvedValue(undefined)

    // Act
    await installWindsurfHooks()

    // Assert
    expect(mockFs.mkdir).toHaveBeenCalledTimes(1)
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)

    const writtenContent = mockFs.writeFile.mock.calls[0]![1]
    const writtenConfig = JSON.parse(writtenContent as string)
    expect(writtenConfig).toEqual({
      hooks: {
        post_write_code: [
          {
            command: 'npx --yes mobbdev@latest windsurf-intellij-process-hook',
            show_output: true,
          },
        ],
      },
    })
  })
})
