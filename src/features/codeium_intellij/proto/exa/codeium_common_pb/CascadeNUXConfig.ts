// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CascadeNUXLocation as _exa_codeium_common_pb_CascadeNUXLocation, CascadeNUXLocation__Output as _exa_codeium_common_pb_CascadeNUXLocation__Output } from '../../exa/codeium_common_pb/CascadeNUXLocation';
import type { CascadeNUXTrigger as _exa_codeium_common_pb_CascadeNUXTrigger, CascadeNUXTrigger__Output as _exa_codeium_common_pb_CascadeNUXTrigger__Output } from '../../exa/codeium_common_pb/CascadeNUXTrigger';
import type { CascadeNUXEvent as _exa_codeium_common_pb_CascadeNUXEvent, CascadeNUXEvent__Output as _exa_codeium_common_pb_CascadeNUXEvent__Output } from '../../exa/codeium_common_pb/CascadeNUXEvent';
import type { CascadeNUXIcon as _exa_codeium_common_pb_CascadeNUXIcon, CascadeNUXIcon__Output as _exa_codeium_common_pb_CascadeNUXIcon__Output } from '../../exa/codeium_common_pb/CascadeNUXIcon';

export interface CascadeNUXConfig {
  'uid'?: (number);
  'location'?: (_exa_codeium_common_pb_CascadeNUXLocation);
  'trigger'?: (_exa_codeium_common_pb_CascadeNUXTrigger);
  'analyticsEventName'?: (string);
  'mainText'?: (string);
  'onHoverExplanation'?: (string);
  'learnMoreUrl'?: (string);
  'priority'?: (number);
  'oldNuxEvent'?: (_exa_codeium_common_pb_CascadeNUXEvent);
  'icon'?: (_exa_codeium_common_pb_CascadeNUXIcon);
  'requiresIdleCascade'?: (boolean);
}

export interface CascadeNUXConfig__Output {
  'uid': (number);
  'location': (_exa_codeium_common_pb_CascadeNUXLocation__Output);
  'trigger': (_exa_codeium_common_pb_CascadeNUXTrigger__Output);
  'analyticsEventName': (string);
  'mainText': (string);
  'onHoverExplanation': (string);
  'learnMoreUrl': (string);
  'priority': (number);
  'oldNuxEvent': (_exa_codeium_common_pb_CascadeNUXEvent__Output);
  'icon': (_exa_codeium_common_pb_CascadeNUXIcon__Output);
  'requiresIdleCascade': (boolean);
}
