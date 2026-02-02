// Original file: exa/cascade_plugins_pb/cascade_plugins.proto

import type { CascadePluginCommandTemplate as _exa_cascade_plugins_pb_CascadePluginCommandTemplate, CascadePluginCommandTemplate__Output as _exa_cascade_plugins_pb_CascadePluginCommandTemplate__Output } from '../../exa/cascade_plugins_pb/CascadePluginCommandTemplate';
import type { CascadePluginCommandVariable as _exa_cascade_plugins_pb_CascadePluginCommandVariable, CascadePluginCommandVariable__Output as _exa_cascade_plugins_pb_CascadePluginCommandVariable__Output } from '../../exa/cascade_plugins_pb/CascadePluginCommandVariable';

export interface CascadePluginCommand {
  'template'?: (_exa_cascade_plugins_pb_CascadePluginCommandTemplate | null);
  'variables'?: (_exa_cascade_plugins_pb_CascadePluginCommandVariable)[];
}

export interface CascadePluginCommand__Output {
  'template': (_exa_cascade_plugins_pb_CascadePluginCommandTemplate__Output | null);
  'variables': (_exa_cascade_plugins_pb_CascadePluginCommandVariable__Output)[];
}
