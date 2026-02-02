// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface CommandStats {
  'numCommands'?: (number | string | Long);
  'numCommandsAccepted'?: (number | string | Long);
  'numCommandsRejected'?: (number | string | Long);
  'numEdits'?: (number | string | Long);
  'numGenerations'?: (number | string | Long);
  'locAdded'?: (number | string | Long);
  'locRemoved'?: (number | string | Long);
  'bytesAdded'?: (number | string | Long);
  'bytesRemoved'?: (number | string | Long);
  'locSelected'?: (number | string | Long);
  'bytesSelected'?: (number | string | Long);
  'numCommandsBySource'?: ({[key: string]: number | string | Long});
}

export interface CommandStats__Output {
  'numCommands': (string);
  'numCommandsAccepted': (string);
  'numCommandsRejected': (string);
  'numEdits': (string);
  'numGenerations': (string);
  'locAdded': (string);
  'locRemoved': (string);
  'bytesAdded': (string);
  'bytesRemoved': (string);
  'locSelected': (string);
  'bytesSelected': (string);
  'numCommandsBySource': ({[key: string]: string});
}
