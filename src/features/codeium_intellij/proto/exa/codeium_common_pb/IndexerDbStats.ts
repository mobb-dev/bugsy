// Original file: exa/codeium_common_pb/codeium_common.proto

import type { LocalSqliteFaissDbStats as _exa_codeium_common_pb_LocalSqliteFaissDbStats, LocalSqliteFaissDbStats__Output as _exa_codeium_common_pb_LocalSqliteFaissDbStats__Output } from '../../exa/codeium_common_pb/LocalSqliteFaissDbStats';
import type { PostgresDbStats as _exa_codeium_common_pb_PostgresDbStats, PostgresDbStats__Output as _exa_codeium_common_pb_PostgresDbStats__Output } from '../../exa/codeium_common_pb/PostgresDbStats';

export interface IndexerDbStats {
  'localSqliteFaiss'?: (_exa_codeium_common_pb_LocalSqliteFaissDbStats | null);
  'postgres'?: (_exa_codeium_common_pb_PostgresDbStats | null);
  'backend'?: "localSqliteFaiss"|"postgres";
}

export interface IndexerDbStats__Output {
  'localSqliteFaiss'?: (_exa_codeium_common_pb_LocalSqliteFaissDbStats__Output | null);
  'postgres'?: (_exa_codeium_common_pb_PostgresDbStats__Output | null);
  'backend'?: "localSqliteFaiss"|"postgres";
}
