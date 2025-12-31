import { describe, expect, it, vi } from 'vitest'

import { subscribeToBlameRequests } from '../blameSubscriptions'

type SubscriptionHandlers<T> = {
  next: (data: T) => void
  error: (error: unknown) => void
}

type SubscribeStreamCall = {
  query: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: SubscriptionHandlers<any>
  unsubscribe: ReturnType<typeof vi.fn>
}

const subscribeStreamCalls: SubscribeStreamCall[] = []

vi.mock('../subscribe', async () => {
  return {
    subscribeStream: vi.fn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (query: string, _variables: any, handlers: SubscriptionHandlers<any>) => {
        const unsubscribe = vi.fn()
        subscribeStreamCalls.push({ query, handlers, unsubscribe })
        return { unsubscribe }
      }
    ),
  }
})

describe('subscribeToBlameRequests', () => {
  it('calls onSuccess immediately when both request ID arrays are empty', () => {
    subscribeStreamCalls.length = 0

    const onError = vi.fn()
    const onSuccess = vi.fn()

    subscribeToBlameRequests({
      blameAiRequestIds: [],
      commitBlameRequestIds: [],
      config: {
        auth: { mobbApiKey: 'test-key' },
        graphqlEndpoint: 'ws://example',
      },
      callbacks: {
        onError,
        onSuccess,
      },
      blameAiDocument: 'blameAiDocument',
      commitBlameDocument: 'commitBlameDocument',
      requestedState: 'requested',
      errorState: 'error',
    })

    expect(subscribeStreamCalls).toHaveLength(0)
    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('aggregates AI blame + commit blame failures into a single onError message', () => {
    subscribeStreamCalls.length = 0

    const onError = vi.fn()
    const onSuccess = vi.fn()

    const blameAiDocument = 'blameAiDocument'
    const commitBlameDocument = 'commitBlameDocument'

    subscribeToBlameRequests({
      blameAiRequestIds: ['ai-1'],
      commitBlameRequestIds: ['commit-1'],
      config: {
        auth: { mobbApiKey: 'test-key' },
        graphqlEndpoint: 'ws://example',
      },
      callbacks: {
        onError,
        onSuccess,
      },
      blameAiDocument,
      commitBlameDocument,
      requestedState: 'requested',
      errorState: 'error',
    })

    expect(subscribeStreamCalls.map((c) => c.query).sort()).toEqual(
      [blameAiDocument, commitBlameDocument].sort()
    )

    const aiCall = subscribeStreamCalls.find((c) => c.query === blameAiDocument)
    const commitCall = subscribeStreamCalls.find(
      (c) => c.query === commitBlameDocument
    )
    expect(aiCall).toBeTruthy()
    expect(commitCall).toBeTruthy()

    // First: AI reports completion with error state
    aiCall!.handlers.next({
      blame_ai_analysis_request: [
        { id: 'ai-1', state: 'error', organizationId: 'org', createdOn: 'now' },
      ],
    })

    // Second: commit blame reports completion with error state
    commitCall!.handlers.next({
      commit_blame_request: [
        {
          id: 'commit-1',
          state: 'error',
          organizationId: 'org',
          createdOn: 'now',
          repositoryUrl: 'repo',
          commitSha: 'sha',
        },
      ],
    })

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)

    const message = onError.mock.calls[0]?.[0]
    expect(message).toContain('One or more AI blame analysis requests failed')
    expect(message).toContain('One or more commit blame requests failed')
  })

  it('unsubscribes even if cleanup runs before any subscription payload arrives', () => {
    subscribeStreamCalls.length = 0

    const onError = vi.fn()
    const onSuccess = vi.fn()

    const cleanup = subscribeToBlameRequests({
      blameAiRequestIds: ['ai-1'],
      commitBlameRequestIds: ['commit-1'],
      config: {
        auth: { mobbApiKey: 'test-key' },
        graphqlEndpoint: 'ws://example',
      },
      callbacks: {
        onError,
        onSuccess,
      },
      blameAiDocument: 'blameAiDocument',
      commitBlameDocument: 'commitBlameDocument',
      requestedState: 'requested',
      errorState: 'error',
    })

    const aiCall = subscribeStreamCalls.find(
      (c) => c.query === 'blameAiDocument'
    )
    const commitCall = subscribeStreamCalls.find(
      (c) => c.query === 'commitBlameDocument'
    )
    expect(aiCall).toBeTruthy()
    expect(commitCall).toBeTruthy()

    cleanup()

    expect(aiCall!.unsubscribe).toHaveBeenCalledTimes(1)
    expect(commitCall!.unsubscribe).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
