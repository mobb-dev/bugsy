// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { BrowserPageMetadata as _exa_codeium_common_pb_BrowserPageMetadata, BrowserPageMetadata__Output as _exa_codeium_common_pb_BrowserPageMetadata__Output } from '../../exa/codeium_common_pb/BrowserPageMetadata';
import type { BrowserClickInteraction as _exa_codeium_common_pb_BrowserClickInteraction, BrowserClickInteraction__Output as _exa_codeium_common_pb_BrowserClickInteraction__Output } from '../../exa/codeium_common_pb/BrowserClickInteraction';
import type { BrowserScrollInteraction as _exa_codeium_common_pb_BrowserScrollInteraction, BrowserScrollInteraction__Output as _exa_codeium_common_pb_BrowserScrollInteraction__Output } from '../../exa/codeium_common_pb/BrowserScrollInteraction';

export interface BrowserInteraction {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'pageMetadata'?: (_exa_codeium_common_pb_BrowserPageMetadata | null);
  'click'?: (_exa_codeium_common_pb_BrowserClickInteraction | null);
  'scroll'?: (_exa_codeium_common_pb_BrowserScrollInteraction | null);
  'interaction'?: "click"|"scroll";
}

export interface BrowserInteraction__Output {
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'pageMetadata': (_exa_codeium_common_pb_BrowserPageMetadata__Output | null);
  'click'?: (_exa_codeium_common_pb_BrowserClickInteraction__Output | null);
  'scroll'?: (_exa_codeium_common_pb_BrowserScrollInteraction__Output | null);
  'interaction'?: "click"|"scroll";
}
