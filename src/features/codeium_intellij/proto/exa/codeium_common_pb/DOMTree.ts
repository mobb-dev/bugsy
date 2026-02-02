// Original file: exa/codeium_common_pb/codeium_common.proto


export interface _exa_codeium_common_pb_DOMTree_BoundingBox {
  'x'?: (number | string);
  'y'?: (number | string);
  'width'?: (number | string);
  'height'?: (number | string);
}

export interface _exa_codeium_common_pb_DOMTree_BoundingBox__Output {
  'x': (number);
  'y': (number);
  'width': (number);
  'height': (number);
}

export interface _exa_codeium_common_pb_DOMTree_DOMNode {
  'children'?: (_exa_codeium_common_pb_DOMTree_DOMNode)[];
  'tagName'?: (string);
  'id'?: (string);
  'classNames'?: (string)[];
  'textContent'?: (string);
  'bbox'?: (_exa_codeium_common_pb_DOMTree_BoundingBox | null);
  'ariaLabel'?: (string);
  'title'?: (string);
  'alt'?: (string);
  'placeholder'?: (string);
  'href'?: (string);
}

export interface _exa_codeium_common_pb_DOMTree_DOMNode__Output {
  'children': (_exa_codeium_common_pb_DOMTree_DOMNode__Output)[];
  'tagName': (string);
  'id': (string);
  'classNames': (string)[];
  'textContent': (string);
  'bbox': (_exa_codeium_common_pb_DOMTree_BoundingBox__Output | null);
  'ariaLabel': (string);
  'title': (string);
  'alt': (string);
  'placeholder': (string);
  'href': (string);
}

export interface DOMTree {
  'root'?: (_exa_codeium_common_pb_DOMTree_DOMNode | null);
  'numNodes'?: (number);
}

export interface DOMTree__Output {
  'root': (_exa_codeium_common_pb_DOMTree_DOMNode__Output | null);
  'numNodes': (number);
}
