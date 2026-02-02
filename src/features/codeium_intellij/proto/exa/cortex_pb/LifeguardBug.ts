// Original file: exa/cortex_pb/cortex.proto


export interface LifeguardBug {
  'id'?: (string);
  'file'?: (string);
  'start'?: (number);
  'end'?: (number);
  'title'?: (string);
  'description'?: (string);
  'severity'?: (string);
  'resolution'?: (string);
  'fixOldStr'?: (string);
  'fixNewStr'?: (string);
  '_fixOldStr'?: "fixOldStr";
  '_fixNewStr'?: "fixNewStr";
}

export interface LifeguardBug__Output {
  'id': (string);
  'file': (string);
  'start': (number);
  'end': (number);
  'title': (string);
  'description': (string);
  'severity': (string);
  'resolution': (string);
  'fixOldStr'?: (string);
  'fixNewStr'?: (string);
  '_fixOldStr'?: "fixOldStr";
  '_fixNewStr'?: "fixNewStr";
}
