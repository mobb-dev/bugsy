// Original file: buf/validate/validate.proto

import type { KnownRegex as _buf_validate_KnownRegex, KnownRegex__Output as _buf_validate_KnownRegex__Output } from '../../buf/validate/KnownRegex';
import type { Long } from '@grpc/proto-loader';

export interface StringRules {
  'const'?: (string);
  'minLen'?: (number | string | Long);
  'maxLen'?: (number | string | Long);
  'minBytes'?: (number | string | Long);
  'maxBytes'?: (number | string | Long);
  'pattern'?: (string);
  'prefix'?: (string);
  'suffix'?: (string);
  'contains'?: (string);
  'in'?: (string)[];
  'notIn'?: (string)[];
  'email'?: (boolean);
  'hostname'?: (boolean);
  'ip'?: (boolean);
  'ipv4'?: (boolean);
  'ipv6'?: (boolean);
  'uri'?: (boolean);
  'uriRef'?: (boolean);
  'len'?: (number | string | Long);
  'lenBytes'?: (number | string | Long);
  'address'?: (boolean);
  'uuid'?: (boolean);
  'notContains'?: (string);
  'wellKnownRegex'?: (_buf_validate_KnownRegex);
  'strict'?: (boolean);
  'ipWithPrefixlen'?: (boolean);
  'ipv4WithPrefixlen'?: (boolean);
  'ipv6WithPrefixlen'?: (boolean);
  'ipPrefix'?: (boolean);
  'ipv4Prefix'?: (boolean);
  'ipv6Prefix'?: (boolean);
  'hostAndPort'?: (boolean);
  'tuuid'?: (boolean);
  'example'?: (string)[];
  'wellKnown'?: "email"|"hostname"|"ip"|"ipv4"|"ipv6"|"uri"|"uriRef"|"address"|"uuid"|"tuuid"|"ipWithPrefixlen"|"ipv4WithPrefixlen"|"ipv6WithPrefixlen"|"ipPrefix"|"ipv4Prefix"|"ipv6Prefix"|"hostAndPort"|"wellKnownRegex";
}

export interface StringRules__Output {
  'const': (string);
  'minLen': (string);
  'maxLen': (string);
  'minBytes': (string);
  'maxBytes': (string);
  'pattern': (string);
  'prefix': (string);
  'suffix': (string);
  'contains': (string);
  'in': (string)[];
  'notIn': (string)[];
  'email'?: (boolean);
  'hostname'?: (boolean);
  'ip'?: (boolean);
  'ipv4'?: (boolean);
  'ipv6'?: (boolean);
  'uri'?: (boolean);
  'uriRef'?: (boolean);
  'len': (string);
  'lenBytes': (string);
  'address'?: (boolean);
  'uuid'?: (boolean);
  'notContains': (string);
  'wellKnownRegex'?: (_buf_validate_KnownRegex__Output);
  'strict': (boolean);
  'ipWithPrefixlen'?: (boolean);
  'ipv4WithPrefixlen'?: (boolean);
  'ipv6WithPrefixlen'?: (boolean);
  'ipPrefix'?: (boolean);
  'ipv4Prefix'?: (boolean);
  'ipv6Prefix'?: (boolean);
  'hostAndPort'?: (boolean);
  'tuuid'?: (boolean);
  'example': (string)[];
  'wellKnown'?: "email"|"hostname"|"ip"|"ipv4"|"ipv6"|"uri"|"uriRef"|"address"|"uuid"|"tuuid"|"ipWithPrefixlen"|"ipv4WithPrefixlen"|"ipv6WithPrefixlen"|"ipPrefix"|"ipv4Prefix"|"ipv6Prefix"|"hostAndPort"|"wellKnownRegex";
}
