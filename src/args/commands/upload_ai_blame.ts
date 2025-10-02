import fs from 'node:fs/promises'
import path from 'node:path'

import chalk from 'chalk'
import type * as Yargs from 'yargs'

import type {
  FinalizeAiBlameInferencesUploadMutationVariables,
  UploadAiBlameInferencesInitMutation,
} from '../../features/analysis/scm/generates/client_generates'
import { uploadFile } from '../../features/analysis/upload-file'
import { createAuthenticatedMcpGQLClient } from '../../mcp/services/McpGQLClient'

type SessionInput = {
  promptFileName: string
  inferenceFileName: string
  aiResponseAt: string
  model?: string
  toolName?: string
}

export type UploadAiBlameOptions = {
  prompt: string[]
  inference: string[]
  aiResponseAt?: string[]
  model?: string[]
  toolName?: string[]
  // yargs also exposes kebab-case keys; include them to satisfy typing
  'ai-response-at'?: string[]
  'tool-name'?: string[]
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
    .strict()
}

export async function uploadAiBlameHandler(args: UploadAiBlameOptions) {
  const prompts = (args.prompt || []) as string[]
  const inferences = (args.inference || []) as string[]
  const models = (args.model || []) as string[]
  const tools = (args.toolName ||
    (args['tool-name'] as string[] | undefined) ||
    []) as string[]
  const responseTimes = (args.aiResponseAt ||
    (args['ai-response-at'] as string[] | undefined) ||
    []) as string[]

  if (prompts.length !== inferences.length) {
    console.error(
      chalk.red('prompt and inference must have the same number of entries')
    )
    process.exit(1)
  }

  const nowIso = new Date().toISOString()
  const sessions: SessionInput[] = []
  for (let i = 0; i < prompts.length; i++) {
    const promptPath = String(prompts[i])
    const inferencePath = String(inferences[i])
    try {
      await Promise.all([fs.access(promptPath), fs.access(inferencePath)])
    } catch {
      console.error(chalk.red(`File not found for session ${i + 1}`))
      process.exit(1)
    }
    sessions.push({
      promptFileName: path.basename(promptPath),
      inferenceFileName: path.basename(inferencePath),
      aiResponseAt: responseTimes[i] || nowIso,
      model: models[i],
      toolName: tools[i],
    })
  }

  const gqlClient = await createAuthenticatedMcpGQLClient()

  // Init: presign
  const initRes = await gqlClient.uploadAIBlameInferencesInitRaw({ sessions })
  const uploadSessions: NonNullable<
    UploadAiBlameInferencesInitMutation['uploadAIBlameInferencesInit']
  >['uploadSessions'] =
    initRes.uploadAIBlameInferencesInit?.uploadSessions ?? []
  if (uploadSessions.length !== sessions.length) {
    console.error(
      chalk.red('Init failed to return expected number of sessions')
    )
    process.exit(1)
  }

  // Upload files
  for (let i = 0; i < uploadSessions.length; i++) {
    const us = uploadSessions[i]!
    const promptPath = String(prompts[i])
    const inferencePath = String(inferences[i])
    // Prompt
    await uploadFile({
      file: promptPath,
      url: us.prompt.url,
      uploadFields: JSON.parse(us.prompt.uploadFieldsJSON),
      uploadKey: us.prompt.uploadKey,
    })
    // Inference
    await uploadFile({
      file: inferencePath,
      url: us.inference.url,
      uploadFields: JSON.parse(us.inference.uploadFieldsJSON),
      uploadKey: us.inference.uploadKey,
    })
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
      }
    })

  const finRes = await gqlClient.finalizeAIBlameInferencesUploadRaw({
    sessions: finalizeSessions,
  })
  const status = finRes?.finalizeAIBlameInferencesUpload?.status
  if (status !== 'OK') {
    console.error(
      chalk.red(
        `Finalize failed: ${finRes?.finalizeAIBlameInferencesUpload?.error || 'unknown error'}`
      )
    )
    process.exit(1)
  }
  console.log(chalk.green('AI Blame uploads finalized successfully'))
}
