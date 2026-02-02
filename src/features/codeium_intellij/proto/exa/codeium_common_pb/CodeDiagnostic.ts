// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { DiagnosticFix as _exa_codeium_common_pb_DiagnosticFix, DiagnosticFix__Output as _exa_codeium_common_pb_DiagnosticFix__Output } from '../../exa/codeium_common_pb/DiagnosticFix';
import type { Long } from '@grpc/proto-loader';

export interface CodeDiagnostic {
  'range'?: (_exa_codeium_common_pb_Range | null);
  'message'?: (string);
  'severity'?: (string);
  'source'?: (string);
  'uri'?: (string);
  'id'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'score'?: (number | string | Long);
  'fixes'?: (_exa_codeium_common_pb_DiagnosticFix)[];
  '_id'?: "id";
}

export interface CodeDiagnostic__Output {
  'range': (_exa_codeium_common_pb_Range__Output | null);
  'message': (string);
  'severity': (string);
  'source': (string);
  'uri': (string);
  'id'?: (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'score': (string);
  'fixes': (_exa_codeium_common_pb_DiagnosticFix__Output)[];
  '_id'?: "id";
}
