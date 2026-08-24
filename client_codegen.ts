import { CodegenConfig } from '@graphql-codegen/cli'

// Schema types come from the shared, pre-dumped superset schema; this codegen
// emits only the CLI's operations and re-exports the shared base types so
// existing named imports from the generated barrel keep resolving. At publish
// time the shared types are inlined into the CLI (tsup bundle / OSS vendoring),
// so the shipped package stays self-contained — see scripts/publish_cli.sh.
const config: CodegenConfig = {
  schema: '../../tscommon/shared/src/gql/schema.graphql',
  documents: './src/schemas/client_schema.graphql',
  generates: {
    './src/features/analysis/scm/generates/client_generates.ts': {
      plugins: [
        { add: { content: "import * as Types from '@mobb/commonshared/base-types';" } },
        {
          add: {
            placement: 'append',
            content: "export * from '@mobb/commonshared/base-types';",
          },
        },
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        documentMode: 'string',
        namespacedImportName: 'Types',
      },
    },
  },
}

export default config
