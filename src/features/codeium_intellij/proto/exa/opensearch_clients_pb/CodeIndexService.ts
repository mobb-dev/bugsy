// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GraphSearchRequest as _exa_opensearch_clients_pb_GraphSearchRequest, GraphSearchRequest__Output as _exa_opensearch_clients_pb_GraphSearchRequest__Output } from '../../exa/opensearch_clients_pb/GraphSearchRequest';
import type { GraphSearchResponse as _exa_opensearch_clients_pb_GraphSearchResponse, GraphSearchResponse__Output as _exa_opensearch_clients_pb_GraphSearchResponse__Output } from '../../exa/opensearch_clients_pb/GraphSearchResponse';
import type { HybridSearchRequest as _exa_opensearch_clients_pb_HybridSearchRequest, HybridSearchRequest__Output as _exa_opensearch_clients_pb_HybridSearchRequest__Output } from '../../exa/opensearch_clients_pb/HybridSearchRequest';
import type { HybridSearchResponse as _exa_opensearch_clients_pb_HybridSearchResponse, HybridSearchResponse__Output as _exa_opensearch_clients_pb_HybridSearchResponse__Output } from '../../exa/opensearch_clients_pb/HybridSearchResponse';
import type { OpenSearchAddRepositoryRequest as _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, OpenSearchAddRepositoryRequest__Output as _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest__Output } from '../../exa/opensearch_clients_pb/OpenSearchAddRepositoryRequest';
import type { OpenSearchAddRepositoryResponse as _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse, OpenSearchAddRepositoryResponse__Output as _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output } from '../../exa/opensearch_clients_pb/OpenSearchAddRepositoryResponse';
import type { OpenSearchGetIndexRequest as _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, OpenSearchGetIndexRequest__Output as _exa_opensearch_clients_pb_OpenSearchGetIndexRequest__Output } from '../../exa/opensearch_clients_pb/OpenSearchGetIndexRequest';
import type { OpenSearchGetIndexResponse as _exa_opensearch_clients_pb_OpenSearchGetIndexResponse, OpenSearchGetIndexResponse__Output as _exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output } from '../../exa/opensearch_clients_pb/OpenSearchGetIndexResponse';

export interface CodeIndexServiceClient extends grpc.Client {
  GraphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  GraphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  GraphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  GraphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  graphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  graphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  graphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  graphSearch(argument: _exa_opensearch_clients_pb_GraphSearchRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_GraphSearchResponse__Output>): grpc.ClientUnaryCall;
  
  HybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  HybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  HybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  HybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  hybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  hybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  hybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  hybridSearch(argument: _exa_opensearch_clients_pb_HybridSearchRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_HybridSearchResponse__Output>): grpc.ClientUnaryCall;
  
  OpenSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  OpenSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  OpenSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  OpenSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  openSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  openSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  openSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  openSearchAddRepository(argument: _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>): grpc.ClientUnaryCall;
  
  OpenSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  OpenSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  OpenSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  OpenSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  openSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  openSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  openSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  openSearchGetIndex(argument: _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, callback: grpc.requestCallback<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface CodeIndexServiceHandlers extends grpc.UntypedServiceImplementation {
  GraphSearch: grpc.handleUnaryCall<_exa_opensearch_clients_pb_GraphSearchRequest__Output, _exa_opensearch_clients_pb_GraphSearchResponse>;
  
  HybridSearch: grpc.handleUnaryCall<_exa_opensearch_clients_pb_HybridSearchRequest__Output, _exa_opensearch_clients_pb_HybridSearchResponse>;
  
  OpenSearchAddRepository: grpc.handleUnaryCall<_exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest__Output, _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse>;
  
  OpenSearchGetIndex: grpc.handleUnaryCall<_exa_opensearch_clients_pb_OpenSearchGetIndexRequest__Output, _exa_opensearch_clients_pb_OpenSearchGetIndexResponse>;
  
}

export interface CodeIndexServiceDefinition extends grpc.ServiceDefinition {
  GraphSearch: MethodDefinition<_exa_opensearch_clients_pb_GraphSearchRequest, _exa_opensearch_clients_pb_GraphSearchResponse, _exa_opensearch_clients_pb_GraphSearchRequest__Output, _exa_opensearch_clients_pb_GraphSearchResponse__Output>
  HybridSearch: MethodDefinition<_exa_opensearch_clients_pb_HybridSearchRequest, _exa_opensearch_clients_pb_HybridSearchResponse, _exa_opensearch_clients_pb_HybridSearchRequest__Output, _exa_opensearch_clients_pb_HybridSearchResponse__Output>
  OpenSearchAddRepository: MethodDefinition<_exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse, _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest__Output, _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>
  OpenSearchGetIndex: MethodDefinition<_exa_opensearch_clients_pb_OpenSearchGetIndexRequest, _exa_opensearch_clients_pb_OpenSearchGetIndexResponse, _exa_opensearch_clients_pb_OpenSearchGetIndexRequest__Output, _exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>
}
