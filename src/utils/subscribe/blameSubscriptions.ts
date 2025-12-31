import { subscribeStream, WsOptions } from './subscribe'

// Re-export from subscribe to avoid clients needing to know implementation details
export type { WsOptions }

// Generic auth configuration that works across different contexts
export type AuthConfig =
  | {
      // Access token auth (e.g., web app / Auth0)
      accessToken: string
      mobbApiKey?: string
      isAdmin?: boolean
    }
  | {
      // API key auth (e.g., CLI / extensions)
      mobbApiKey: string
      accessToken?: string
      isAdmin?: boolean
    }

// Configuration for blame subscriptions
export type BlameSubscriptionConfig = {
  auth: AuthConfig
  graphqlEndpoint: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  websocketImpl?: typeof WebSocket | any // Allow any WebSocket implementation (browser WebSocket or Node.js ws)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proxyAgent?: any // Optional proxy agent for Node.js environments (HttpsProxyAgent | HttpProxyAgent)
}

// Base interface for blame request data (shared fields)
export type BlameRequestBase = {
  __typename?: string
  id: string // UUID (string when serialized)
  state: string // Blame_Ai_Analysis_Request_State_Enum value
  organizationId: string // UUID (string when serialized)
  createdOn: string // DateTime (ISO string when serialized)
}

// AI blame analysis request data structure (matches actual GraphQL response)
export type BlameAiAnalysisRequest = BlameRequestBase & {
  __typename?: 'blame_ai_analysis_request'
  commitId?: string | null // UUID (string when serialized)
}

// Commit blame request data structure (matches actual GraphQL response)
export type CommitBlameRequest = BlameRequestBase & {
  __typename?: 'commit_blame_request'
  repositoryUrl: string
  commitSha: string
  completedOn?: string | null // DateTime (ISO string when serialized)
  error?: string | null
}

// Subscription callback types with proper typing
export type SubscriptionCallbacks<
  TBlameAi = BlameAiAnalysisRequest[],
  TCommitBlame = CommitBlameRequest[],
> = {
  onSuccess?: () => void
  onError?: (error: string) => void
  onBlameAiUpdate?: (requests: TBlameAi) => void
  onCommitBlameUpdate?: (requests: TCommitBlame) => void
}

// Generic subscription arguments with proper typing
export type BlameSubscriptionArgs<
  TBlameAi = BlameAiAnalysisRequest[],
  TCommitBlame = CommitBlameRequest[],
> = {
  blameAiRequestIds: string[]
  commitBlameRequestIds: string[]
  config: BlameSubscriptionConfig
  callbacks: SubscriptionCallbacks<TBlameAi, TCommitBlame>
  // GraphQL documents - always required
  blameAiDocument: string
  commitBlameDocument: string
  // State values - same enum used for both types
  requestedState: string // The "requested" state value (same for both AI and commit blame)
  errorState: string // The "error" state value (same for both types)
}

/**
 * Generic subscription function for both blame_ai_analysis_request and commit_blame_request tables.
 * Monitors both subscriptions and only completes when ALL requests from BOTH tables are done.
 *
 * This is a generic version that can work across different projects by accepting external
 * configuration for GraphQL documents, endpoints, and authentication.
 */
export function subscribeToBlameRequests<
  TBlameAi = BlameAiAnalysisRequest[],
  TCommitBlame = CommitBlameRequest[],
>(args: BlameSubscriptionArgs<TBlameAi, TCommitBlame>): () => void {
  const {
    blameAiRequestIds,
    commitBlameRequestIds,
    config,
    callbacks,
    blameAiDocument,
    commitBlameDocument,
    requestedState,
    errorState,
  } = args

  const mobbApiKey = config.auth.mobbApiKey
  const accessToken = config.auth.accessToken

  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim() !== ''

  // Defensive guard: even though AuthConfig requires at least one auth method,
  // callers can still circumvent types (JS / any / casts). Fail fast rather
  // than silently sending `Authorization: Bearer undefined`.
  const hasMobbApiKey = isNonEmptyString(mobbApiKey)
  const hasAccessToken = isNonEmptyString(accessToken)

  if (!hasMobbApiKey && !hasAccessToken) {
    const message =
      'Missing auth: provide config.auth.mobbApiKey or config.auth.accessToken'
    callbacks.onError?.(message)
    return () => {
      // no-op; nothing to unsubscribe from
    }
  }

  // Track state of both subscriptions
  let blameAiCompleted = blameAiRequestIds.length === 0
  let commitBlameCompleted = commitBlameRequestIds.length === 0
  let hasError = false
  const errorMessages: string[] = []

  const addErrorMessage = (message: string) => {
    hasError = true
    if (!errorMessages.includes(message)) {
      errorMessages.push(message)
    }
  }

  // Store unsubscribe functions
  let unsubscribeBlameAi: (() => void) | null = null
  let unsubscribeCommitBlame: (() => void) | null = null

  // Helper to check if all subscriptions are complete
  const checkAllComplete = () => {
    if (blameAiCompleted && commitBlameCompleted) {
      if (hasError) {
        if (callbacks.onError) {
          callbacks.onError(errorMessages.join('\n'))
        }
      } else if (callbacks.onSuccess) {
        callbacks.onSuccess()
      }
      // Cleanup both subscriptions
      if (unsubscribeBlameAi) {
        unsubscribeBlameAi()
      }
      if (unsubscribeCommitBlame) {
        unsubscribeCommitBlame()
      }
    }
  }

  // If there are no request IDs, no subscriptions will be created.
  // Ensure we still resolve the caller via onSuccess/onError.
  checkAllComplete()

  // Build WebSocket options from config
  let wsOptions: WsOptions
  if (isNonEmptyString(mobbApiKey)) {
    wsOptions = {
      url: config.graphqlEndpoint,
      websocket: config.websocketImpl,
      proxyAgent: config.proxyAgent,
      isAdmin: false,
      isApiKey: true,
      apiKey: mobbApiKey,
    } as const
  } else if (isNonEmptyString(accessToken)) {
    wsOptions = {
      url: config.graphqlEndpoint,
      websocket: config.websocketImpl,
      proxyAgent: config.proxyAgent,
      isAdmin: false,
      isApiKey: false,
      accessToken,
    } as const
  } else {
    // This should be unreachable due to the earlier guard.
    const message =
      'Missing auth: provide config.auth.mobbApiKey or config.auth.accessToken'
    callbacks.onError?.(message)
    return () => {
      // no-op; nothing to unsubscribe from
    }
  }

  // Subscribe to blame_ai_analysis_request if needed
  if (blameAiRequestIds.length > 0) {
    const { unsubscribe } = subscribeStream<
      { blame_ai_analysis_request: BlameAiAnalysisRequest[] },
      { requestIds: string[] }
    >(
      blameAiDocument,
      { requestIds: blameAiRequestIds },
      {
        next: (newData) => {
          const requests = newData.blame_ai_analysis_request
          if (requests.length === 0) {
            return
          }

          // Call update callback
          if (callbacks.onBlameAiUpdate) {
            callbacks.onBlameAiUpdate(requests as TBlameAi)
          }

          // Check if all completed (using provided state enum)
          const allCompleted = requests.every(
            (req: BlameAiAnalysisRequest) => req.state !== requestedState
          )

          if (allCompleted) {
            const hasErrorState = requests.some(
              (req: BlameAiAnalysisRequest) => req.state === errorState
            )

            if (hasErrorState) {
              addErrorMessage('One or more AI blame analysis requests failed')
            }

            blameAiCompleted = true
            checkAllComplete()
          }
        },
        error: (error) => {
          const errorText =
            error instanceof Error ? error.message : 'Subscription error'
          addErrorMessage(`AI blame subscription error: ${errorText}`)
          blameAiCompleted = true
          checkAllComplete()
        },
      },
      wsOptions
    )

    unsubscribeBlameAi = unsubscribe
  }

  // Subscribe to commit_blame_request if needed
  if (commitBlameRequestIds.length > 0) {
    const { unsubscribe } = subscribeStream<
      { commit_blame_request: CommitBlameRequest[] },
      { requestIds: string[] }
    >(
      commitBlameDocument,
      { requestIds: commitBlameRequestIds },
      {
        next: (newData) => {
          const requests = newData.commit_blame_request
          if (requests.length === 0) {
            return
          }

          // Call update callback
          if (callbacks.onCommitBlameUpdate) {
            callbacks.onCommitBlameUpdate(requests as TCommitBlame)
          }

          // Check if all completed (using provided state enum)
          const allCompleted = requests.every(
            (req: CommitBlameRequest) => req.state !== requestedState
          )

          if (allCompleted) {
            const hasErrorState = requests.some(
              (req: CommitBlameRequest) => req.state === errorState
            )

            if (hasErrorState) {
              addErrorMessage('One or more commit blame requests failed')
            }

            commitBlameCompleted = true
            checkAllComplete()
          }
        },
        error: (error) => {
          const errorText =
            error instanceof Error ? error.message : 'Subscription error'
          addErrorMessage(`Commit blame subscription error: ${errorText}`)
          commitBlameCompleted = true
          checkAllComplete()
        },
      },
      wsOptions
    )

    unsubscribeCommitBlame = unsubscribe
  }

  // Return combined cleanup function
  return () => {
    if (unsubscribeBlameAi) {
      unsubscribeBlameAi()
    }
    if (unsubscribeCommitBlame) {
      unsubscribeCommitBlame()
    }
  }
}

/**
 * Simplified subscription function for only blame_ai_analysis_request table.
 * This is a convenience wrapper around the main function for cases that only need AI analysis.
 */
export function subscribeToBlameAiAnalysisRequests<
  TBlameAi = BlameAiAnalysisRequest[],
>(args: {
  requestIds: string[]
  config: BlameSubscriptionConfig
  callbacks: {
    onSuccess?: () => void
    onError?: (error: string) => void
    onUpdate?: (requests: TBlameAi) => void
  }
  blameAiDocument: string
  commitBlameDocument: string
  requestedState: string
  errorState: string
}): () => void {
  return subscribeToBlameRequests({
    blameAiRequestIds: args.requestIds,
    commitBlameRequestIds: [], // Empty array for commit requests
    config: args.config,
    callbacks: {
      onSuccess: args.callbacks.onSuccess,
      onError: args.callbacks.onError,
      onBlameAiUpdate: args.callbacks.onUpdate,
    },
    blameAiDocument: args.blameAiDocument,
    commitBlameDocument: args.commitBlameDocument,
    requestedState: args.requestedState,
    errorState: args.errorState,
  })
}
