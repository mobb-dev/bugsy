// Original file: exa/context_module_pb/context_module.proto

import type { RetrievedCodeContextItemMetadata as _exa_context_module_pb_RetrievedCodeContextItemMetadata, RetrievedCodeContextItemMetadata__Output as _exa_context_module_pb_RetrievedCodeContextItemMetadata__Output } from '../../exa/context_module_pb/RetrievedCodeContextItemMetadata';

export interface FileNameWithRetrievalMetadata {
  'absoluteUri'?: (string);
  'metadata'?: (_exa_context_module_pb_RetrievedCodeContextItemMetadata | null);
}

export interface FileNameWithRetrievalMetadata__Output {
  'absoluteUri': (string);
  'metadata': (_exa_context_module_pb_RetrievedCodeContextItemMetadata__Output | null);
}
