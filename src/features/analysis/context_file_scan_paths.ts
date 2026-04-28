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

export const SKILL_CATEGORY = 'skill' as const

type RootSpec =
  | { root: 'workspace' | 'home' }
  | { root: 'absolute'; absoluteBase: string }

export type ScanEntry =
  | ({ kind?: 'glob'; glob: string; category: string } & RootSpec)
  | ({ kind: 'skill-bundle'; skillsRoot: string } & RootSpec)

export const SCAN_PATHS: Record<string, ScanEntry[]> = {
  'claude-code': [
    { glob: 'CLAUDE.md', category: 'rule', root: 'workspace' },
    { glob: 'CLAUDE.local.md', category: 'rule', root: 'workspace' },
    { glob: 'INSIGHTS.md', category: 'rule', root: 'workspace' },
    { glob: 'AGENTS.md', category: 'rule', root: 'workspace' },
    { glob: '.claude/rules/**/*.md', category: 'rule', root: 'workspace' },
    { glob: '.claude/CLAUDE.md', category: 'rule', root: 'home' },
    { glob: '.claude/INSIGHTS.md', category: 'rule', root: 'home' },
    { glob: '.claude/rules/**/*.md', category: 'rule', root: 'home' },
    {
      glob: '.claude/projects/*/memory/*.md',
      category: 'memory',
      root: 'home',
    },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'workspace' },
    { glob: '.claude/commands/*.md', category: 'skill', root: 'workspace' },
    {
      glob: '.claude/agents/*.md',
      category: SKILL_CATEGORY,
      root: 'workspace',
    },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'home' },
    { glob: '.claude/commands/*.md', category: 'skill', root: 'home' },
    { glob: '.claude/agents/*.md', category: SKILL_CATEGORY, root: 'home' },
    { glob: '.claude/settings.json', category: 'config', root: 'workspace' },
    {
      glob: '.claude/settings.local.json',
      category: 'config',
      root: 'workspace',
    },
    { glob: '.mcp.json', category: 'mcp-config', root: 'workspace' },
    { glob: '.claude/.mcp.json', category: 'mcp-config', root: 'workspace' },
    { glob: '.claude/settings.json', category: 'config', root: 'home' },
    { glob: '.claudeignore', category: 'ignore', root: 'workspace' },
  ],

  cursor: [
    // Legacy single-file rules
    { glob: '.cursorrules', category: 'rule', root: 'workspace' },
    // Project Rules — docs support both `.mdc` and `.md` inside .cursor/rules/
    { glob: '.cursor/rules/**/*.mdc', category: 'rule', root: 'workspace' },
    { glob: '.cursor/rules/**/*.md', category: 'rule', root: 'workspace' },
    // AGENTS.md — Cursor's documented alternative to .cursor/rules/
    { glob: 'AGENTS.md', category: 'rule', root: 'workspace' },
    // Agent skills — Cursor auto-loads from these dirs plus compat with
    // Claude / Codex / generic .agents/ per Cursor docs.
    { kind: 'skill-bundle', skillsRoot: '.cursor/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.codex/skills', root: 'workspace' },
    // MCP — project + global
    { glob: '.cursor/mcp.json', category: 'mcp-config', root: 'workspace' },
    { glob: '.cursor/mcp.json', category: 'mcp-config', root: 'home' },
    // Home skills (user-level cross-project skills)
    { kind: 'skill-bundle', skillsRoot: '.cursor/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.codex/skills', root: 'home' },
    // Exclusion
    { glob: '.cursorignore', category: 'ignore', root: 'workspace' },
    // Note: Cursor's global "Rules for AI" from Settings UI is stored in
    // Cursor's internal settings DB. The tracer_ext reads it via VS Code API
    // (vscode.workspace.getConfiguration) and includes it as a synthetic entry.
  ],

  copilot: [
    // Instructions — workspace
    {
      glob: '.github/copilot-instructions.md',
      category: 'rule',
      root: 'workspace',
    },
    {
      glob: '.github/instructions/**/*.instructions.md',
      category: 'rule',
      root: 'workspace',
    },
    // AGENTS.md / CLAUDE.md family (Copilot reads these via chat.useAgentsMdFile,
    // chat.useClaudeMdFile for cross-compat with Claude Code / other agents).
    { glob: 'AGENTS.md', category: 'rule', root: 'workspace' },
    { glob: 'CLAUDE.md', category: 'rule', root: 'workspace' },
    { glob: 'CLAUDE.local.md', category: 'rule', root: 'workspace' },
    { glob: '.claude/CLAUDE.md', category: 'rule', root: 'workspace' },
    { glob: '.claude/rules/**/*.md', category: 'rule', root: 'workspace' },
    // Prompts — workspace
    {
      glob: '.github/prompts/*.prompt.md',
      category: SKILL_CATEGORY,
      root: 'workspace',
    },
    // Custom agents — `.agent.md` is the current format; `.chatmode.md` is the
    // legacy naming docs recommend renaming. We scan both for transition.
    {
      glob: '.github/agents/*.agent.md',
      category: 'agent-config',
      root: 'workspace',
    },
    {
      glob: '.github/chatmodes/*.chatmode.md',
      category: 'agent-config',
      root: 'workspace',
    },
    {
      glob: '.claude/agents/*.md',
      category: SKILL_CATEGORY,
      root: 'workspace',
    },
    // Agent skills — Copilot discovers skills in all three roots (VS Code docs:
    // Agent Skills). Each skill is a directory with SKILL.md plus sibling files.
    { kind: 'skill-bundle', skillsRoot: '.github/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'workspace' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'workspace' },
    // MCP — VS Code Copilot reads MCP servers from .vscode/mcp.json
    { glob: '.vscode/mcp.json', category: 'mcp-config', root: 'workspace' },
    // Global — home (JetBrains stores global instructions here)
    {
      glob: '.config/github-copilot/global-copilot-instructions.md',
      category: 'rule',
      root: 'home',
    },
    // User-level Copilot customizations (~/.copilot/)
    {
      glob: '.copilot/instructions/**/*.instructions.md',
      category: 'rule',
      root: 'home',
    },
    { glob: '.copilot/prompts/*.prompt.md', category: 'skill', root: 'home' },
    {
      glob: '.copilot/agents/*.agent.md',
      category: 'agent-config',
      root: 'home',
    },
    { kind: 'skill-bundle', skillsRoot: '.copilot/skills', root: 'home' },
    // Cross-compat home paths (Copilot reads Claude / generic agent dirs too)
    { glob: '.claude/CLAUDE.md', category: 'rule', root: 'home' },
    { glob: '.claude/rules/**/*.md', category: 'rule', root: 'home' },
    { glob: '.claude/agents/*.md', category: SKILL_CATEGORY, root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.claude/skills', root: 'home' },
    { kind: 'skill-bundle', skillsRoot: '.agents/skills', root: 'home' },
  ],
}
