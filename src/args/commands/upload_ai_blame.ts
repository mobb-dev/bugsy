import fsPromises from 'node:fs/promises'
import * as os from 'node:os'
import path from 'node:path'

import chalk from 'chalk'
import { withFile } from 'tmp-promise'
import type * as Yargs from 'yargs'
import z from 'zod'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import {
  type AiBlameInferenceFinalizeInput,
  type AiBlameInferenceInitInput,
  AiBlameInferenceType,
  type FinalizeAiBlameInferencesUploadMutationVariables,
  type UploadAiBlameInferencesInitMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { uploadFile } from '../../features/analysis/upload-file'
import {
  type SanitizationCounts,
  sanitizeData,
  sanitizeDataWithCounts,
} from '../../utils/sanitize-sensitive-data'

const PromptItemZ = z.object({
  type: z.enum(['USER_PROMPT', 'AI_RESPONSE', 'TOOL_EXECUTION', 'AI_THINKING']),
  attachedFiles: z
    .array(
      z.object({
        relativePath: z.string(),
        startLine: z.number().optional(),
      })
    )
    .optional(),
  tokens: z
    .object({
      inputCount: z.number(),
      outputCount: z.number(),
    })
    .optional(),
  text: z.string().optional(),
  date: z.date().optional(),
  tool: z
    .object({
      name: z.string(),
      parameters: z.string(),
      result: z.string(),
      rawArguments: z.string().optional(),
      accepted: z.boolean().optional(),
    })
    .optional(),
})

export type PromptItem = z.infer<typeof PromptItemZ>

const PromptItemArrayZ = z.array(PromptItemZ)

export type PromptItemArray = z.infer<typeof PromptItemArrayZ>

type SessionInput = {
  promptFileName: string
  inferenceFileName: string
  aiResponseAt: string
  model?: string
  toolName?: string
  blameType?: AiBlameInferenceType
  computerName?: string
  userName?: string
}

/**
 * Get system information for tracking inference source.
 * Works cross-platform (Windows, macOS, Linux).
 */
function getSystemInfo() {
  return {
    computerName: os.hostname(),
    userName: os.userInfo().username,
  }
}

export type UploadAiBlameOptions = {
  prompt: string[]
  inference: string[]
  aiResponseAt?: string[]
  model?: string[]
  toolName?: string[]
  blameType?: AiBlameInferenceType[]
  // yargs also exposes kebab-case keys; include them to satisfy typing
  'ai-response-at'?: string[]
  'tool-name'?: string[]
  'blame-type'?: AiBlameInferenceType[]
}

export function uploadAiBlameBuilder(
  args: Yargs.Argv<unknown>
): Yargs.Argv<UploadAiBlameOptions> {
  return args
    .option('prompt', {
      type: 'string',
      array: true,
      demandOption: true,
      describe: chalk.bold('Path(s) to prompt artifact(s) (one per session)'),
    })
    .option('inference', {
      type: 'string',
      array: true,
      demandOption: true,
      describe: chalk.bold(
        'Path(s) to inference artifact(s) (one per session)'
      ),
    })
    .option('ai-response-at', {
      type: 'string',
      array: true,
      describe: chalk.bold(
        'ISO timestamp(s) for AI response (one per session, defaults to now)'
      ),
    })
    .option('model', {
      type: 'string',
      array: true,
      describe: chalk.bold('AI model name(s) (optional, one per session)'),
    })
    .option('tool-name', {
      type: 'string',
      array: true,
      describe: chalk.bold('Tool/IDE name(s) (optional, one per session)'),
    })
    .option('blame-type', {
      type: 'string',
      array: true,
      choices: Object.values(AiBlameInferenceType),
      describe: chalk.bold(
        'Blame type(s) (optional, one per session, defaults to CHAT)'
      ),
    })
    .strict()
}

export type UploadAiBlameResult = {
  promptsCounts: SanitizationCounts
  inferenceCounts: SanitizationCounts
  promptsUUID?: string
  inferenceUUID?: string
}

export async function uploadAiBlameHandlerFromExtension(args: {
  prompts: PromptItemArray
  inference: string
  model: string
  tool: string
  responseTime: string
  blameType?: AiBlameInferenceType
}): Promise<UploadAiBlameResult> {
  const uploadArgs: UploadAiBlameOptions = {
    prompt: [],
    inference: [],
    model: [],
    toolName: [],
    aiResponseAt: [],
    blameType: [],
  }

  let promptsCounts: SanitizationCounts
  let inferenceCounts: SanitizationCounts
  let promptsUUID: string | undefined
  let inferenceUUID: string | undefined

  await withFile(async (promptFile) => {
    // Sanitize prompts data and get counts
    const promptsResult = await sanitizeDataWithCounts(args.prompts)
    promptsCounts = promptsResult.counts
    promptsUUID = path.basename(promptFile.path, path.extname(promptFile.path))

    await fsPromises.writeFile(
      promptFile.path,
      JSON.stringify(promptsResult.sanitizedData, null, 2),
      'utf-8'
    )
    uploadArgs.prompt!.push(promptFile.path)

    await withFile(async (inferenceFile) => {
      // Sanitize inference data and get counts
      const inferenceResult = await sanitizeDataWithCounts(args.inference)
      inferenceCounts = inferenceResult.counts
      inferenceUUID = path.basename(
        inferenceFile.path,
        path.extname(inferenceFile.path)
      )

      await fsPromises.writeFile(
        inferenceFile.path,
        inferenceResult.sanitizedData as string,
        'utf-8'
      )
      uploadArgs.inference!.push(inferenceFile.path)
      uploadArgs.model!.push(args.model)
      uploadArgs.toolName!.push(args.tool)
      uploadArgs.aiResponseAt!.push(args.responseTime)
      uploadArgs.blameType!.push(args.blameType || AiBlameInferenceType.Chat)

      await uploadAiBlameHandler(uploadArgs, false)
    })
  })

  return {
    promptsCounts: promptsCounts!,
    inferenceCounts: inferenceCounts!,
    promptsUUID,
    inferenceUUID,
  }
}

export async function uploadAiBlameHandler(
  args: UploadAiBlameOptions,
  exitOnError = true
) {
  const prompts = (args.prompt || []) as string[]
  const inferences = (args.inference || []) as string[]
  const models = (args.model || []) as string[]
  const tools = (args.toolName ||
    (args['tool-name'] as string[] | undefined) ||
    []) as string[]
  const responseTimes = (args.aiResponseAt ||
    (args['ai-response-at'] as string[] | undefined) ||
    []) as string[]
  const blameTypes = (args.blameType ||
    (args['blame-type'] as AiBlameInferenceType[] | undefined) ||
    []) as AiBlameInferenceType[]

  if (prompts.length !== inferences.length) {
    const errorMsg = 'prompt and inference must have the same number of entries'
    console.error(chalk.red(errorMsg))

    if (exitOnError) {
      process.exit(1)
    }
    throw new Error(errorMsg)
  }

  const nowIso = new Date().toISOString()
  const { computerName, userName } = getSystemInfo()
  const sessions: SessionInput[] = []
  for (let i = 0; i < prompts.length; i++) {
    const promptPath = String(prompts[i])
    const inferencePath = String(inferences[i])
    try {
      await Promise.all([
        fsPromises.access(promptPath),
        fsPromises.access(inferencePath),
      ])
    } catch {
      const errorMsg = `File not found for session ${i + 1}`
      console.error(chalk.red(errorMsg))
      if (exitOnError) {
        process.exit(1)
      }
      throw new Error(errorMsg)
    }
    sessions.push({
      promptFileName: path.basename(promptPath),
      inferenceFileName: path.basename(inferencePath),
      aiResponseAt: responseTimes[i] || nowIso,
      model: models[i],
      toolName: tools[i],
      blameType: blameTypes[i] || AiBlameInferenceType.Chat,
      computerName,
      userName,
    })
  }

  // Use provided client or authenticate a new one
  const authenticatedClient = await getAuthenticatedGQLClient({
    isSkipPrompts: true,
  })

  // Init: presign
  // Sanitize sessions data before sending to server
  const sanitizedSessions = (await sanitizeData(
    sessions
  )) as AiBlameInferenceInitInput[]
  const initRes = await authenticatedClient.uploadAIBlameInferencesInitRaw({
    sessions: sanitizedSessions,
  })
  const uploadSessions: NonNullable<
    UploadAiBlameInferencesInitMutation['uploadAIBlameInferencesInit']
  >['uploadSessions'] =
    initRes.uploadAIBlameInferencesInit?.uploadSessions ?? []
  if (uploadSessions.length !== sessions.length) {
    const errorMsg = 'Init failed to return expected number of sessions'
    console.error(chalk.red(errorMsg))
    if (exitOnError) {
      process.exit(1)
    }
    throw new Error(errorMsg)
  }

  // Upload files
  for (let i = 0; i < uploadSessions.length; i++) {
    const us = uploadSessions[i]!
    const promptPath = String(prompts[i])
    const inferencePath = String(inferences[i])

    await Promise.all([
      // Prompt
      uploadFile({
        file: promptPath,
        url: us.prompt.url,
        uploadFields: JSON.parse(us.prompt.uploadFieldsJSON),
        uploadKey: us.prompt.uploadKey,
      }),
      // Inference
      uploadFile({
        file: inferencePath,
        url: us.inference.url,
        uploadFields: JSON.parse(us.inference.uploadFieldsJSON),
        uploadKey: us.inference.uploadKey,
      }),
    ])
  }

  // Finalize
  const finalizeSessions: FinalizeAiBlameInferencesUploadMutationVariables['sessions'] =
    uploadSessions.map((us, i: number) => {
      const s = sessions[i]!
      return {
        aiBlameInferenceId: us.aiBlameInferenceId,
        promptKey: us.prompt.uploadKey,
        inferenceKey: us.inference.uploadKey,
        aiResponseAt: s.aiResponseAt,
        model: s.model,
        toolName: s.toolName,
        blameType: s.blameType,
        computerName: s.computerName,
        userName: s.userName,
      }
    })

  // Sanitize finalizeSessions data before sending to server
  const sanitizedFinalizeSessions = (await sanitizeData(
    finalizeSessions
  )) as AiBlameInferenceFinalizeInput[]
  const finRes = await authenticatedClient.finalizeAIBlameInferencesUploadRaw({
    sessions: sanitizedFinalizeSessions,
  })
  const status = finRes?.finalizeAIBlameInferencesUpload?.status
  if (status !== 'OK') {
    const errorMsg =
      finRes?.finalizeAIBlameInferencesUpload?.error || 'unknown error'
    console.error(chalk.red(errorMsg))
    if (exitOnError) {
      process.exit(1)
    }
    throw new Error(errorMsg)
  }
  console.log(chalk.green('AI Blame uploads finalized successfully'))
}
