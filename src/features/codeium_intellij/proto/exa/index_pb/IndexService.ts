// Original file: exa/index_pb/index.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetEmbeddingsForCodeContextItemsRequest as _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, GetEmbeddingsForCodeContextItemsRequest__Output as _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest__Output } from '../../exa/index_pb/GetEmbeddingsForCodeContextItemsRequest';
import type { GetEmbeddingsForCodeContextItemsResponse as _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse, GetEmbeddingsForCodeContextItemsResponse__Output as _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output } from '../../exa/index_pb/GetEmbeddingsForCodeContextItemsResponse';
import type { GetIndexedRepositoriesRequest as _exa_index_pb_GetIndexedRepositoriesRequest, GetIndexedRepositoriesRequest__Output as _exa_index_pb_GetIndexedRepositoriesRequest__Output } from '../../exa/index_pb/GetIndexedRepositoriesRequest';
import type { GetIndexedRepositoriesResponse as _exa_index_pb_GetIndexedRepositoriesResponse, GetIndexedRepositoriesResponse__Output as _exa_index_pb_GetIndexedRepositoriesResponse__Output } from '../../exa/index_pb/GetIndexedRepositoriesResponse';
import type { GetMatchingFilePathsRequest as _exa_index_pb_GetMatchingFilePathsRequest, GetMatchingFilePathsRequest__Output as _exa_index_pb_GetMatchingFilePathsRequest__Output } from '../../exa/index_pb/GetMatchingFilePathsRequest';
import type { GetMatchingFilePathsResponse as _exa_index_pb_GetMatchingFilePathsResponse, GetMatchingFilePathsResponse__Output as _exa_index_pb_GetMatchingFilePathsResponse__Output } from '../../exa/index_pb/GetMatchingFilePathsResponse';
import type { GetNearestCCIsFromEmbeddingRequest as _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, GetNearestCCIsFromEmbeddingRequest__Output as _exa_index_pb_GetNearestCCIsFromEmbeddingRequest__Output } from '../../exa/index_pb/GetNearestCCIsFromEmbeddingRequest';
import type { GetNearestCCIsFromEmbeddingResponse as _exa_index_pb_GetNearestCCIsFromEmbeddingResponse, GetNearestCCIsFromEmbeddingResponse__Output as _exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output } from '../../exa/index_pb/GetNearestCCIsFromEmbeddingResponse';

export interface IndexServiceClient extends grpc.Client {
  GetEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  GetEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  GetEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  GetEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  getEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  getEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  getEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  getEmbeddingsForCodeContextItems(argument: _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, callback: grpc.requestCallback<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>): grpc.ClientUnaryCall;
  
  GetIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  GetIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  GetIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  GetIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  getIndexedRepositories(argument: _exa_index_pb_GetIndexedRepositoriesRequest, callback: grpc.requestCallback<_exa_index_pb_GetIndexedRepositoriesResponse__Output>): grpc.ClientUnaryCall;
  
  GetMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  GetMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  GetMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  GetMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  getMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  getMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  getMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  getMatchingFilePaths(argument: _exa_index_pb_GetMatchingFilePathsRequest, callback: grpc.requestCallback<_exa_index_pb_GetMatchingFilePathsResponse__Output>): grpc.ClientUnaryCall;
  
  GetNearestCCIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  GetNearestCCIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  GetNearestCCIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  GetNearestCCIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  getNearestCcIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  getNearestCcIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  getNearestCcIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  getNearestCcIsFromEmbedding(argument: _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, callback: grpc.requestCallback<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface IndexServiceHandlers extends grpc.UntypedServiceImplementation {
  GetEmbeddingsForCodeContextItems: grpc.handleUnaryCall<_exa_index_pb_GetEmbeddingsForCodeContextItemsRequest__Output, _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse>;
  
  GetIndexedRepositories: grpc.handleUnaryCall<_exa_index_pb_GetIndexedRepositoriesRequest__Output, _exa_index_pb_GetIndexedRepositoriesResponse>;
  
  GetMatchingFilePaths: grpc.handleUnaryCall<_exa_index_pb_GetMatchingFilePathsRequest__Output, _exa_index_pb_GetMatchingFilePathsResponse>;
  
  GetNearestCCIsFromEmbedding: grpc.handleUnaryCall<_exa_index_pb_GetNearestCCIsFromEmbeddingRequest__Output, _exa_index_pb_GetNearestCCIsFromEmbeddingResponse>;
  
}

export interface IndexServiceDefinition extends grpc.ServiceDefinition {
  GetEmbeddingsForCodeContextItems: MethodDefinition<_exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse, _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest__Output, _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>
  GetIndexedRepositories: MethodDefinition<_exa_index_pb_GetIndexedRepositoriesRequest, _exa_index_pb_GetIndexedRepositoriesResponse, _exa_index_pb_GetIndexedRepositoriesRequest__Output, _exa_index_pb_GetIndexedRepositoriesResponse__Output>
  GetMatchingFilePaths: MethodDefinition<_exa_index_pb_GetMatchingFilePathsRequest, _exa_index_pb_GetMatchingFilePathsResponse, _exa_index_pb_GetMatchingFilePathsRequest__Output, _exa_index_pb_GetMatchingFilePathsResponse__Output>
  GetNearestCCIsFromEmbedding: MethodDefinition<_exa_index_pb_GetNearestCCIsFromEmbeddingRequest, _exa_index_pb_GetNearestCCIsFromEmbeddingResponse, _exa_index_pb_GetNearestCCIsFromEmbeddingRequest__Output, _exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>
}
