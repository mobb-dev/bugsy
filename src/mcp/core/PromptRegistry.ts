import { logDebug, logWarn } from '../Logger'
import { BasePrompt } from '../prompts/base/BasePrompt'
import { PromptDefinition } from '../types'

export class PromptRegistry {
  private prompts = new Map<string, BasePrompt>()

  public registerPrompt(prompt: BasePrompt): void {
    if (this.prompts.has(prompt.name)) {
      logWarn(`Prompt ${prompt.name} is already registered, overwriting`, {
        promptName: prompt.name,
      })
    }

    this.prompts.set(prompt.name, prompt)
    logDebug(`Prompt registered: ${prompt.name}`, {
      promptName: prompt.name,
      description: prompt.description,
    })
  }

  public getPrompt(name: string): BasePrompt | undefined {
    return this.prompts.get(name)
  }

  public getPromptDefinition(name: string): PromptDefinition | undefined {
    return this.prompts.get(name)?.getDefinition()
  }

  public getAllPrompts(): PromptDefinition[] {
    return Array.from(this.prompts.values()).map((prompt) =>
      prompt.getDefinition()
    )
  }

  public getPromptNames(): string[] {
    return Array.from(this.prompts.keys())
  }

  public hasPrompt(name: string): boolean {
    return this.prompts.has(name)
  }

  public getPromptCount(): number {
    return this.prompts.size
  }
}
