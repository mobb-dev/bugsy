// Original file: exa/cortex_pb/cortex.proto

import type { ReadUrlContentAction as _exa_cortex_pb_ReadUrlContentAction, ReadUrlContentAction__Output as _exa_cortex_pb_ReadUrlContentAction__Output } from '../../exa/cortex_pb/ReadUrlContentAction';

export interface CascadeReadUrlContentInteraction {
  'action'?: (_exa_cortex_pb_ReadUrlContentAction);
  'url'?: (string);
  'origin'?: (string);
}

export interface CascadeReadUrlContentInteraction__Output {
  'action': (_exa_cortex_pb_ReadUrlContentAction__Output);
  'url': (string);
  'origin': (string);
}
