import crypto from 'crypto'
import { graphql, HttpResponse } from 'msw'

import type {
  CreateCliLoginMutation,
  CreateCliLoginMutationVariables,
  GetEncryptedApiTokenQuery,
  GetEncryptedApiTokenQueryVariables,
} from '../../../../src/features/analysis/scm/generates/client_generates'

// Define types for mock state
type MockState = {
  createCliLogin?: 'success' | 'error'
  getEncryptedApiToken?: 'success' | 'error'
}

// Shared state to store public keys by login ID
const publicKeyStore: Record<string, string> = {}

// Reference to the mock state from graphqlHandlers.ts
// This will be set by the exported setup function
let mockStateRef: MockState | null = null
let mockErrorMessagesRef: Record<string, string> | null = null

export function setupAuthHandlers(
  mockState: MockState,
  errorMessages: Record<string, string>
) {
  mockStateRef = mockState
  mockErrorMessagesRef = errorMessages
}

// Mock API token that will be encrypted
const API_TOKEN = 'mobb_test_api_token_123456'

// Error mock functions
export const mockCreateCliLoginError = (message: string) => ({
  data: null,
  errors: [
    {
      message,
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
  ],
})

export const mockGetEncryptedApiTokenError = (message: string) => ({
  data: null,
  errors: [
    {
      message,
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
  ],
})

// Handler for creating CLI login
export const createCliLoginHandler = graphql.mutation<
  CreateCliLoginMutation,
  CreateCliLoginMutationVariables
>('CreateCliLogin', ({ variables }) => {
  if (mockStateRef?.createCliLogin === 'error') {
    return HttpResponse.json(
      mockCreateCliLoginError(
        mockErrorMessagesRef?.['createCliLogin'] || 'Create CLI Login Error'
      ),
      { status: 500 }
    )
  }

  const loginId = 'cli_login_123'

  // Store the public key for later use
  if (variables.publicKey) {
    publicKeyStore[loginId] = variables.publicKey
  }

  return HttpResponse.json({
    data: {
      __typename: 'mutation_root',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      insert_cli_login_one: {
        __typename: 'cli_login',
        id: loginId,
      },
    },
  })
})

// Handler for getting encrypted API token
export const getEncryptedApiTokenHandler = graphql.query<
  GetEncryptedApiTokenQuery,
  GetEncryptedApiTokenQueryVariables
>('GetEncryptedApiToken', ({ variables }) => {
  if (mockStateRef?.getEncryptedApiToken === 'error') {
    return HttpResponse.json(
      mockGetEncryptedApiTokenError(
        mockErrorMessagesRef?.['getEncryptedApiToken'] || 'Get Token Error'
      ),
      { status: 500 }
    )
  }

  const { loginId } = variables
  const publicKey = publicKeyStore[loginId.toString()]

  if (!publicKey) {
    return HttpResponse.json({
      data: {
        __typename: 'query_root',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        cli_login_by_pk: null,
      },
    })
  }

  try {
    // Encrypt the API token with the stored public key
    const encryptedToken = crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(API_TOKEN)
      )
      .toString('base64')

    return HttpResponse.json({
      data: {
        __typename: 'query_root',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        cli_login_by_pk: {
          __typename: 'cli_login',
          encryptedApiToken: encryptedToken,
        },
      },
    })
  } catch (error: unknown) {
    console.error('Encryption error:', error)
    return HttpResponse.json({
      data: null,
      errors: [
        {
          message: `Error encrypting token: ${error instanceof Error ? error.message : String(error)}`,
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        },
      ],
    })
  }
})
