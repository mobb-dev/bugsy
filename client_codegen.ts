import { CodegenConfig } from '@graphql-codegen/cli'

import { HASURA_ACCESS_KEY, LOCAL_GRAPHQL_ENDPOINT } from './src/constants'

const config: CodegenConfig = {
  schema: {
    [LOCAL_GRAPHQL_ENDPOINT]: {
      headers: { 'x-hasura-admin-secret': HASURA_ACCESS_KEY },
    },
  },
  documents: './src/schemas/client_schema.graphql',
  generates: {
    './src/features/analysis/scm/generates/client_generates.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        documentMode: 'string',
      },
    },
  },
}

export default config
