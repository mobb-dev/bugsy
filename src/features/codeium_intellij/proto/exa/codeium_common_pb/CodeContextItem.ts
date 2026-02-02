// Original file: exa/codeium_common_pb/codeium_common.proto

import type { WorkspacePath as _exa_codeium_common_pb_WorkspacePath, WorkspacePath__Output as _exa_codeium_common_pb_WorkspacePath__Output } from '../../exa/codeium_common_pb/WorkspacePath';
import type { CodeContextType as _exa_codeium_common_pb_CodeContextType, CodeContextType__Output as _exa_codeium_common_pb_CodeContextType__Output } from '../../exa/codeium_common_pb/CodeContextType';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { SnippetWithWordCount as _exa_codeium_common_pb_SnippetWithWordCount, SnippetWithWordCount__Output as _exa_codeium_common_pb_SnippetWithWordCount__Output } from '../../exa/codeium_common_pb/SnippetWithWordCount';
import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface CodeContextItem {
  'absolutePathMigrateMeToUri'?: (string);
  'workspacePaths'?: (_exa_codeium_common_pb_WorkspacePath)[];
  'nodeName'?: (string);
  'nodeLineage'?: (string)[];
  'startLine'?: (number);
  'endLine'?: (number);
  'contextType'?: (_exa_codeium_common_pb_CodeContextType);
  'language'?: (_exa_codeium_common_pb_Language);
  'snippetByType'?: ({[key: string]: _exa_codeium_common_pb_SnippetWithWordCount});
  'startCol'?: (number);
  'endCol'?: (number);
  'repoInfo'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'fileContentHash'?: (Buffer | Uint8Array | string);
  'absoluteUri'?: (string);
}

export interface CodeContextItem__Output {
  'absolutePathMigrateMeToUri': (string);
  'workspacePaths': (_exa_codeium_common_pb_WorkspacePath__Output)[];
  'nodeName': (string);
  'nodeLineage': (string)[];
  'startLine': (number);
  'endLine': (number);
  'contextType': (_exa_codeium_common_pb_CodeContextType__Output);
  'language': (_exa_codeium_common_pb_Language__Output);
  'snippetByType': ({[key: string]: _exa_codeium_common_pb_SnippetWithWordCount__Output});
  'startCol': (number);
  'endCol': (number);
  'repoInfo': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'fileContentHash': (Buffer);
  'absoluteUri': (string);
}
