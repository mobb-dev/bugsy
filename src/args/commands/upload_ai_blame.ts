import fsPromises from 'node:fs/promises'
import * as os from 'node:os'
import path from 'node:path'

import chalk from 'chalk'
import { withFile } from 'tmp-promise'
import type * as Yargs from 'yargs'
import z from 'zod'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import {
  AiBlameInferenceType,
  type FinalizeAiBlameInferencesUploadMutationVariables,
  type UploadAiBlameInferencesInitMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { GitService } from '../../features/analysis/scm/services/GitService'
import {
  parseScmURL,
  ScmType,
} from '../../features/analysis/scm/shared/src/urlParser'
import { uploadFile } from '../../features/analysis/upload-file'
import { getStableComputerName } from '../../utils/computerName'
import {
  type SanitizationCounts,
  sanitizeDataWithCounts,
} from '../../utils/sanitize-sensitive-data'

// Logger interface for dependency injection
type Logger = {
  info: (msg: string, data?: unknown) => void
  error: (msg: string, data?: unknown) => void
}

// Default console logger fallback
const defaultLogger: Logger = {
  info: (msg: string, data?: unknown) => {
    if (data !== undefined) {
      console.log(msg, data)
    } else {
      console.log(msg)
    }
  },
  error: (msg: string, data?: unknown) => {
    if (data !== undefined) {
      console.error(msg, data)
    } else {
      console.error(msg)
    }
  },
}

const PromptItemZ = z.object({
  type: z.enum([
    'USER_PROMPT',
    'AI_RESPONSE',
    'TOOL_EXECUTION',
    'AI_THINKING',
    'MCP_TOOL_CALL', // MCP (Model Context Protocol) tool invocation
  ]),
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
      // MCP-specific fields (only populated for MCP_TOOL_CALL type)
      mcpServer: z.string().optional(), // MCP server name (e.g., "datadog", "mobb-mcp")
      mcpToolName: z.string().optional(), // MCP tool name without prefix (e.g., "scan_and_fix_vulnerabilities")
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
  sessionId?: string
  repositoryUrl?: string | null
}

/**
 * Gets the normalized GitHub repository URL from the current working directory.
 * Returns null if not in a git repository or if not a GitHub repository.
 */
async function getRepositoryUrl(): Promise<string | null> {
  try {
    const gitService = new GitService(process.cwd())
    const isRepo = await gitService.isGitRepository()
    if (!isRepo) {
      return null
    }
    const remoteUrl = await gitService.getRemoteUrl()
    const parsed = parseScmURL(remoteUrl)
    return parsed?.scmType === ScmType.GitHub ? remoteUrl : null
  } catch {
    return null
  }
}

/**
 * Get system information for tracking inference source.
 * Works cross-platform (Windows, macOS, Linux).
 * Handles errors gracefully for containerized environments where user info may not be available.
 */
function getSystemInfo(): {
  computerName: string
  userName: string | undefined
} {
  let userName: string | undefined
  try {
    userName = os.userInfo().username
  } catch {
    // os.userInfo() can throw in some environments (e.g., containerized or restricted permissions)
    userName = undefined
  }

  return {
    computerName: getStableComputerName(),
    userName,
  }
}

export type UploadAiBlameOptions = {
  prompt: string[]
  inference: string[]
  aiResponseAt?: string[]
  model?: string[]
  toolName?: string[]
  blameType?: AiBlameInferenceType[]
  sessionId?: string[]
  // yargs also exposes kebab-case keys; include them to satisfy typing
  'ai-response-at'?: string[]
  'tool-name'?: string[]
  'blame-type'?: AiBlameInferenceType[]
  'session-id'?: string[]
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
  sessionId?: string
  apiUrl?: string
  webAppUrl?: string
  repositoryUrl?: string | null
}): Promise<UploadAiBlameResult> {
  const uploadArgs: UploadAiBlameOptions = {
    prompt: [],
    inference: [],
    model: [],
    toolName: [],
    aiResponseAt: [],
    blameType: [],
    sessionId: [],
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
      if (args.sessionId) {
        uploadArgs.sessionId!.push(args.sessionId)
      }

      await uploadAiBlameHandler({
        args: uploadArgs,
        exitOnError: false,
        apiUrl: args.apiUrl,
        webAppUrl: args.webAppUrl,
        repositoryUrl: args.repositoryUrl,
      })
    })
  })

  return {
    promptsCounts: promptsCounts!,
    inferenceCounts: inferenceCounts!,
    promptsUUID,
    inferenceUUID,
  }
}

// Options for uploadAiBlameHandler
type UploadAiBlameHandlerOptions = {
  args: UploadAiBlameOptions
  exitOnError?: boolean
  apiUrl?: string
  webAppUrl?: string
  logger?: Logger
  repositoryUrl?: string | null
}

export async function uploadAiBlameHandler(
  options: UploadAiBlameHandlerOptions
) {
  const {
    args,
    exitOnError = true,
    apiUrl,
    webAppUrl,
    logger = defaultLogger,
  } = options
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
  const sessionIds = (args.sessionId ||
    (args['session-id'] as string[] | undefined) ||
    []) as string[]

  if (prompts.length !== inferences.length) {
    const errorMsg = 'prompt and inference must have the same number of entries'
    logger.error(chalk.red(errorMsg))

    if (exitOnError) {
      process.exit(1)
    }
    throw new Error(errorMsg)
  }

  const nowIso = new Date().toISOString()
  const { computerName, userName } = getSystemInfo()
  // Use provided repositoryUrl if available, otherwise try to detect from cwd
  const repositoryUrl =
    options.repositoryUrl !== undefined
      ? options.repositoryUrl
      : await getRepositoryUrl()
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
      logger.error(chalk.red(errorMsg))
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
      sessionId: sessionIds[i],
      repositoryUrl,
    })
  }

  // Use provided client or authenticate a new one
  const authenticatedClient = await getAuthenticatedGQLClient({
    isSkipPrompts: true,
    apiUrl,
    webAppUrl,
  })

  // Init: presign
  // Sanitize sessions data before sending to server
  // Note: sessionId is only needed for finalize, not for init
  const initSessions = sessions.map(
    ({ sessionId: _sessionId, ...rest }) => rest
  )
  const initRes = await authenticatedClient.uploadAIBlameInferencesInitRaw({
    sessions: initSessions,
  })
  const uploadSessions: NonNullable<
    UploadAiBlameInferencesInitMutation['uploadAIBlameInferencesInit']
  >['uploadSessions'] =
    initRes.uploadAIBlameInferencesInit?.uploadSessions ?? []
  if (uploadSessions.length !== sessions.length) {
    const errorMsg = 'Init failed to return expected number of sessions'
    logger.error(chalk.red(errorMsg))
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
        sessionId: s.sessionId,
        repositoryUrl: s.repositoryUrl,
      }
    })

  // Finalize with detailed logging
  try {
    logger.info(
      `[UPLOAD] Calling finalizeAIBlameInferencesUploadRaw with ${finalizeSessions.length} sessions`
    )
    const finRes = await authenticatedClient.finalizeAIBlameInferencesUploadRaw(
      {
        sessions: finalizeSessions,
      }
    )
    logger.info('[UPLOAD] Finalize response:', JSON.stringify(finRes, null, 2))
    const status = finRes?.finalizeAIBlameInferencesUpload?.status
    if (status !== 'OK') {
      const errorMsg =
        finRes?.finalizeAIBlameInferencesUpload?.error || 'unknown error'
      logger.error(
        chalk.red(
          `[UPLOAD] Finalize failed with status: ${status}, error: ${errorMsg}`
        )
      )
      if (exitOnError) {
        process.exit(1)
      }
      throw new Error(errorMsg)
    }
    logger.info(chalk.green('[UPLOAD] AI Blame uploads finalized successfully'))
  } catch (error) {
    logger.error('[UPLOAD] Finalize threw error:', error)
    throw error
  }
}

// Yargs-compatible handler wrapper for CLI usage
export async function uploadAiBlameCommandHandler(
  args: UploadAiBlameOptions
): Promise<void> {
  await uploadAiBlameHandler({ args })
}
