// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface BrowserPageMetadata {
  'url'?: (string);
  'pageId'?: (string);
  'pageTitle'?: (string);
  'viewportWidth'?: (number);
  'viewportHeight'?: (number);
  'faviconUrl'?: (string);
  'lastVisitedTime'?: (_google_protobuf_Timestamp | null);
}

export interface BrowserPageMetadata__Output {
  'url': (string);
  'pageId': (string);
  'pageTitle': (string);
  'viewportWidth': (number);
  'viewportHeight': (number);
  'faviconUrl': (string);
  'lastVisitedTime': (_google_protobuf_Timestamp__Output | null);
}
