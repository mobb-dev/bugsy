// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface EditorOptions {
  'tabSize'?: (number | string | Long);
  'insertSpaces'?: (boolean);
  'disableAutocompleteInComments'?: (boolean);
}

export interface EditorOptions__Output {
  'tabSize': (string);
  'insertSpaces': (boolean);
  'disableAutocompleteInComments': (boolean);
}
