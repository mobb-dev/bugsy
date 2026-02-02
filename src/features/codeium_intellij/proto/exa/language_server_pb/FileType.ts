// Original file: exa/language_server_pb/language_server.proto

export const FileType = {
  FILE_TYPE_UNSPECIFIED: 'FILE_TYPE_UNSPECIFIED',
  FILE_TYPE_FILE: 'FILE_TYPE_FILE',
  FILE_TYPE_DIRECTORY: 'FILE_TYPE_DIRECTORY',
  FILE_TYPE_SYMLINK: 'FILE_TYPE_SYMLINK',
} as const;

export type FileType =
  | 'FILE_TYPE_UNSPECIFIED'
  | 0
  | 'FILE_TYPE_FILE'
  | 1
  | 'FILE_TYPE_DIRECTORY'
  | 2
  | 'FILE_TYPE_SYMLINK'
  | 3

export type FileType__Output = typeof FileType[keyof typeof FileType]
