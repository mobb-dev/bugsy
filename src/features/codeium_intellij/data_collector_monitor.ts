import { setTimeout } from 'node:timers/promises'

import { uploadAiBlameHandlerFromExtension } from '../../args/commands/upload_ai_blame'
import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { AiBlameInferenceType } from '../../features/analysis/scm/generates/client_generates'
import { getLatestInferences, TraceData } from './data_collector'

const POLL_INTERVAL = 5 * 1000 // 5 sec

export async function startMonitoring() {
  // Authenticate user using existing CLI auth flow
  await getAuthenticatedGQLClient({ isSkipPrompts: true })

  let lastUpdateTs = new Date()

  for (;;) {
    let tracePayloads: TraceData[] = []

    try {
      const startFrom = lastUpdateTs

      lastUpdateTs = new Date()
      tracePayloads = await getLatestInferences(startFrom)
    } catch (e) {
      console.error('Failed to retrieve Windsurf IntelliJ inferences.', e)
    }

    for (const tracePayload of tracePayloads) {
      await tryUpload(tracePayload)
    }

    await setTimeout(POLL_INTERVAL)
  }
}

async function tryUpload(tracePayload: TraceData) {
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
