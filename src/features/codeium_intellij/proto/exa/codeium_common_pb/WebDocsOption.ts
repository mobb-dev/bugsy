// Original file: exa/codeium_common_pb/codeium_common.proto


export interface WebDocsOption {
  'label'?: (string);
  'docsUrl'?: (string);
  'docsSearchDomain'?: (string);
  'synonyms'?: (string)[];
  'isFeatured'?: (boolean);
  'value'?: "docsUrl"|"docsSearchDomain";
}

export interface WebDocsOption__Output {
  'label': (string);
  'docsUrl'?: (string);
  'docsSearchDomain'?: (string);
  'synonyms': (string)[];
  'isFeatured': (boolean);
  'value'?: "docsUrl"|"docsSearchDomain";
}
