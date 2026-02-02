// Original file: exa/cascade_plugins_pb/cascade_plugins.proto

import type { CascadePluginCommand as _exa_cascade_plugins_pb_CascadePluginCommand, CascadePluginCommand__Output as _exa_cascade_plugins_pb_CascadePluginCommand__Output } from '../../exa/cascade_plugins_pb/CascadePluginCommand';
import type { CascadePluginLocalConfig as _exa_cascade_plugins_pb_CascadePluginLocalConfig, CascadePluginLocalConfig__Output as _exa_cascade_plugins_pb_CascadePluginLocalConfig__Output } from '../../exa/cascade_plugins_pb/CascadePluginLocalConfig';
import type { CascadePluginRemoteConfig as _exa_cascade_plugins_pb_CascadePluginRemoteConfig, CascadePluginRemoteConfig__Output as _exa_cascade_plugins_pb_CascadePluginRemoteConfig__Output } from '../../exa/cascade_plugins_pb/CascadePluginRemoteConfig';
import type { Long } from '@grpc/proto-loader';

export interface CascadePluginTemplate {
  'title'?: (string);
  'id'?: (string);
  'link'?: (string);
  'description'?: (string);
  'commands'?: ({[key: string]: _exa_cascade_plugins_pb_CascadePluginCommand});
  'installationCount'?: (number | string | Long);
  'trustLevel'?: (string);
  'readme'?: (string);
  'local'?: (_exa_cascade_plugins_pb_CascadePluginLocalConfig | null);
  'remote'?: (_exa_cascade_plugins_pb_CascadePluginRemoteConfig | null);
  'configuration'?: "local"|"remote";
}

export interface CascadePluginTemplate__Output {
  'title': (string);
  'id': (string);
  'link': (string);
  'description': (string);
  'commands': ({[key: string]: _exa_cascade_plugins_pb_CascadePluginCommand__Output});
  'installationCount': (string);
  'trustLevel': (string);
  'readme': (string);
  'local'?: (_exa_cascade_plugins_pb_CascadePluginLocalConfig__Output | null);
  'remote'?: (_exa_cascade_plugins_pb_CascadePluginRemoteConfig__Output | null);
  'configuration'?: "local"|"remote";
}
