// Original file: buf/validate/validate.proto

import type { FloatRules as _buf_validate_FloatRules, FloatRules__Output as _buf_validate_FloatRules__Output } from '../../buf/validate/FloatRules';
import type { DoubleRules as _buf_validate_DoubleRules, DoubleRules__Output as _buf_validate_DoubleRules__Output } from '../../buf/validate/DoubleRules';
import type { Int32Rules as _buf_validate_Int32Rules, Int32Rules__Output as _buf_validate_Int32Rules__Output } from '../../buf/validate/Int32Rules';
import type { Int64Rules as _buf_validate_Int64Rules, Int64Rules__Output as _buf_validate_Int64Rules__Output } from '../../buf/validate/Int64Rules';
import type { UInt32Rules as _buf_validate_UInt32Rules, UInt32Rules__Output as _buf_validate_UInt32Rules__Output } from '../../buf/validate/UInt32Rules';
import type { UInt64Rules as _buf_validate_UInt64Rules, UInt64Rules__Output as _buf_validate_UInt64Rules__Output } from '../../buf/validate/UInt64Rules';
import type { SInt32Rules as _buf_validate_SInt32Rules, SInt32Rules__Output as _buf_validate_SInt32Rules__Output } from '../../buf/validate/SInt32Rules';
import type { SInt64Rules as _buf_validate_SInt64Rules, SInt64Rules__Output as _buf_validate_SInt64Rules__Output } from '../../buf/validate/SInt64Rules';
import type { Fixed32Rules as _buf_validate_Fixed32Rules, Fixed32Rules__Output as _buf_validate_Fixed32Rules__Output } from '../../buf/validate/Fixed32Rules';
import type { Fixed64Rules as _buf_validate_Fixed64Rules, Fixed64Rules__Output as _buf_validate_Fixed64Rules__Output } from '../../buf/validate/Fixed64Rules';
import type { SFixed32Rules as _buf_validate_SFixed32Rules, SFixed32Rules__Output as _buf_validate_SFixed32Rules__Output } from '../../buf/validate/SFixed32Rules';
import type { SFixed64Rules as _buf_validate_SFixed64Rules, SFixed64Rules__Output as _buf_validate_SFixed64Rules__Output } from '../../buf/validate/SFixed64Rules';
import type { BoolRules as _buf_validate_BoolRules, BoolRules__Output as _buf_validate_BoolRules__Output } from '../../buf/validate/BoolRules';
import type { StringRules as _buf_validate_StringRules, StringRules__Output as _buf_validate_StringRules__Output } from '../../buf/validate/StringRules';
import type { BytesRules as _buf_validate_BytesRules, BytesRules__Output as _buf_validate_BytesRules__Output } from '../../buf/validate/BytesRules';
import type { EnumRules as _buf_validate_EnumRules, EnumRules__Output as _buf_validate_EnumRules__Output } from '../../buf/validate/EnumRules';
import type { RepeatedRules as _buf_validate_RepeatedRules, RepeatedRules__Output as _buf_validate_RepeatedRules__Output } from '../../buf/validate/RepeatedRules';
import type { MapRules as _buf_validate_MapRules, MapRules__Output as _buf_validate_MapRules__Output } from '../../buf/validate/MapRules';
import type { AnyRules as _buf_validate_AnyRules, AnyRules__Output as _buf_validate_AnyRules__Output } from '../../buf/validate/AnyRules';
import type { DurationRules as _buf_validate_DurationRules, DurationRules__Output as _buf_validate_DurationRules__Output } from '../../buf/validate/DurationRules';
import type { TimestampRules as _buf_validate_TimestampRules, TimestampRules__Output as _buf_validate_TimestampRules__Output } from '../../buf/validate/TimestampRules';
import type { Rule as _buf_validate_Rule, Rule__Output as _buf_validate_Rule__Output } from '../../buf/validate/Rule';
import type { Ignore as _buf_validate_Ignore, Ignore__Output as _buf_validate_Ignore__Output } from '../../buf/validate/Ignore';

export interface FieldRules {
  'float'?: (_buf_validate_FloatRules | null);
  'double'?: (_buf_validate_DoubleRules | null);
  'int32'?: (_buf_validate_Int32Rules | null);
  'int64'?: (_buf_validate_Int64Rules | null);
  'uint32'?: (_buf_validate_UInt32Rules | null);
  'uint64'?: (_buf_validate_UInt64Rules | null);
  'sint32'?: (_buf_validate_SInt32Rules | null);
  'sint64'?: (_buf_validate_SInt64Rules | null);
  'fixed32'?: (_buf_validate_Fixed32Rules | null);
  'fixed64'?: (_buf_validate_Fixed64Rules | null);
  'sfixed32'?: (_buf_validate_SFixed32Rules | null);
  'sfixed64'?: (_buf_validate_SFixed64Rules | null);
  'bool'?: (_buf_validate_BoolRules | null);
  'string'?: (_buf_validate_StringRules | null);
  'bytes'?: (_buf_validate_BytesRules | null);
  'enum'?: (_buf_validate_EnumRules | null);
  'repeated'?: (_buf_validate_RepeatedRules | null);
  'map'?: (_buf_validate_MapRules | null);
  'any'?: (_buf_validate_AnyRules | null);
  'duration'?: (_buf_validate_DurationRules | null);
  'timestamp'?: (_buf_validate_TimestampRules | null);
  'cel'?: (_buf_validate_Rule)[];
  'required'?: (boolean);
  'ignore'?: (_buf_validate_Ignore);
  'type'?: "float"|"double"|"int32"|"int64"|"uint32"|"uint64"|"sint32"|"sint64"|"fixed32"|"fixed64"|"sfixed32"|"sfixed64"|"bool"|"string"|"bytes"|"enum"|"repeated"|"map"|"any"|"duration"|"timestamp";
}

export interface FieldRules__Output {
  'float'?: (_buf_validate_FloatRules__Output | null);
  'double'?: (_buf_validate_DoubleRules__Output | null);
  'int32'?: (_buf_validate_Int32Rules__Output | null);
  'int64'?: (_buf_validate_Int64Rules__Output | null);
  'uint32'?: (_buf_validate_UInt32Rules__Output | null);
  'uint64'?: (_buf_validate_UInt64Rules__Output | null);
  'sint32'?: (_buf_validate_SInt32Rules__Output | null);
  'sint64'?: (_buf_validate_SInt64Rules__Output | null);
  'fixed32'?: (_buf_validate_Fixed32Rules__Output | null);
  'fixed64'?: (_buf_validate_Fixed64Rules__Output | null);
  'sfixed32'?: (_buf_validate_SFixed32Rules__Output | null);
  'sfixed64'?: (_buf_validate_SFixed64Rules__Output | null);
  'bool'?: (_buf_validate_BoolRules__Output | null);
  'string'?: (_buf_validate_StringRules__Output | null);
  'bytes'?: (_buf_validate_BytesRules__Output | null);
  'enum'?: (_buf_validate_EnumRules__Output | null);
  'repeated'?: (_buf_validate_RepeatedRules__Output | null);
  'map'?: (_buf_validate_MapRules__Output | null);
  'any'?: (_buf_validate_AnyRules__Output | null);
  'duration'?: (_buf_validate_DurationRules__Output | null);
  'timestamp'?: (_buf_validate_TimestampRules__Output | null);
  'cel': (_buf_validate_Rule__Output)[];
  'required': (boolean);
  'ignore': (_buf_validate_Ignore__Output);
  'type'?: "float"|"double"|"int32"|"int64"|"uint32"|"uint64"|"sint32"|"sint64"|"fixed32"|"fixed64"|"sfixed32"|"sfixed64"|"bool"|"string"|"bytes"|"enum"|"repeated"|"map"|"any"|"duration"|"timestamp";
}
