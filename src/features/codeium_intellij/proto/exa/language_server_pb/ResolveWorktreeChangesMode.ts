// Original file: exa/language_server_pb/language_server.proto

export const ResolveWorktreeChangesMode = {
  RESOLVE_WORKTREE_CHANGES_MODE_UNSPECIFIED: 'RESOLVE_WORKTREE_CHANGES_MODE_UNSPECIFIED',
  RESOLVE_WORKTREE_CHANGES_MODE_MERGE: 'RESOLVE_WORKTREE_CHANGES_MODE_MERGE',
  RESOLVE_WORKTREE_CHANGES_MODE_STASH: 'RESOLVE_WORKTREE_CHANGES_MODE_STASH',
} as const;

export type ResolveWorktreeChangesMode =
  | 'RESOLVE_WORKTREE_CHANGES_MODE_UNSPECIFIED'
  | 0
  | 'RESOLVE_WORKTREE_CHANGES_MODE_MERGE'
  | 1
  | 'RESOLVE_WORKTREE_CHANGES_MODE_STASH'
  | 2

export type ResolveWorktreeChangesMode__Output = typeof ResolveWorktreeChangesMode[keyof typeof ResolveWorktreeChangesMode]
