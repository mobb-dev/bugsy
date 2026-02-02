// Original file: null

import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from '../../google/protobuf/FeatureSet';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { OneofRules as _buf_validate_OneofRules, OneofRules__Output as _buf_validate_OneofRules__Output } from '../../buf/validate/OneofRules';

export interface OneofOptions {
  'features'?: (_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.buf.validate.oneof'?: (_buf_validate_OneofRules | null);
}

export interface OneofOptions__Output {
  'features': (_google_protobuf_FeatureSet__Output | null);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.buf.validate.oneof': (_buf_validate_OneofRules__Output | null);
}
