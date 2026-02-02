// Original file: buf/validate/validate.proto

import type { _google_protobuf_FieldDescriptorProto_Type, _google_protobuf_FieldDescriptorProto_Type__Output } from '../../google/protobuf/FieldDescriptorProto';
import type { Long } from '@grpc/proto-loader';

export interface FieldPathElement {
  'fieldNumber'?: (number);
  'fieldName'?: (string);
  'fieldType'?: (_google_protobuf_FieldDescriptorProto_Type);
  'keyType'?: (_google_protobuf_FieldDescriptorProto_Type);
  'valueType'?: (_google_protobuf_FieldDescriptorProto_Type);
  'index'?: (number | string | Long);
  'boolKey'?: (boolean);
  'intKey'?: (number | string | Long);
  'uintKey'?: (number | string | Long);
  'stringKey'?: (string);
  'subscript'?: "index"|"boolKey"|"intKey"|"uintKey"|"stringKey";
}

export interface FieldPathElement__Output {
  'fieldNumber': (number);
  'fieldName': (string);
  'fieldType': (_google_protobuf_FieldDescriptorProto_Type__Output);
  'keyType': (_google_protobuf_FieldDescriptorProto_Type__Output);
  'valueType': (_google_protobuf_FieldDescriptorProto_Type__Output);
  'index'?: (string);
  'boolKey'?: (boolean);
  'intKey'?: (string);
  'uintKey'?: (string);
  'stringKey'?: (string);
  'subscript'?: "index"|"boolKey"|"intKey"|"uintKey"|"stringKey";
}
