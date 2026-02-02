// Original file: exa/context_module_pb/context_module.proto

import type { Long } from '@grpc/proto-loader';

export interface CodeContextItemIndexStats {
  'allCcisBytes'?: (number | string | Long);
  'numCcisTracked'?: (number | string | Long);
  'termFrequencyMapBytes'?: (number | string | Long);
  'numTermsTracked'?: (number | string | Long);
  'fileToCciMapBytes'?: (number | string | Long);
  'numFilesTracked'?: (number | string | Long);
  'lastModifiedBytes'?: (number | string | Long);
  'hashMapBytes'?: (number | string | Long);
}

export interface CodeContextItemIndexStats__Output {
  'allCcisBytes': (string);
  'numCcisTracked': (string);
  'termFrequencyMapBytes': (string);
  'numTermsTracked': (string);
  'fileToCciMapBytes': (string);
  'numFilesTracked': (string);
  'lastModifiedBytes': (string);
  'hashMapBytes': (string);
}
