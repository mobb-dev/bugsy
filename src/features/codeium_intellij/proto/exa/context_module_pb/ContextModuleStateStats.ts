// Original file: exa/context_module_pb/context_module.proto

import type { Long } from '@grpc/proto-loader';

export interface ContextModuleStateStats {
  'cciPerSourceBytes'?: (number | string | Long);
  'activeDocumentBytes'?: (number | string | Long);
  'otherOpenDocumentsBytes'?: (number | string | Long);
}

export interface ContextModuleStateStats__Output {
  'cciPerSourceBytes': (string);
  'activeDocumentBytes': (string);
  'otherOpenDocumentsBytes': (string);
}
