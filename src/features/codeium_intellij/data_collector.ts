import { z } from 'zod'

import {
  PromptItem,
  uploadAiBlameHandlerFromExtension,
} from '../../args/commands/upload_ai_blame'
import { AiBlameInferenceType } from '../analysis/scm/generates/client_generates'
import { parseScmURL, ScmType } from '../analysis/scm/shared/src/urlParser'
import { readStdinData } from '../claude_code/data_collector'
import {
  getGrpcClient,
  PromisifiedClient,
} from './codeium_language_server_grpc_client'
import { findRunningCodeiumLanguageServers } from './parse_intellij_logs'
import type { CortexTrajectoryStep__Output } from './proto/exa/cortex_pb/CortexTrajectoryStep'
import type { LanguageServerServiceClient } from './proto/exa/language_server_pb/LanguageServerService'

export type TraceData = {
  prompts: PromptItem[]
  inference: string
  model: string
  tool: string
  responseTime: string
  sessionId: string
  repositoryUrl?: string
}

type StepResult = {
  prompts: PromptItem[]
  inferences: string[]
}

const HookDataSchema = z.object({
  trajectory_id: z.string(),
})
type HookData = z.infer<typeof HookDataSchema>

export async function processAndUploadHookData() {
  const tracePayload = await getTraceDataForHook()

  if (!tracePayload) {
    console.warn('Warning: Failed to retrieve chat data.')
    return
  }

  try {
    const uploadSuccess = await uploadAiBlameHandlerFromExtension({
      prompts: tracePayload.prompts,
      inference: tracePayload.inference,
      model: tracePayload.model,
      tool: tracePayload.tool,
      responseTime: tracePayload.responseTime,
      blameType: AiBlameInferenceType.Chat,
      sessionId: tracePayload.sessionId,
      repositoryUrl: tracePayload.repositoryUrl,
    })

    if (uploadSuccess) {
      console.log('Uploaded trace data.')
    } else {
      console.warn('Failed to upload trace data.')
    }
  } catch (e) {
    console.warn('Failed to upload trace data:', e)
  }
}

function validateHookData(data: unknown): HookData {
  return HookDataSchema.parse(data)
}

async function getTraceDataForHook(): Promise<TraceData | null> {
  const rawData = await readStdinData()
  const hookData = validateHookData(rawData)

  return await getTraceDataForTrajectory(hookData.trajectory_id)
}

async function getTraceDataForTrajectory(
  trajectoryId: string
): Promise<TraceData | null> {
  const instances = findRunningCodeiumLanguageServers()

  for (const instance of instances) {
    const client = await getGrpcClient(instance.port, instance.csrf)

    if (!client) {
      continue
    }

    const chats = await client.GetAllCascadeTrajectories({})

    for (const [cascadeId, chatSummary] of Object.entries(
      chats.trajectorySummaries
    )) {
      if (chatSummary.trajectoryId !== trajectoryId) {
        continue
      }

      return await processChat(client, cascadeId)
    }
  }

  return null
}

async function processChat(
  client: PromisifiedClient<LanguageServerServiceClient>,
  cascadeId: string
): Promise<TraceData | null> {
  const chatDetails = await client.GetCascadeTrajectory({
    cascadeId,
  })

  const allPrompts: PromptItem[] = []
  const allInferences: string[] = []
  const steps = chatDetails.trajectory?.steps || []

  for (const step of steps) {
    const result = processChatStep(step)
    allPrompts.push(...result.prompts)
    allInferences.push(...result.inferences)
  }

  if (allInferences.length === 0) {
    return null
  }

  // Extract model from generator metadata
  const generatorMetadata = chatDetails.trajectory?.generatorMetadata || []
  const model =
    generatorMetadata.find((m) => m.chatModel?.modelUid)?.chatModel?.modelUid ||
    'unknown'

  // Extract responseTime from the last step's metadata
  const lastStep = steps[steps.length - 1]
  const completedAt = lastStep?.metadata?.completedAt
  const responseTime = completedAt?.seconds
    ? new Date(Number(completedAt.seconds) * 1000).toISOString()
    : new Date().toISOString()

  const repoOrigin =
    chatDetails.trajectory?.metadata?.workspaces?.[0]?.repository?.gitOriginUrl
  let repositoryUrl: string | undefined

  if (repoOrigin) {
    const parsed = parseScmURL(repoOrigin)
    if (
      parsed?.scmType === ScmType.GitHub ||
      parsed?.scmType === ScmType.GitLab
    ) {
      repositoryUrl = parsed.canonicalUrl
    }
  }

  return {
    prompts: allPrompts,
    inference: allInferences.join('\n'),
    model,
    tool: 'Windsurf Intellij',
    responseTime,
    sessionId: cascadeId,
    repositoryUrl,
  }
}

function processChatStep(step: CortexTrajectoryStep__Output): StepResult {
  switch (step.type) {
    case 'CORTEX_STEP_TYPE_USER_INPUT':
      return processChatStepUserInput(step)
    case 'CORTEX_STEP_TYPE_PLANNER_RESPONSE':
      return processChatStepPlannerResponse(step)
    case 'CORTEX_STEP_TYPE_CODE_ACTION':
      return processChatStepCodeAction(step)
    default:
      return { prompts: [], inferences: [] }
  }
}

function processChatStepUserInput(
  step: CortexTrajectoryStep__Output
): StepResult {
  const query = step.userInput?.query || step.userInput?.userResponse || ''

  if (!query) {
    return { prompts: [], inferences: [] }
  }

  return {
    prompts: [
      {
        type: 'USER_PROMPT',
        text: query,
        date: new Date(),
      },
    ],
    inferences: [],
  }
}

function processChatStepPlannerResponse(
  step: CortexTrajectoryStep__Output
): StepResult {
  const prompts: PromptItem[] = []
  const date = new Date()

  const text =
    step.plannerResponse?.response ||
    step.plannerResponse?.modifiedResponse ||
    ''

  if (text) {
    prompts.push({
      type: 'AI_RESPONSE',
      text,
      date,
    })
  }

  for (const toolCall of step.plannerResponse?.toolCalls || []) {
    prompts.push({
      type: 'TOOL_EXECUTION',
      date,
      tool: {
        name: toolCall.name,
        parameters: toolCall.argumentsJson,
        result: '',
        rawArguments: toolCall.argumentsJson,
        accepted: true,
      },
    })
  }

  return { prompts, inferences: [] }
}

function processChatStepCodeAction(
  step: CortexTrajectoryStep__Output
): StepResult {
  const inferences: string[] = []
  const toolCallName = step.metadata?.toolCall?.name
  const unifiedDiff = step.codeAction?.actionResult?.edit?.diff?.unifiedDiff

  // This is the way to distinguish between Windsurf and user edits.
  if (!toolCallName) {
    return { prompts: [], inferences }
  }

  if (!unifiedDiff) {
    return { prompts: [], inferences }
  }

  for (const line of unifiedDiff.lines) {
    if (line.type === 'UNIFIED_DIFF_LINE_TYPE_INSERT') {
      inferences.push(line.text)
    }
  }

  return { prompts: [], inferences }
}
