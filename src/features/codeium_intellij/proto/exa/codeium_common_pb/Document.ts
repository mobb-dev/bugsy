// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { DocumentPosition as _exa_codeium_common_pb_DocumentPosition, DocumentPosition__Output as _exa_codeium_common_pb_DocumentPosition__Output } from '../../exa/codeium_common_pb/DocumentPosition';
import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface Document {
  'absolutePathMigrateMeToUri'?: (string);
  'relativePathMigrateMeToWorkspaceUri'?: (string);
  'text'?: (string);
  'editorLanguage'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'cursorOffset'?: (number | string | Long);
  'lineEnding'?: (string);
  'cursorPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
  'visibleRange'?: (_exa_codeium_common_pb_Range | null);
  'isCutoffStart'?: (boolean);
  'isCutoffEnd'?: (boolean);
  'absoluteUri'?: (string);
  'workspaceUri'?: (string);
  'linesCutoffStart'?: (number);
  'linesCutoffEnd'?: (number);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'isDirty'?: (boolean);
  'isNotebook'?: (boolean);
  'lastAccessTime'?: (_google_protobuf_Timestamp | null);
  'selections'?: (_exa_codeium_common_pb_Range)[];
  'hash'?: (number | string | Long);
  '_hash'?: "hash";
}

export interface Document__Output {
  'absolutePathMigrateMeToUri': (string);
  'relativePathMigrateMeToWorkspaceUri': (string);
  'text': (string);
  'editorLanguage': (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'cursorOffset': (string);
  'lineEnding': (string);
  'cursorPosition': (_exa_codeium_common_pb_DocumentPosition__Output | null);
  'visibleRange': (_exa_codeium_common_pb_Range__Output | null);
  'isCutoffStart': (boolean);
  'isCutoffEnd': (boolean);
  'absoluteUri': (string);
  'workspaceUri': (string);
  'linesCutoffStart': (number);
  'linesCutoffEnd': (number);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'isDirty': (boolean);
  'isNotebook': (boolean);
  'lastAccessTime': (_google_protobuf_Timestamp__Output | null);
  'selections': (_exa_codeium_common_pb_Range__Output)[];
  'hash'?: (string);
  '_hash'?: "hash";
}
