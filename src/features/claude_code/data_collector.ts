import { z } from 'zod'

import { uploadAiBlameHandlerFromExtension } from '../../args/commands/upload_ai_blame'
import { AiBlameInferenceType } from '../../features/analysis/scm/generates/client_generates'
import {
  parseTranscriptAndCreateTrace,
  type TraceData,
} from './transcript_parser'

const StructuredPatchItemSchema = z.object({
  oldStart: z.number(),
  oldLines: z.number(),
  newStart: z.number(),
  newLines: z.number(),
  lines: z.array(z.string()),
})

const EditToolInputSchema = z.object({
  file_path: z.string(),
  old_string: z.string(),
  new_string: z.string(),
})

const WriteToolInputSchema = z.object({
  file_path: z.string(),
  content: z.string(),
})

const EditToolResponseSchema = z.object({
  filePath: z.string(),
  oldString: z.string().optional(),
  newString: z.string().optional(),
  originalFile: z.string().optional(),
  structuredPatch: z.array(StructuredPatchItemSchema),
  userModified: z.boolean().optional(),
  replaceAll: z.boolean().optional(),
})

const WriteToolResponseSchema = z.object({
  type: z.string().optional(),
  filePath: z.string(),
  content: z.string().optional(),
  structuredPatch: z.array(z.any()).optional(),
})

const HookDataSchema = z.object({
  session_id: z.string(),
  transcript_path: z.string(),
  cwd: z.string(),
  permission_mode: z.string().optional(),
  hook_event_name: z.literal('PostToolUse'),
  tool_name: z.enum(['Edit', 'Write']),
  tool_input: z.union([EditToolInputSchema, WriteToolInputSchema]),
  tool_response: z.union([EditToolResponseSchema, WriteToolResponseSchema]),
})

export type HookData = z.infer<typeof HookDataSchema>
type EditToolResponse = z.infer<typeof EditToolResponseSchema>

/**
 * Reads and parses JSON data from stdin
 */
export async function readStdinData(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let inputData = ''

    process.stdin.setEncoding('utf-8')

    process.stdin.on('data', (chunk: string) => {
      inputData += chunk
    })

    process.stdin.on('end', () => {
      try {
        const parsedData = JSON.parse(inputData)
        resolve(parsedData)
      } catch (error) {
        reject(
          new Error(
            `Failed to parse JSON from stdin: ${(error as Error).message}`
          )
        )
      }
    })

    process.stdin.on('error', (error) => {
      reject(new Error(`Error reading from stdin: ${error.message}`))
    })
  })
}

/**
 * Validates hook data structure against the expected schema
 */
export function validateHookData(data: unknown): HookData {
  return HookDataSchema.parse(data)
}

/**
 * Extracts the inference (code additions only) from hook data
 */
export function extractInference(hookData: HookData): string {
  if (hookData.tool_name === 'Write') {
    // For Write operations, the entire content is an addition (from tool_input, not tool_response)
    const writeInput = hookData.tool_input as { content?: string }
    return writeInput.content || ''
  }

  if (hookData.tool_name === 'Edit') {
    const editResponse = hookData.tool_response as EditToolResponse
    const additions: string[] = []

    // Extract lines that start with "+" from structured patch
    for (const patch of editResponse.structuredPatch) {
      for (const line of patch.lines) {
        if (line.startsWith('+')) {
          // Remove the "+" prefix and add to additions
          additions.push(line.slice(1))
        }
      }
    }

    return additions.join('\n')
  }

  return ''
}

/**
 * Main function to collect and process hook data from stdin
 */
export async function collectHookData(): Promise<{
  hookData: HookData
  inference: string
  tracePayload: TraceData
}> {
  // Read raw data from stdin
  const rawData = await readStdinData()

  // Validate the data structure
  const hookData = validateHookData(rawData)

  // Extract inference (code additions only)
  const inference = extractInference(hookData)

  // Parse transcript and create trace data
  let tracePayload: TraceData

  try {
    tracePayload = await parseTranscriptAndCreateTrace(
      hookData.transcript_path,
      hookData,
      inference
    )
  } catch (error) {
    // Transcript parsing is optional - continue without it
    console.warn(
      'Warning: Could not parse transcript:',
      (error as Error).message
    )
    // Create basic trace payload without transcript data
    tracePayload = {
      prompts: [
        {
          type: 'TOOL_EXECUTION',
          date: new Date(),
          tool: {
            name: hookData.tool_name,
            parameters: JSON.stringify(hookData.tool_input, null, 2),
            result: JSON.stringify(hookData.tool_response, null, 2),
            rawArguments: JSON.stringify(hookData.tool_input),
            accepted: true,
          },
        },
      ],
      inference,
      model: 'claude-sonnet-4',
      tool: 'Claude Code',
      responseTime: new Date().toISOString(),
    }
  }

  return {
    hookData,
    inference,
    tracePayload,
  }
}

/**
 * Processes hook data and uploads to backend
 */
export async function processAndUploadHookData(): Promise<{
  hookData: HookData
  inference: string
  tracePayload: TraceData
  uploadSuccess: boolean
}> {
  // Collect and format the data
  const result = await collectHookData()

  // Attempt to upload the trace data
  let uploadSuccess
  try {
    await uploadAiBlameHandlerFromExtension({
      prompts: result.tracePayload.prompts,
      inference: result.tracePayload.inference,
      model: result.tracePayload.model,
      tool: result.tracePayload.tool,
      responseTime: result.tracePayload.responseTime,
      blameType: AiBlameInferenceType.Chat,
      sessionId: result.hookData.session_id,
    })
    uploadSuccess = true
  } catch (error) {
    // Silent failure as required by specification
    console.warn(
      'Warning: Failed to upload trace data:',
      (error as Error).message
    )
    uploadSuccess = false
  }

  return {
    ...result,
    uploadSuccess,
  }
}
