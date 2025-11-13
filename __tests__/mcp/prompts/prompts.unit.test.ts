import { PromptRegistry } from '@mobb/bugsy/mcp/core/PromptRegistry'
import { BasePrompt } from '@mobb/bugsy/mcp/prompts/base/BasePrompt'
import { CheckForNewVulnerabilitiesPrompt } from '@mobb/bugsy/mcp/prompts/CheckForNewVulnerabilitiesPrompt'
import { FullSecurityAuditPrompt } from '@mobb/bugsy/mcp/prompts/FullSecurityAuditPrompt'
import { ReviewAndFixCriticalPrompt } from '@mobb/bugsy/mcp/prompts/ReviewAndFixCriticalPrompt'
import { ScanRecentChangesPrompt } from '@mobb/bugsy/mcp/prompts/ScanRecentChangesPrompt'
import { ScanRepositoryPrompt } from '@mobb/bugsy/mcp/prompts/ScanRepositoryPrompt'
import { SecurityToolsOverviewPrompt } from '@mobb/bugsy/mcp/prompts/SecurityToolsOverviewPrompt'
import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

// Mock Logger
vi.mock('@mobb/bugsy/mcp/Logger', () => ({
  logDebug: vi.fn(),
  logInfo: vi.fn(),
  logError: vi.fn(),
  logWarn: vi.fn(),
  log: vi.fn(),
}))

// Test Prompt Implementation
class TestPrompt extends BasePrompt {
  public readonly name = 'test-prompt'
  public readonly description = 'Test prompt for unit testing'
  public readonly arguments = [
    { name: 'testArg', description: 'Test argument', required: true },
  ]
  protected readonly argumentsValidationSchema = z.object({
    testArg: z.string(),
  })

  protected async generatePrompt(args?: unknown): Promise<GetPromptResult> {
    const validatedArgs = args as { testArg?: string } | undefined
    return this.createUserMessage(
      `Test prompt with arg: ${validatedArgs?.testArg || 'none'}`
    )
  }
}

// Test Prompt without arguments
class NoArgsPrompt extends BasePrompt {
  public readonly name = 'no-args-prompt'
  public readonly description = 'Prompt with no arguments'
  public readonly arguments = undefined
  protected readonly argumentsValidationSchema = undefined

  protected async generatePrompt(): Promise<GetPromptResult> {
    return this.createUserMessage('Prompt without arguments')
  }
}

describe('PromptRegistry', () => {
  let registry: PromptRegistry

  beforeEach(() => {
    registry = new PromptRegistry()
  })

  it('should register a prompt successfully', () => {
    const prompt = new TestPrompt()
    registry.registerPrompt(prompt)

    expect(registry.hasPrompt('test-prompt')).toBe(true)
  })

  it('should retrieve a registered prompt by name', () => {
    const prompt = new TestPrompt()
    registry.registerPrompt(prompt)

    const retrieved = registry.getPrompt('test-prompt')
    expect(retrieved).toBeDefined()
    expect(retrieved?.name).toBe('test-prompt')
  })

  it('should return undefined for non-existent prompt', () => {
    const retrieved = registry.getPrompt('non-existent')
    expect(retrieved).toBeUndefined()
  })

  it('should warn when registering duplicate prompt', async () => {
    const { logWarn } = await import('@mobb/bugsy/mcp/Logger')
    const prompt1 = new TestPrompt()
    const prompt2 = new TestPrompt()

    registry.registerPrompt(prompt1)
    registry.registerPrompt(prompt2)

    expect(logWarn).toHaveBeenCalledWith(
      expect.stringContaining('already registered'),
      expect.objectContaining({ promptName: 'test-prompt' })
    )
  })

  it('should return all prompt definitions via getAllPrompts()', () => {
    const prompt1 = new TestPrompt()
    const prompt2 = new NoArgsPrompt()

    registry.registerPrompt(prompt1)
    registry.registerPrompt(prompt2)

    const allPrompts = registry.getAllPrompts()
    expect(allPrompts).toHaveLength(2)
    expect(allPrompts[0]).toHaveProperty('name')
    expect(allPrompts[0]).toHaveProperty('description')
  })

  it('should return all prompt names via getPromptNames()', () => {
    const prompt1 = new TestPrompt()
    const prompt2 = new NoArgsPrompt()

    registry.registerPrompt(prompt1)
    registry.registerPrompt(prompt2)

    const names = registry.getPromptNames()
    expect(names).toHaveLength(2)
    expect(names).toContain('test-prompt')
    expect(names).toContain('no-args-prompt')
  })

  it('should correctly check prompt existence with hasPrompt()', () => {
    const prompt = new TestPrompt()

    expect(registry.hasPrompt('test-prompt')).toBe(false)

    registry.registerPrompt(prompt)

    expect(registry.hasPrompt('test-prompt')).toBe(true)
    expect(registry.hasPrompt('non-existent')).toBe(false)
  })

  it('should return correct prompt count', () => {
    expect(registry.getPromptCount()).toBe(0)

    registry.registerPrompt(new TestPrompt())
    expect(registry.getPromptCount()).toBe(1)

    registry.registerPrompt(new NoArgsPrompt())
    expect(registry.getPromptCount()).toBe(2)
  })

  it('should handle multiple prompts registration', () => {
    const prompts = [
      new TestPrompt(),
      new NoArgsPrompt(),
      new SecurityToolsOverviewPrompt(),
    ]

    prompts.forEach((prompt) => registry.registerPrompt(prompt))

    expect(registry.getPromptCount()).toBe(3)
    expect(registry.hasPrompt('test-prompt')).toBe(true)
    expect(registry.hasPrompt('no-args-prompt')).toBe(true)
    expect(registry.hasPrompt('security-tools-overview')).toBe(true)
  })

  it('should maintain prompt isolation', () => {
    const registry1 = new PromptRegistry()
    const registry2 = new PromptRegistry()

    registry1.registerPrompt(new TestPrompt())

    expect(registry1.hasPrompt('test-prompt')).toBe(true)
    expect(registry2.hasPrompt('test-prompt')).toBe(false)
  })

  it('should get prompt definition by name', () => {
    const prompt = new TestPrompt()
    registry.registerPrompt(prompt)

    const definition = registry.getPromptDefinition('test-prompt')

    expect(definition).toBeDefined()
    expect(definition?.name).toBe('test-prompt')
    expect(definition?.description).toBe('Test prompt for unit testing')
    expect(definition?.arguments).toBeDefined()
  })
})

describe('BasePrompt', () => {
  it('should validate arguments using Zod schema', async () => {
    const prompt = new TestPrompt()
    const validArgs = { testArg: 'valid-value' }

    const result = await prompt.getPrompt(validArgs)

    expect(result).toBeDefined()
    expect(result.messages).toBeDefined()
  })

  it('should throw error for invalid arguments', async () => {
    const prompt = new TestPrompt()
    const invalidArgs = { testArg: 123 } // Wrong type

    await expect(prompt.getPrompt(invalidArgs)).rejects.toThrow()
  })

  it('should handle missing required arguments', async () => {
    const prompt = new TestPrompt()
    const emptyArgs = {}

    await expect(prompt.getPrompt(emptyArgs)).rejects.toThrow(
      /Missing required argument/
    )
  })

  it('should pass validation for valid arguments', async () => {
    const prompt = new TestPrompt()
    const validArgs = { testArg: 'test-value' }

    const result = await prompt.getPrompt(validArgs)

    expect(result.messages[0]?.content.text).toContain('test-value')
  })

  it('should call generatePrompt with validated arguments', async () => {
    const prompt = new TestPrompt()
    const args = { testArg: 'hello' }

    const result = await prompt.getPrompt(args)

    expect(result.messages[0]?.content.text).toContain('hello')
  })

  it('should handle prompts with no arguments', async () => {
    const prompt = new NoArgsPrompt()

    const result = await prompt.getPrompt()

    expect(result).toBeDefined()
    expect(result.messages).toHaveLength(1)
  })

  it('should return proper GetPromptResult structure', async () => {
    const prompt = new TestPrompt()
    const args = { testArg: 'test' }

    const result = await prompt.getPrompt(args)

    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('messages')
    expect(result.messages).toHaveLength(1)
    expect(result.messages[0]).toHaveProperty('role', 'user')
    expect(result.messages[0]).toHaveProperty('content')
    expect(result.messages[0]?.content).toHaveProperty('type', 'text')
    expect(result.messages[0]?.content).toHaveProperty('text')
  })

  it('should create user message with correct format', async () => {
    const prompt = new TestPrompt()
    const args = { testArg: 'test' }

    const result = await prompt.getPrompt(args)

    expect(result.description).toBe('Test prompt for unit testing')
    expect(result.messages[0]?.role).toBe('user')
    expect(result.messages[0]?.content.type).toBe('text')
    expect(typeof result.messages[0]?.content.text).toBe('string')
  })

  it('should handle Zod validation errors properly', async () => {
    const prompt = new TestPrompt()
    const invalidArgs = { wrongArg: 'value' }

    await expect(prompt.getPrompt(invalidArgs)).rejects.toThrow(
      /Invalid arguments/
    )
  })

  it('should log debug messages on success', async () => {
    const { logDebug } = await import('@mobb/bugsy/mcp/Logger')
    const prompt = new TestPrompt()
    const args = { testArg: 'test' }

    await prompt.getPrompt(args)

    expect(logDebug).toHaveBeenCalledWith(
      expect.stringContaining('validation successful'),
      expect.any(Object)
    )
    expect(logDebug).toHaveBeenCalledWith(
      expect.stringContaining('generated successfully')
    )
  })

  it('should return getDefinition with correct structure', () => {
    const prompt = new TestPrompt()

    const definition = prompt.getDefinition()

    expect(definition.name).toBe('test-prompt')
    expect(definition.description).toBe('Test prompt for unit testing')
    expect(definition.arguments).toBeDefined()
    expect(definition.arguments?.length).toBe(1)
    expect(definition.arguments?.[0]?.name).toBe('testArg')
  })
})

describe('Prompt Snapshots', () => {
  describe('SecurityToolsOverviewPrompt', () => {
    it('should generate correct prompt without arguments', async () => {
      const prompt = new SecurityToolsOverviewPrompt()

      const result = await prompt.getPrompt()

      expect(result).toBeDefined()
      expect(result.messages).toHaveLength(1)
      expect(result.messages[0]?.content.text).toContain('Mobb Security Tools')
    })

    it('should match snapshot', async () => {
      const prompt = new SecurityToolsOverviewPrompt()

      const result = await prompt.getPrompt()

      expect(result).toMatchSnapshot()
    })
  })

  describe('ScanRepositoryPrompt', () => {
    it('should generate prompt without path', async () => {
      const prompt = new ScanRepositoryPrompt()

      const result = await prompt.getPrompt()

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(
        'Security Repository Scan'
      )
    })

    it('should generate prompt with path parameter', async () => {
      const prompt = new ScanRepositoryPrompt()
      const path = '/Users/test/project'

      const result = await prompt.getPrompt({ path })

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(path)
    })

    it('should include path in output when provided', async () => {
      const prompt = new ScanRepositoryPrompt()
      const path = '/Users/test/my-repo'

      const result = await prompt.getPrompt({ path })

      expect(result.messages[0]?.content.text).toContain(path)
    })

    it('should match snapshots', async () => {
      const prompt = new ScanRepositoryPrompt()

      const resultWithoutPath = await prompt.getPrompt()
      const resultWithPath = await prompt.getPrompt({ path: '/test/repo' })

      expect(resultWithoutPath).toMatchSnapshot('without-path')
      expect(resultWithPath).toMatchSnapshot('with-path')
    })
  })

  describe('ScanRecentChangesPrompt', () => {
    it('should generate prompt without path', async () => {
      const prompt = new ScanRecentChangesPrompt()

      const result = await prompt.getPrompt()

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain('Scan Recent Changes')
    })

    it('should generate prompt with path parameter', async () => {
      const prompt = new ScanRecentChangesPrompt()
      const path = '/Users/test/project'

      const result = await prompt.getPrompt({ path })

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(path)
    })

    it('should match snapshots', async () => {
      const prompt = new ScanRecentChangesPrompt()

      const resultWithoutPath = await prompt.getPrompt()
      const resultWithPath = await prompt.getPrompt({ path: '/test/repo' })

      expect(resultWithoutPath).toMatchSnapshot('without-path')
      expect(resultWithPath).toMatchSnapshot('with-path')
    })
  })

  describe('CheckForNewVulnerabilitiesPrompt', () => {
    it('should generate monitoring workflow prompt', async () => {
      const prompt = new CheckForNewVulnerabilitiesPrompt()

      const result = await prompt.getPrompt()

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(
        'Continuous Security Monitoring'
      )
    })

    it('should handle optional path parameter', async () => {
      const prompt = new CheckForNewVulnerabilitiesPrompt()
      const path = '/Users/test/project'

      const result = await prompt.getPrompt({ path })

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(path)
    })

    it('should match snapshots', async () => {
      const prompt = new CheckForNewVulnerabilitiesPrompt()

      const resultWithoutPath = await prompt.getPrompt()
      const resultWithPath = await prompt.getPrompt({ path: '/test/repo' })

      expect(resultWithoutPath).toMatchSnapshot('without-path')
      expect(resultWithPath).toMatchSnapshot('with-path')
    })
  })

  describe('ReviewAndFixCriticalPrompt', () => {
    it('should generate critical fix workflow', async () => {
      const prompt = new ReviewAndFixCriticalPrompt()

      const result = await prompt.getPrompt()

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(
        'Critical Security Vulnerabilities'
      )
    })

    it('should handle optional path parameter', async () => {
      const prompt = new ReviewAndFixCriticalPrompt()
      const path = '/Users/test/project'

      const result = await prompt.getPrompt({ path })

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(path)
    })

    it('should match snapshots', async () => {
      const prompt = new ReviewAndFixCriticalPrompt()

      const resultWithoutPath = await prompt.getPrompt()
      const resultWithPath = await prompt.getPrompt({ path: '/test/repo' })

      expect(resultWithoutPath).toMatchSnapshot('without-path')
      expect(resultWithPath).toMatchSnapshot('with-path')
    })
  })

  describe('FullSecurityAuditPrompt', () => {
    it('should generate complete audit workflow', async () => {
      const prompt = new FullSecurityAuditPrompt()

      const result = await prompt.getPrompt()

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(
        'Complete Security Audit'
      )
    })

    it('should include all 7 phases', async () => {
      const prompt = new FullSecurityAuditPrompt()

      const result = await prompt.getPrompt()
      const text = result.messages[0]?.content.text || ''

      expect(text).toContain('Phase 1')
      expect(text).toContain('Phase 2')
      expect(text).toContain('Phase 3')
      expect(text).toContain('Phase 4')
      expect(text).toContain('Phase 5')
      expect(text).toContain('Phase 6')
      expect(text).toContain('Phase 7')
    })

    it('should handle optional path parameter', async () => {
      const prompt = new FullSecurityAuditPrompt()
      const path = '/Users/test/project'

      const result = await prompt.getPrompt({ path })

      expect(result).toBeDefined()
      expect(result.messages[0]?.content.text).toContain(path)
    })

    it('should match snapshots', async () => {
      const prompt = new FullSecurityAuditPrompt()

      const resultWithoutPath = await prompt.getPrompt()
      const resultWithPath = await prompt.getPrompt({ path: '/test/repo' })

      expect(resultWithoutPath).toMatchSnapshot('without-path')
      expect(resultWithPath).toMatchSnapshot('with-path')
    })
  })
})
