import Configstore from 'configstore'
import { Argv } from 'yargs'

import { handleMobbLogin } from '../../commands/handleMobbLogin'
import { GQLClient } from '../../features/analysis/graphql'
import { processAndUploadHookData } from '../../features/claude_code/data_collector'
import { installMobbHooks } from '../../features/claude_code/install_hook'
import { packageJson } from '../../utils'

const config = new Configstore(packageJson.name, { apiToken: '' })

export const claudeCodeInstallHookBuilder = (yargs: Argv) => {
  return yargs
    .option('save-env', {
      type: 'boolean',
      description:
        'Save WEB_LOGIN_URL, WEB_APP_URL, and API_URL environment variables to hooks config',
      default: false,
    })
    .example(
      '$0 claude-code-install-hook',
      'Install Claude Code hooks for data collection'
    )
    .example(
      '$0 claude-code-install-hook --save-env',
      'Install hooks and save environment variables to config'
    )
    .strict()
}

export const claudeCodeProcessHookBuilder = (yargs: Argv) => {
  return yargs
    .example(
      '$0 claude-code-process-hook',
      'Process Claude Code hook data and upload to backend'
    )
    .strict()
}

/**
 * Handler for the claude-code-install-hook command - installs hooks in Claude Code settings
 */
export const claudeCodeInstallHookHandler = async (argv: {
  'save-env': boolean
}) => {
  try {
    // Authenticate user using existing CLI auth flow
    const gqlClient = new GQLClient({
      apiKey: config.get('apiToken') ?? '',
      type: 'apiKey',
    })

    await handleMobbLogin({
      inGqlClient: gqlClient,
      skipPrompts: false,
    })

    // Install the hooks
    await installMobbHooks({ saveEnv: argv['save-env'] })

    process.exit(0)
  } catch (error) {
    console.error('Failed to install Claude Code hooks:', error)
    process.exit(1)
  }
}

/**
 * Handler for the claude-code-process-hook command - processes stdin hook data and uploads traces
 */
export const claudeCodeProcessHookHandler = async () => {
  try {
    // Process hook data and upload to backend
    const { hookData, inference, tracePayload, uploadSuccess } =
      await processAndUploadHookData()

    // Log the extracted data
    console.log('Successfully processed Claude Code hook:')
    console.log('Session ID:', hookData.session_id)
    console.log('Tool:', hookData.tool_name)
    console.log('Transcript path:', hookData.transcript_path)
    console.log('Inference length:', inference.length)

    // Count prompt types from trace payload
    const userPrompts = tracePayload.prompts.filter(
      (p) => p.type === 'USER_PROMPT'
    )
    const assistantResponses = tracePayload.prompts.filter(
      (p) => p.type === 'AI_RESPONSE'
    )
    const aiThinking = tracePayload.prompts.filter(
      (p) => p.type === 'AI_THINKING'
    )

    console.log('Conversation context extracted:')
    console.log('- User prompts:', userPrompts.length)
    console.log('- Assistant responses:', assistantResponses.length)
    console.log('- AI thinking entries:', aiThinking.length)
    console.log('- Model:', tracePayload.model)

    // Calculate total tokens from prompts
    const totalInputTokens = tracePayload.prompts.reduce(
      (sum, p) => sum + (p.tokens?.inputCount || 0),
      0
    )
    const totalOutputTokens = tracePayload.prompts.reduce(
      (sum, p) => sum + (p.tokens?.outputCount || 0),
      0
    )
    console.log('- Input tokens:', totalInputTokens)
    console.log('- Output tokens:', totalOutputTokens)

    // Log trace formatting and upload status
    console.log('Trace data formatted:')
    console.log('- Prompt items:', tracePayload.prompts.length)
    console.log('- Model:', tracePayload.model)
    console.log('- Tool:', tracePayload.tool)
    console.log('- Response time:', tracePayload.responseTime)
    console.log('- Upload success:', uploadSuccess ? '✅' : '❌')

    if (uploadSuccess) {
      console.log('✅ Claude Code trace uploaded successfully to Mobb backend')
    }

    process.exit(0)
  } catch (error) {
    console.error('Failed to process Claude Code hook data:', error)
    process.exit(1)
  }
}
