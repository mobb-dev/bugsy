import fsPromises from 'node:fs/promises'

import type { PromptItem } from '../../args/commands/upload_ai_blame'

type TranscriptEntry = {
  type: string
  message?: {
    role?: string
    content?:
      | string
      | { type: string; text?: string; name?: string; thinking?: string }[]
    model?: string
    usage?: {
      input_tokens?: number
      output_tokens?: number
      cache_creation_input_tokens?: number
      cache_read_input_tokens?: number
    }
  }
  timestamp?: string
  uuid?: string
}

export type TraceData = {
  prompts: PromptItem[]
  inference: string
  model: string
  tool: string
  responseTime: string
}

type HookData = {
  tool_name: string
  tool_input: Record<string, unknown>
  tool_response: Record<string, unknown>
}

/**
 * Processes a single transcript line and extracts relevant data
 */
function processTranscriptLine(entry: TranscriptEntry): {
  prompts: PromptItem[]
  model?: string
  inputTokens: number
  outputTokens: number
  date?: Date
} {
  const prompts: PromptItem[] = []
  let model: string | undefined
  let inputTokens = 0
  let outputTokens = 0
  let date: Date | undefined

  // Extract model if available
  if (entry.message?.model) {
    model = entry.message.model
  }

  // Extract tokens if available
  if (entry.message?.usage) {
    inputTokens = entry.message.usage.input_tokens || 0
    outputTokens = entry.message.usage.output_tokens || 0
  }

  // Extract date if available
  if (entry.timestamp) {
    date = new Date(entry.timestamp)
  }

  if (entry.type === 'user' && entry.message?.role === 'user') {
    if (typeof entry.message.content === 'string') {
      prompts.push({
        type: 'USER_PROMPT',
        text: entry.message.content,
        date: date || new Date(),
        tokens:
          inputTokens > 0
            ? {
                inputCount: inputTokens,
                outputCount: 0,
              }
            : undefined,
      })
    }
  } else if (
    entry.type === 'assistant' &&
    entry.message?.role === 'assistant'
  ) {
    if (Array.isArray(entry.message.content)) {
      for (const item of entry.message.content) {
        if (item.type === 'text' && item.text) {
          prompts.push({
            type: 'AI_RESPONSE',
            text: item.text,
            date: date || new Date(),
            tokens:
              outputTokens > 0
                ? {
                    inputCount: 0,
                    outputCount: outputTokens,
                  }
                : undefined,
          })
        } else if (item.type === 'thinking' && item.thinking) {
          prompts.push({
            type: 'AI_THINKING',
            text: item.thinking,
            date: date || new Date(),
          })
        }
      }
    }
  }

  return {
    prompts,
    model,
    inputTokens,
    outputTokens,
    date,
  }
}

/**
 * Parses transcript and creates trace data in one step
 */
export async function parseTranscriptAndCreateTrace(
  transcriptPath: string,
  hookData: HookData,
  inference: string
): Promise<TraceData> {
  const content = await fsPromises.readFile(transcriptPath, 'utf-8')
  const lines = content.trim().split('\n')

  let currentToolIndex = -1

  // Iterate backwards to find the most recent Edit/Write tool usage
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]?.trim() ?? ''

    if (!line.includes('"type":"tool_use"')) continue

    const isEditTool = line.includes('"name":"Edit"')
    const isWriteTool = line.includes('"name":"Write"')

    if (isEditTool || isWriteTool) {
      currentToolIndex = i
      break // Found the most recent tool, stop here
    }
  }

  // Determine parsing range - always parse from start up to current tool
  // This captures the full conversation context leading to this tool use
  const startIndex = 0
  const endIndex =
    currentToolIndex === -1 ? lines.length - 1 : currentToolIndex - 1

  // Parse only the relevant lines and create PromptItems directly
  const prompts: PromptItem[] = []
  let model: string | undefined
  let latestDate: Date | undefined

  for (let i = startIndex; i <= endIndex; i++) {
    const line = lines[i]?.trim() ?? ''
    const entry = JSON.parse(line) as TranscriptEntry

    const lineResult = processTranscriptLine(entry)

    // Add prompts from this line
    prompts.push(...lineResult.prompts)

    // Update model if found and not already set
    if (lineResult.model && !model) {
      model = lineResult.model
    }

    // Update latest date
    if (lineResult.date) {
      if (!latestDate || lineResult.date > latestDate) {
        latestDate = lineResult.date
      }
    }
  }

  // Add tool execution
  prompts.push({
    type: 'TOOL_EXECUTION',
    date: latestDate || new Date(),
    tool: {
      name: hookData.tool_name,
      parameters: JSON.stringify(hookData.tool_input, null, 2),
      result: JSON.stringify(hookData.tool_response, null, 2),
      rawArguments: JSON.stringify(hookData.tool_input),
      accepted: true,
    },
  })

  return {
    prompts,
    inference,
    model: model || 'claude-sonnet-4', // Use extracted model or fallback
    tool: 'Claude Code',
    responseTime: (latestDate || new Date()).toISOString(),
  }
}
