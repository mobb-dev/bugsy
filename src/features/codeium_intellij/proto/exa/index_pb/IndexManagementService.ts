// Original file: exa/index_pb/index.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AddIndexRequest as _exa_index_pb_AddIndexRequest, AddIndexRequest__Output as _exa_index_pb_AddIndexRequest__Output } from '../../exa/index_pb/AddIndexRequest';
import type { AddIndexResponse as _exa_index_pb_AddIndexResponse, AddIndexResponse__Output as _exa_index_pb_AddIndexResponse__Output } from '../../exa/index_pb/AddIndexResponse';
import type { AddRepositoryRequest as _exa_index_pb_AddRepositoryRequest, AddRepositoryRequest__Output as _exa_index_pb_AddRepositoryRequest__Output } from '../../exa/index_pb/AddRepositoryRequest';
import type { AddRepositoryResponse as _exa_index_pb_AddRepositoryResponse, AddRepositoryResponse__Output as _exa_index_pb_AddRepositoryResponse__Output } from '../../exa/index_pb/AddRepositoryResponse';
import type { CancelIndexingRequest as _exa_index_pb_CancelIndexingRequest, CancelIndexingRequest__Output as _exa_index_pb_CancelIndexingRequest__Output } from '../../exa/index_pb/CancelIndexingRequest';
import type { CancelIndexingResponse as _exa_index_pb_CancelIndexingResponse, CancelIndexingResponse__Output as _exa_index_pb_CancelIndexingResponse__Output } from '../../exa/index_pb/CancelIndexingResponse';
import type { DeleteIndexRequest as _exa_index_pb_DeleteIndexRequest, DeleteIndexRequest__Output as _exa_index_pb_DeleteIndexRequest__Output } from '../../exa/index_pb/DeleteIndexRequest';
import type { DeleteIndexResponse as _exa_index_pb_DeleteIndexResponse, DeleteIndexResponse__Output as _exa_index_pb_DeleteIndexResponse__Output } from '../../exa/index_pb/DeleteIndexResponse';
import type { DeleteRepositoryRequest as _exa_index_pb_DeleteRepositoryRequest, DeleteRepositoryRequest__Output as _exa_index_pb_DeleteRepositoryRequest__Output } from '../../exa/index_pb/DeleteRepositoryRequest';
import type { DeleteRepositoryResponse as _exa_index_pb_DeleteRepositoryResponse, DeleteRepositoryResponse__Output as _exa_index_pb_DeleteRepositoryResponse__Output } from '../../exa/index_pb/DeleteRepositoryResponse';
import type { DisableIndexingRequest as _exa_index_pb_DisableIndexingRequest, DisableIndexingRequest__Output as _exa_index_pb_DisableIndexingRequest__Output } from '../../exa/index_pb/DisableIndexingRequest';
import type { DisableIndexingResponse as _exa_index_pb_DisableIndexingResponse, DisableIndexingResponse__Output as _exa_index_pb_DisableIndexingResponse__Output } from '../../exa/index_pb/DisableIndexingResponse';
import type { EditRepositoryRequest as _exa_index_pb_EditRepositoryRequest, EditRepositoryRequest__Output as _exa_index_pb_EditRepositoryRequest__Output } from '../../exa/index_pb/EditRepositoryRequest';
import type { EditRepositoryResponse as _exa_index_pb_EditRepositoryResponse, EditRepositoryResponse__Output as _exa_index_pb_EditRepositoryResponse__Output } from '../../exa/index_pb/EditRepositoryResponse';
import type { EnableIndexingRequest as _exa_index_pb_EnableIndexingRequest, EnableIndexingRequest__Output as _exa_index_pb_EnableIndexingRequest__Output } from '../../exa/index_pb/EnableIndexingRequest';
import type { EnableIndexingResponse as _exa_index_pb_EnableIndexingResponse, EnableIndexingResponse__Output as _exa_index_pb_EnableIndexingResponse__Output } from '../../exa/index_pb/EnableIndexingResponse';
import type { GetConnectionsDebugInfoRequest as _exa_index_pb_GetConnectionsDebugInfoRequest, GetConnectionsDebugInfoRequest__Output as _exa_index_pb_GetConnectionsDebugInfoRequest__Output } from '../../exa/index_pb/GetConnectionsDebugInfoRequest';
import type { GetConnectionsDebugInfoResponse as _exa_index_pb_GetConnectionsDebugInfoResponse, GetConnectionsDebugInfoResponse__Output as _exa_index_pb_GetConnectionsDebugInfoResponse__Output } from '../../exa/index_pb/GetConnectionsDebugInfoResponse';
import type { GetDatabaseStatsRequest as _exa_index_pb_GetDatabaseStatsRequest, GetDatabaseStatsRequest__Output as _exa_index_pb_GetDatabaseStatsRequest__Output } from '../../exa/index_pb/GetDatabaseStatsRequest';
import type { GetDatabaseStatsResponse as _exa_index_pb_GetDatabaseStatsResponse, GetDatabaseStatsResponse__Output as _exa_index_pb_GetDatabaseStatsResponse__Output } from '../../exa/index_pb/GetDatabaseStatsResponse';
import type { GetIndexConfigRequest as _exa_index_pb_GetIndexConfigRequest, GetIndexConfigRequest__Output as _exa_index_pb_GetIndexConfigRequest__Output } from '../../exa/index_pb/GetIndexConfigRequest';
import type { GetIndexConfigResponse as _exa_index_pb_GetIndexConfigResponse, GetIndexConfigResponse__Output as _exa_index_pb_GetIndexConfigResponse__Output } from '../../exa/index_pb/GetIndexConfigResponse';
import type { GetIndexRequest as _exa_index_pb_GetIndexRequest, GetIndexRequest__Output as _exa_index_pb_GetIndexRequest__Output } from '../../exa/index_pb/GetIndexRequest';
import type { GetIndexResponse as _exa_index_pb_GetIndexResponse, GetIndexResponse__Output as _exa_index_pb_GetIndexResponse__Output } from '../../exa/index_pb/GetIndexResponse';
import type { GetIndexesRequest as _exa_index_pb_GetIndexesRequest, GetIndexesRequest__Output as _exa_index_pb_GetIndexesRequest__Output } from '../../exa/index_pb/GetIndexesRequest';
import type { GetIndexesResponse as _exa_index_pb_GetIndexesResponse, GetIndexesResponse__Output as _exa_index_pb_GetIndexesResponse__Output } from '../../exa/index_pb/GetIndexesResponse';
import type { GetNumberConnectionsRequest as _exa_index_pb_GetNumberConnectionsRequest, GetNumberConnectionsRequest__Output as _exa_index_pb_GetNumberConnectionsRequest__Output } from '../../exa/index_pb/GetNumberConnectionsRequest';
import type { GetNumberConnectionsResponse as _exa_index_pb_GetNumberConnectionsResponse, GetNumberConnectionsResponse__Output as _exa_index_pb_GetNumberConnectionsResponse__Output } from '../../exa/index_pb/GetNumberConnectionsResponse';
import type { GetRemoteIndexStatsRequest as _exa_index_pb_GetRemoteIndexStatsRequest, GetRemoteIndexStatsRequest__Output as _exa_index_pb_GetRemoteIndexStatsRequest__Output } from '../../exa/index_pb/GetRemoteIndexStatsRequest';
import type { GetRemoteIndexStatsResponse as _exa_index_pb_GetRemoteIndexStatsResponse, GetRemoteIndexStatsResponse__Output as _exa_index_pb_GetRemoteIndexStatsResponse__Output } from '../../exa/index_pb/GetRemoteIndexStatsResponse';
import type { GetRepositoriesRequest as _exa_index_pb_GetRepositoriesRequest, GetRepositoriesRequest__Output as _exa_index_pb_GetRepositoriesRequest__Output } from '../../exa/index_pb/GetRepositoriesRequest';
import type { GetRepositoriesResponse as _exa_index_pb_GetRepositoriesResponse, GetRepositoriesResponse__Output as _exa_index_pb_GetRepositoriesResponse__Output } from '../../exa/index_pb/GetRepositoriesResponse';
import type { PruneDatabaseRequest as _exa_index_pb_PruneDatabaseRequest, PruneDatabaseRequest__Output as _exa_index_pb_PruneDatabaseRequest__Output } from '../../exa/index_pb/PruneDatabaseRequest';
import type { PruneDatabaseResponse as _exa_index_pb_PruneDatabaseResponse, PruneDatabaseResponse__Output as _exa_index_pb_PruneDatabaseResponse__Output } from '../../exa/index_pb/PruneDatabaseResponse';
import type { RetryIndexingRequest as _exa_index_pb_RetryIndexingRequest, RetryIndexingRequest__Output as _exa_index_pb_RetryIndexingRequest__Output } from '../../exa/index_pb/RetryIndexingRequest';
import type { RetryIndexingResponse as _exa_index_pb_RetryIndexingResponse, RetryIndexingResponse__Output as _exa_index_pb_RetryIndexingResponse__Output } from '../../exa/index_pb/RetryIndexingResponse';
import type { SetIndexConfigRequest as _exa_index_pb_SetIndexConfigRequest, SetIndexConfigRequest__Output as _exa_index_pb_SetIndexConfigRequest__Output } from '../../exa/index_pb/SetIndexConfigRequest';
import type { SetIndexConfigResponse as _exa_index_pb_SetIndexConfigResponse, SetIndexConfigResponse__Output as _exa_index_pb_SetIndexConfigResponse__Output } from '../../exa/index_pb/SetIndexConfigResponse';

export interface IndexManagementServiceClient extends grpc.Client {
  AddIndex(argument: _exa_index_pb_AddIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  AddIndex(argument: _exa_index_pb_AddIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  AddIndex(argument: _exa_index_pb_AddIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  AddIndex(argument: _exa_index_pb_AddIndexRequest, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  addIndex(argument: _exa_index_pb_AddIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  addIndex(argument: _exa_index_pb_AddIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  addIndex(argument: _exa_index_pb_AddIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  addIndex(argument: _exa_index_pb_AddIndexRequest, callback: grpc.requestCallback<_exa_index_pb_AddIndexResponse__Output>): grpc.ClientUnaryCall;
  
  AddRepository(argument: _exa_index_pb_AddRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  AddRepository(argument: _exa_index_pb_AddRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  AddRepository(argument: _exa_index_pb_AddRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  AddRepository(argument: _exa_index_pb_AddRepositoryRequest, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  addRepository(argument: _exa_index_pb_AddRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  addRepository(argument: _exa_index_pb_AddRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  addRepository(argument: _exa_index_pb_AddRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  addRepository(argument: _exa_index_pb_AddRepositoryRequest, callback: grpc.requestCallback<_exa_index_pb_AddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  
  CancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  CancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  CancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  CancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  cancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  cancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  cancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  cancelIndexing(argument: _exa_index_pb_CancelIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_CancelIndexingResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteIndex(argument: _exa_index_pb_DeleteIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  DeleteIndex(argument: _exa_index_pb_DeleteIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  DeleteIndex(argument: _exa_index_pb_DeleteIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  DeleteIndex(argument: _exa_index_pb_DeleteIndexRequest, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  deleteIndex(argument: _exa_index_pb_DeleteIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  deleteIndex(argument: _exa_index_pb_DeleteIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  deleteIndex(argument: _exa_index_pb_DeleteIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  deleteIndex(argument: _exa_index_pb_DeleteIndexRequest, callback: grpc.requestCallback<_exa_index_pb_DeleteIndexResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  DeleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  DeleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  DeleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  deleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  deleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  deleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  deleteRepository(argument: _exa_index_pb_DeleteRepositoryRequest, callback: grpc.requestCallback<_exa_index_pb_DeleteRepositoryResponse__Output>): grpc.ClientUnaryCall;
  
  DisableIndexing(argument: _exa_index_pb_DisableIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  DisableIndexing(argument: _exa_index_pb_DisableIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  DisableIndexing(argument: _exa_index_pb_DisableIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  DisableIndexing(argument: _exa_index_pb_DisableIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  disableIndexing(argument: _exa_index_pb_DisableIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  disableIndexing(argument: _exa_index_pb_DisableIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  disableIndexing(argument: _exa_index_pb_DisableIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  disableIndexing(argument: _exa_index_pb_DisableIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_DisableIndexingResponse__Output>): grpc.ClientUnaryCall;
  
  EditRepository(argument: _exa_index_pb_EditRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  EditRepository(argument: _exa_index_pb_EditRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  EditRepository(argument: _exa_index_pb_EditRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  EditRepository(argument: _exa_index_pb_EditRepositoryRequest, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  editRepository(argument: _exa_index_pb_EditRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  editRepository(argument: _exa_index_pb_EditRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  editRepository(argument: _exa_index_pb_EditRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  editRepository(argument: _exa_index_pb_EditRepositoryRequest, callback: grpc.requestCallback<_exa_index_pb_EditRepositoryResponse__Output>): grpc.ClientUnaryCall;
  
  EnableIndexing(argument: _exa_index_pb_EnableIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  EnableIndexing(argument: _exa_index_pb_EnableIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  EnableIndexing(argument: _exa_index_pb_EnableIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  EnableIndexing(argument: _exa_index_pb_EnableIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  enableIndexing(argument: _exa_index_pb_EnableIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  enableIndexing(argument: _exa_index_pb_EnableIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  enableIndexing(argument: _exa_index_pb_EnableIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  enableIndexing(argument: _exa_index_pb_EnableIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_EnableIndexingResponse__Output>): grpc.ClientUnaryCall;
  
  GetConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  GetConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  GetConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  GetConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  getConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  getConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  getConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  getConnectionsDebugInfo(argument: _exa_index_pb_GetConnectionsDebugInfoRequest, callback: grpc.requestCallback<_exa_index_pb_GetConnectionsDebugInfoResponse__Output>): grpc.ClientUnaryCall;
  
  GetDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  GetDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  GetDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  GetDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  getDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  getDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  getDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  getDatabaseStats(argument: _exa_index_pb_GetDatabaseStatsRequest, callback: grpc.requestCallback<_exa_index_pb_GetDatabaseStatsResponse__Output>): grpc.ClientUnaryCall;
  
  GetIndex(argument: _exa_index_pb_GetIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  GetIndex(argument: _exa_index_pb_GetIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  GetIndex(argument: _exa_index_pb_GetIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  GetIndex(argument: _exa_index_pb_GetIndexRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  getIndex(argument: _exa_index_pb_GetIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  getIndex(argument: _exa_index_pb_GetIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  getIndex(argument: _exa_index_pb_GetIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  getIndex(argument: _exa_index_pb_GetIndexRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexResponse__Output>): grpc.ClientUnaryCall;
  
  GetIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  GetIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  GetIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  GetIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  getIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  getIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  getIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  getIndexConfig(argument: _exa_index_pb_GetIndexConfigRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  
  GetIndexes(argument: _exa_index_pb_GetIndexesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  GetIndexes(argument: _exa_index_pb_GetIndexesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  GetIndexes(argument: _exa_index_pb_GetIndexesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  GetIndexes(argument: _exa_index_pb_GetIndexesRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  getIndexes(argument: _exa_index_pb_GetIndexesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  getIndexes(argument: _exa_index_pb_GetIndexesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  getIndexes(argument: _exa_index_pb_GetIndexesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  getIndexes(argument: _exa_index_pb_GetIndexesRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexesResponse__Output>): grpc.ClientUnaryCall;
  
  GetNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  GetNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  GetNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  GetNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getNumberConnections(argument: _exa_index_pb_GetNumberConnectionsRequest, callback: grpc.requestCallback<_exa_index_pb_GetNumberConnectionsResponse__Output>): grpc.ClientUnaryCall;
  
  GetRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  GetRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  GetRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  GetRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  getRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  getRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  getRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  getRemoteIndexStats(argument: _exa_index_pb_GetRemoteIndexStatsRequest, callback: grpc.requestCallback<_exa_index_pb_GetRemoteIndexStatsResponse__Output>): grpc.ClientUnaryCall;
  
  GetRepositories(argument: _exa_index_pb_GetRepositoriesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  GetRepositories(argument: _exa_index_pb_GetRepositoriesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  GetRepositories(argument: _exa_index_pb_GetRepositoriesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  GetRepositories(argument: _exa_index_pb_GetRepositoriesRequest, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getRepositories(argument: _exa_index_pb_GetRepositoriesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getRepositories(argument: _exa_index_pb_GetRepositoriesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getRepositories(argument: _exa_index_pb_GetRepositoriesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getRepositories(argument: _exa_index_pb_GetRepositoriesRequest, callback: grpc.requestCallback<_exa_index_pb_GetRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  
  PruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  PruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  PruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  PruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  pruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  pruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  pruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  pruneDatabase(argument: _exa_index_pb_PruneDatabaseRequest, callback: grpc.requestCallback<_exa_index_pb_PruneDatabaseResponse__Output>): grpc.ClientUnaryCall;
  
  RetryIndexing(argument: _exa_index_pb_RetryIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  RetryIndexing(argument: _exa_index_pb_RetryIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  RetryIndexing(argument: _exa_index_pb_RetryIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  RetryIndexing(argument: _exa_index_pb_RetryIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  retryIndexing(argument: _exa_index_pb_RetryIndexingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  retryIndexing(argument: _exa_index_pb_RetryIndexingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  retryIndexing(argument: _exa_index_pb_RetryIndexingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  retryIndexing(argument: _exa_index_pb_RetryIndexingRequest, callback: grpc.requestCallback<_exa_index_pb_RetryIndexingResponse__Output>): grpc.ClientUnaryCall;
  
  SetIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  SetIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  SetIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  SetIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  setIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  setIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  setIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  setIndexConfig(argument: _exa_index_pb_SetIndexConfigRequest, callback: grpc.requestCallback<_exa_index_pb_SetIndexConfigResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface IndexManagementServiceHandlers extends grpc.UntypedServiceImplementation {
  AddIndex: grpc.handleUnaryCall<_exa_index_pb_AddIndexRequest__Output, _exa_index_pb_AddIndexResponse>;
  
  AddRepository: grpc.handleUnaryCall<_exa_index_pb_AddRepositoryRequest__Output, _exa_index_pb_AddRepositoryResponse>;
  
  CancelIndexing: grpc.handleUnaryCall<_exa_index_pb_CancelIndexingRequest__Output, _exa_index_pb_CancelIndexingResponse>;
  
  DeleteIndex: grpc.handleUnaryCall<_exa_index_pb_DeleteIndexRequest__Output, _exa_index_pb_DeleteIndexResponse>;
  
  DeleteRepository: grpc.handleUnaryCall<_exa_index_pb_DeleteRepositoryRequest__Output, _exa_index_pb_DeleteRepositoryResponse>;
  
  DisableIndexing: grpc.handleUnaryCall<_exa_index_pb_DisableIndexingRequest__Output, _exa_index_pb_DisableIndexingResponse>;
  
  EditRepository: grpc.handleUnaryCall<_exa_index_pb_EditRepositoryRequest__Output, _exa_index_pb_EditRepositoryResponse>;
  
  EnableIndexing: grpc.handleUnaryCall<_exa_index_pb_EnableIndexingRequest__Output, _exa_index_pb_EnableIndexingResponse>;
  
  GetConnectionsDebugInfo: grpc.handleUnaryCall<_exa_index_pb_GetConnectionsDebugInfoRequest__Output, _exa_index_pb_GetConnectionsDebugInfoResponse>;
  
  GetDatabaseStats: grpc.handleUnaryCall<_exa_index_pb_GetDatabaseStatsRequest__Output, _exa_index_pb_GetDatabaseStatsResponse>;
  
  GetIndex: grpc.handleUnaryCall<_exa_index_pb_GetIndexRequest__Output, _exa_index_pb_GetIndexResponse>;
  
  GetIndexConfig: grpc.handleUnaryCall<_exa_index_pb_GetIndexConfigRequest__Output, _exa_index_pb_GetIndexConfigResponse>;
  
  GetIndexes: grpc.handleUnaryCall<_exa_index_pb_GetIndexesRequest__Output, _exa_index_pb_GetIndexesResponse>;
  
  GetNumberConnections: grpc.handleUnaryCall<_exa_index_pb_GetNumberConnectionsRequest__Output, _exa_index_pb_GetNumberConnectionsResponse>;
  
  GetRemoteIndexStats: grpc.handleUnaryCall<_exa_index_pb_GetRemoteIndexStatsRequest__Output, _exa_index_pb_GetRemoteIndexStatsResponse>;
  
  GetRepositories: grpc.handleUnaryCall<_exa_index_pb_GetRepositoriesRequest__Output, _exa_index_pb_GetRepositoriesResponse>;
  
  PruneDatabase: grpc.handleUnaryCall<_exa_index_pb_PruneDatabaseRequest__Output, _exa_index_pb_PruneDatabaseResponse>;
  
  RetryIndexing: grpc.handleUnaryCall<_exa_index_pb_RetryIndexingRequest__Output, _exa_index_pb_RetryIndexingResponse>;
  
  SetIndexConfig: grpc.handleUnaryCall<_exa_index_pb_SetIndexConfigRequest__Output, _exa_index_pb_SetIndexConfigResponse>;
  
}

export interface IndexManagementServiceDefinition extends grpc.ServiceDefinition {
  AddIndex: MethodDefinition<_exa_index_pb_AddIndexRequest, _exa_index_pb_AddIndexResponse, _exa_index_pb_AddIndexRequest__Output, _exa_index_pb_AddIndexResponse__Output>
  AddRepository: MethodDefinition<_exa_index_pb_AddRepositoryRequest, _exa_index_pb_AddRepositoryResponse, _exa_index_pb_AddRepositoryRequest__Output, _exa_index_pb_AddRepositoryResponse__Output>
  CancelIndexing: MethodDefinition<_exa_index_pb_CancelIndexingRequest, _exa_index_pb_CancelIndexingResponse, _exa_index_pb_CancelIndexingRequest__Output, _exa_index_pb_CancelIndexingResponse__Output>
  DeleteIndex: MethodDefinition<_exa_index_pb_DeleteIndexRequest, _exa_index_pb_DeleteIndexResponse, _exa_index_pb_DeleteIndexRequest__Output, _exa_index_pb_DeleteIndexResponse__Output>
  DeleteRepository: MethodDefinition<_exa_index_pb_DeleteRepositoryRequest, _exa_index_pb_DeleteRepositoryResponse, _exa_index_pb_DeleteRepositoryRequest__Output, _exa_index_pb_DeleteRepositoryResponse__Output>
  DisableIndexing: MethodDefinition<_exa_index_pb_DisableIndexingRequest, _exa_index_pb_DisableIndexingResponse, _exa_index_pb_DisableIndexingRequest__Output, _exa_index_pb_DisableIndexingResponse__Output>
  EditRepository: MethodDefinition<_exa_index_pb_EditRepositoryRequest, _exa_index_pb_EditRepositoryResponse, _exa_index_pb_EditRepositoryRequest__Output, _exa_index_pb_EditRepositoryResponse__Output>
  EnableIndexing: MethodDefinition<_exa_index_pb_EnableIndexingRequest, _exa_index_pb_EnableIndexingResponse, _exa_index_pb_EnableIndexingRequest__Output, _exa_index_pb_EnableIndexingResponse__Output>
  GetConnectionsDebugInfo: MethodDefinition<_exa_index_pb_GetConnectionsDebugInfoRequest, _exa_index_pb_GetConnectionsDebugInfoResponse, _exa_index_pb_GetConnectionsDebugInfoRequest__Output, _exa_index_pb_GetConnectionsDebugInfoResponse__Output>
  GetDatabaseStats: MethodDefinition<_exa_index_pb_GetDatabaseStatsRequest, _exa_index_pb_GetDatabaseStatsResponse, _exa_index_pb_GetDatabaseStatsRequest__Output, _exa_index_pb_GetDatabaseStatsResponse__Output>
  GetIndex: MethodDefinition<_exa_index_pb_GetIndexRequest, _exa_index_pb_GetIndexResponse, _exa_index_pb_GetIndexRequest__Output, _exa_index_pb_GetIndexResponse__Output>
  GetIndexConfig: MethodDefinition<_exa_index_pb_GetIndexConfigRequest, _exa_index_pb_GetIndexConfigResponse, _exa_index_pb_GetIndexConfigRequest__Output, _exa_index_pb_GetIndexConfigResponse__Output>
  GetIndexes: MethodDefinition<_exa_index_pb_GetIndexesRequest, _exa_index_pb_GetIndexesResponse, _exa_index_pb_GetIndexesRequest__Output, _exa_index_pb_GetIndexesResponse__Output>
  GetNumberConnections: MethodDefinition<_exa_index_pb_GetNumberConnectionsRequest, _exa_index_pb_GetNumberConnectionsResponse, _exa_index_pb_GetNumberConnectionsRequest__Output, _exa_index_pb_GetNumberConnectionsResponse__Output>
  GetRemoteIndexStats: MethodDefinition<_exa_index_pb_GetRemoteIndexStatsRequest, _exa_index_pb_GetRemoteIndexStatsResponse, _exa_index_pb_GetRemoteIndexStatsRequest__Output, _exa_index_pb_GetRemoteIndexStatsResponse__Output>
  GetRepositories: MethodDefinition<_exa_index_pb_GetRepositoriesRequest, _exa_index_pb_GetRepositoriesResponse, _exa_index_pb_GetRepositoriesRequest__Output, _exa_index_pb_GetRepositoriesResponse__Output>
  PruneDatabase: MethodDefinition<_exa_index_pb_PruneDatabaseRequest, _exa_index_pb_PruneDatabaseResponse, _exa_index_pb_PruneDatabaseRequest__Output, _exa_index_pb_PruneDatabaseResponse__Output>
  RetryIndexing: MethodDefinition<_exa_index_pb_RetryIndexingRequest, _exa_index_pb_RetryIndexingResponse, _exa_index_pb_RetryIndexingRequest__Output, _exa_index_pb_RetryIndexingResponse__Output>
  SetIndexConfig: MethodDefinition<_exa_index_pb_SetIndexConfigRequest, _exa_index_pb_SetIndexConfigResponse, _exa_index_pb_SetIndexConfigRequest__Output, _exa_index_pb_SetIndexConfigResponse__Output>
}
