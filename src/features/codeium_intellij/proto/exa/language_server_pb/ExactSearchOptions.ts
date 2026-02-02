// Original file: exa/language_server_pb/language_server.proto

import type { ExactSearchPreviewOptions as _exa_language_server_pb_ExactSearchPreviewOptions, ExactSearchPreviewOptions__Output as _exa_language_server_pb_ExactSearchPreviewOptions__Output } from '../../exa/language_server_pb/ExactSearchPreviewOptions';

export interface ExactSearchOptions {
  'folder'?: (string);
  'includes'?: (string)[];
  'excludes'?: (string)[];
  'disregardIgnoreFiles'?: (boolean);
  'followSymlinks'?: (boolean);
  'disregardGlobalIgnoreFiles'?: (boolean);
  'disregardParentIgnoreFiles'?: (boolean);
  'maxFileSize'?: (number);
  'encoding'?: (string);
  'beforeContextLines'?: (number);
  'afterContextLines'?: (number);
  'maxResults'?: (number);
  'previewOptions'?: (_exa_language_server_pb_ExactSearchPreviewOptions | null);
}

export interface ExactSearchOptions__Output {
  'folder': (string);
  'includes': (string)[];
  'excludes': (string)[];
  'disregardIgnoreFiles': (boolean);
  'followSymlinks': (boolean);
  'disregardGlobalIgnoreFiles': (boolean);
  'disregardParentIgnoreFiles': (boolean);
  'maxFileSize': (number);
  'encoding': (string);
  'beforeContextLines': (number);
  'afterContextLines': (number);
  'maxResults': (number);
  'previewOptions': (_exa_language_server_pb_ExactSearchPreviewOptions__Output | null);
}
