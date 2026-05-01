/**
 * Static scan path configuration — data-only, no external runtime dependencies.
 *
 * Kept in a separate file so it can be compiled to CommonJS (tsconfig-shared.json)
 * and re-used by tscommon/backend without pulling in ESM-only deps like globby.
 *
 * Consumed by:
 * - context_file_scanner.ts (CLI runtime)
 * - tscommon/backend/src/utils/tracyContextFilePaths.ts (server-side via build/)
 */

/**
 * Single source of truth for context-file category labels. Adding a new
 * category here automatically widens `ContextFileCategory` and the
 * test-side allowed set in `tracyContextFilePaths.test.ts`.
 */
export const CATEGORY = {
  RULE: 'rule',
  MEMORY: 'memory',
  SKILL: 'skill',
  COMMAND: 'command',
  PROMPT: 'prompt',
  AGENT_CONFIG: 'agent-config',
  CONFIG: 'config',
  MCP_CONFIG: 'mcp-config',
  IGNORE: 'ignore',
} as const

export type ContextFileCategory = (typeof CATEGORY)[keyof typeof CATEGORY]

/** @deprecated prefer `CATEGORY.SKILL`. Kept for callers that still import this name. */
export const SKILL_CATEGORY = CATEGORY.SKILL

type RootSpec =
  | { root: 'workspace' | 'home' }
  | { root: 'absolute'; absoluteBase: string }

export type ScanEntry =
  | ({ kind?: 'glob'; glob: string; category: ContextFileCategory } & RootSpec)
  | ({ kind: 'skill-bundle'; skillsRoot: string } & RootSpec)

export const SCAN_PATHS: Record<string, ScanEntry[]> = {
  'claude-code': [
    { glob: 'CLAUDE.md', category: CATEGORY.RULE, root: 'workspace' },
    { glob: 'CLAUDE.local.md', category: CATEGORY.RULE, root: 'workspace' },
    { glob: 'INSIGHTS.md', category: CATEGORY.RULE, root: 'workspace' },
    { glob: 'AGENTS.md', category: CATEGORY.RULE, root: 'workspace' },
    {
      glob: '.claude/rules/**/*.md',
      category: CATEGORY.RULE,
      root: 'workspace',
    },
    { glob: '.claude/CLAUDE.md', category: CATEGORY.RULE, root: 'home' },
    { glob: '.claude/INSIGHTS.md', category: CATEGORY.RULE, root: 'home' },
    { glob: '.claude/rules/**/*.md', category: CATEGORY.RULE, root: 'home' },
    {
      glob: '.claude/projects/*/memory/*.md',
      category: CATEGORY.MEMORY,
      root: 'home',
    },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'workspace' },
    {
      glob: '.claude/commands/*.md',
      category: CATEGORY.COMMAND,
      root: 'workspace',
    },
    {
      glob: '.claude/agents/*.md',
      category: CATEGORY.SKILL,
      root: 'workspace',
    },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'home' },
    { glob: '.claude/commands/*.md', category: CATEGORY.COMMAND, root: 'home' },
    { glob: '.claude/agents/*.md', category: CATEGORY.SKILL, root: 'home' },
    {
      glob: '.claude/settings.json',
      category: CATEGORY.CONFIG,
      root: 'workspace',
    },
    {
      glob: '.claude/settings.local.json',
      category: CATEGORY.CONFIG,
      root: 'workspace',
    },
    { glob: '.mcp.json', category: CATEGORY.MCP_CONFIG, root: 'workspace' },
    {
      glob: '.claude/.mcp.json',
      category: CATEGORY.MCP_CONFIG,
      root: 'workspace',
    },
    { glob: '.claude/settings.json', category: CATEGORY.CONFIG, root: 'home' },
    { glob: '.claudeignore', category: CATEGORY.IGNORE, root: 'workspace' },
  ],

  cursor: [
    // Legacy single-file rules
    { glob: '.cursorrules', category: CATEGORY.RULE, root: 'workspace' },
    // Project Rules — docs support both `.mdc` and `.md` inside .cursor/rules/
    {
      glob: '.cursor/rules/**/*.mdc',
      category: CATEGORY.RULE,
      root: 'workspace',
    },
    {
      glob: '.cursor/rules/**/*.md',
      category: CATEGORY.RULE,
      root: 'workspace',
    },
    // AGENTS.md — Cursor's documented alternative to .cursor/rules/
    { glob: 'AGENTS.md', category: CATEGORY.RULE, root: 'workspace' },
    // Agent skills — Cursor auto-loads from these dirs plus compat with
    // Claude / Codex / generic .agents/ per Cursor docs.
    { kind: 'skill-bundle', skillsRoot: '.cursor/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.codex/skills', root: 'workspace' },
    // MCP — project + global
    {
      glob: '.cursor/mcp.json',
      category: CATEGORY.MCP_CONFIG,
      root: 'workspace',
    },
    { glob: '.cursor/mcp.json', category: CATEGORY.MCP_CONFIG, root: 'home' },
    // Home skills (user-level cross-project skills)
    { kind: 'skill-bundle', skillsRoot: '.cursor/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.codex/skills', root: 'home' },
    // Exclusion
    { glob: '.cursorignore', category: CATEGORY.IGNORE, root: 'workspace' },
    // Note: Cursor's global "Rules for AI" from Settings UI is stored in
    // Cursor's internal settings DB. The tracer_ext reads it via VS Code API
    // (vscode.workspace.getConfiguration) and includes it as a synthetic entry.
  ],

  copilot: [
    // Instructions — workspace
    {
      glob: '.github/copilot-instructions.md',
      category: CATEGORY.RULE,
      root: 'workspace',
    },
    {
      glob: '.github/instructions/**/*.instructions.md',
      category: CATEGORY.RULE,
      root: 'workspace',
    },
    // AGENTS.md / CLAUDE.md family (Copilot reads these via chat.useAgentsMdFile,
    // chat.useClaudeMdFile for cross-compat with Claude Code / other agents).
    { glob: 'AGENTS.md', category: CATEGORY.RULE, root: 'workspace' },
    { glob: 'CLAUDE.md', category: CATEGORY.RULE, root: 'workspace' },
    { glob: 'CLAUDE.local.md', category: CATEGORY.RULE, root: 'workspace' },
    { glob: '.claude/CLAUDE.md', category: CATEGORY.RULE, root: 'workspace' },
    {
      glob: '.claude/rules/**/*.md',
      category: CATEGORY.RULE,
      root: 'workspace',
    },
    // Prompts — workspace
    {
      glob: '.github/prompts/*.prompt.md',
      category: CATEGORY.PROMPT,
      root: 'workspace',
    },
    // Custom agents — `.agent.md` is the current format; `.chatmode.md` is the
    // legacy naming docs recommend renaming. We scan both for transition.
    {
      glob: '.github/agents/*.agent.md',
      category: CATEGORY.AGENT_CONFIG,
      root: 'workspace',
    },
    {
      glob: '.github/chatmodes/*.chatmode.md',
      category: CATEGORY.AGENT_CONFIG,
      root: 'workspace',
    },
    {
      glob: '.claude/agents/*.md',
      category: CATEGORY.SKILL,
      root: 'workspace',
    },
    // Agent skills — Copilot discovers skills in all three roots (VS Code docs:
    // Agent Skills). Each skill is a directory with SKILL.md plus sibling files.
    { kind: 'skill-bundle', skillsRoot: '.github/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'workspace' },
    // MCP — VS Code Copilot reads MCP servers from .vscode/mcp.json
    {
      glob: '.vscode/mcp.json',
      category: CATEGORY.MCP_CONFIG,
      root: 'workspace',
    },
    // Global — home (JetBrains stores global instructions here)
    {
      glob: '.config/github-copilot/global-copilot-instructions.md',
      category: CATEGORY.RULE,
      root: 'home',
    },
    // User-level Copilot customizations (~/.copilot/)
    {
      glob: '.copilot/instructions/**/*.instructions.md',
      category: CATEGORY.RULE,
      root: 'home',
    },
    {
      glob: '.copilot/prompts/*.prompt.md',
      category: CATEGORY.PROMPT,
      root: 'home',
    },
    {
      glob: '.copilot/agents/*.agent.md',
      category: CATEGORY.AGENT_CONFIG,
      root: 'home',
    },
    { kind: 'skill-bundle', skillsRoot: '.copilot/skills', root: 'home' },
    // Cross-compat home paths (Copilot reads Claude / generic agent dirs too)
    { glob: '.claude/CLAUDE.md', category: CATEGORY.RULE, root: 'home' },
    { glob: '.claude/rules/**/*.md', category: CATEGORY.RULE, root: 'home' },
    { glob: '.claude/agents/*.md', category: CATEGORY.SKILL, root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'home' },
  ],
}
