// Original file: null

import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from '../../google/protobuf/FeatureSet';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { MessageRules as _buf_validate_MessageRules, MessageRules__Output as _buf_validate_MessageRules__Output } from '../../buf/validate/MessageRules';

export interface MessageOptions {
  'messageSetWireFormat'?: (boolean);
  'noStandardDescriptorAccessor'?: (boolean);
  'deprecated'?: (boolean);
  'mapEntry'?: (boolean);
  'deprecatedLegacyJsonFieldConflicts'?: (boolean);
  'features'?: (_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.buf.validate.message'?: (_buf_validate_MessageRules | null);
}

export interface MessageOptions__Output {
  'messageSetWireFormat': (boolean);
  'noStandardDescriptorAccessor': (boolean);
  'deprecated': (boolean);
  'mapEntry': (boolean);
  'deprecatedLegacyJsonFieldConflicts': (boolean);
  'features': (_google_protobuf_FeatureSet__Output | null);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.buf.validate.message': (_buf_validate_MessageRules__Output | null);
}
