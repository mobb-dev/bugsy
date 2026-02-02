// Original file: exa/index_pb/index.proto


export interface RequestIndexVersion {
  'commit'?: (string);
  'branch'?: (string);
  'versionAlias'?: (string);
  'version'?: "commit"|"branch";
}

export interface RequestIndexVersion__Output {
  'commit'?: (string);
  'branch'?: (string);
  'versionAlias': (string);
  'version'?: "commit"|"branch";
}
