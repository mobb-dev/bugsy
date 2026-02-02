// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ChatMessagePrompt as _exa_chat_pb_ChatMessagePrompt, ChatMessagePrompt__Output as _exa_chat_pb_ChatMessagePrompt__Output } from '../../exa/chat_pb/ChatMessagePrompt';
import type { TimeRange as _exa_opensearch_clients_pb_TimeRange, TimeRange__Output as _exa_opensearch_clients_pb_TimeRange__Output } from '../../exa/opensearch_clients_pb/TimeRange';
import type { IndexChoice as _exa_codeium_common_pb_IndexChoice, IndexChoice__Output as _exa_codeium_common_pb_IndexChoice__Output } from '../../exa/codeium_common_pb/IndexChoice';
import type { SearchMode as _exa_opensearch_clients_pb_SearchMode, SearchMode__Output as _exa_opensearch_clients_pb_SearchMode__Output } from '../../exa/opensearch_clients_pb/SearchMode';
import type { DocumentType as _exa_codeium_common_pb_DocumentType, DocumentType__Output as _exa_codeium_common_pb_DocumentType__Output } from '../../exa/codeium_common_pb/DocumentType';
import type { Long } from '@grpc/proto-loader';

export interface KnowledgeBaseSearchRequest {
  'query'?: (string);
  'maxResults'?: (number | string | Long);
  'queries'?: (string)[];
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'aggregateIds'?: (string)[];
  'chatMessagePrompts'?: (_exa_chat_pb_ChatMessagePrompt)[];
  'timeRange'?: (_exa_opensearch_clients_pb_TimeRange | null);
  'indexChoices'?: (_exa_codeium_common_pb_IndexChoice)[];
  'searchMode'?: (_exa_opensearch_clients_pb_SearchMode);
  'disableReranking'?: (boolean);
  'disableContextualLookup'?: (boolean);
  'urls'?: (string)[];
  'documentIds'?: (string)[];
  'documentTypes'?: (_exa_codeium_common_pb_DocumentType)[];
}

export interface KnowledgeBaseSearchRequest__Output {
  'query': (string);
  'maxResults': (string);
  'queries': (string)[];
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'aggregateIds': (string)[];
  'chatMessagePrompts': (_exa_chat_pb_ChatMessagePrompt__Output)[];
  'timeRange': (_exa_opensearch_clients_pb_TimeRange__Output | null);
  'indexChoices': (_exa_codeium_common_pb_IndexChoice__Output)[];
  'searchMode': (_exa_opensearch_clients_pb_SearchMode__Output);
  'disableReranking': (boolean);
  'disableContextualLookup': (boolean);
  'urls': (string)[];
  'documentIds': (string)[];
  'documentTypes': (_exa_codeium_common_pb_DocumentType__Output)[];
}
