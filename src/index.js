import { validateHarnessConfig, DEFAULT_CONFIG } from './schema.js';
import { transpileClaude, transpileClaudeRule } from './transpiler/claude.js';
import { transpileAgents } from './transpiler/agents.js';
import { transpileDsh } from './transpiler/dsh.js';
import { transpileCursor, transpileCursorMdc } from './transpiler/cursor.js';
import { transpileCursorMcp, transpileClaudeMcp } from './transpiler/mcp.js';
import { generatePreCommitHook, generateSafeExecScript } from './transpiler/guard.js';
import { lintHarness } from './linter.js';

export {
  validateHarnessConfig,
  DEFAULT_CONFIG,
  transpileClaude,
  transpileClaudeRule,
  transpileAgents,
  transpileDsh,
  transpileCursor,
  transpileCursorMdc,
  transpileCursorMcp,
  transpileClaudeMcp,
  generatePreCommitHook,
  generateSafeExecScript,
  lintHarness,
};

export function compileAll(config) {
  const validation = validateHarnessConfig(config);
  if (!validation.valid) {
    throw new Error(`Invalid harness config: ${validation.errors.join(', ')}`);
  }

  const output = {
    'CLAUDE.md': transpileClaude(config),
    'AGENTS.md': transpileAgents(config),
    'dsh.config.json': transpileDsh(config),
    '.cursorrules': transpileCursor(config),
  };

  // Compile scoped rules (Progressive Disclosure)
  if (config.rules && Array.isArray(config.rules)) {
    for (const rule of config.rules) {
      if (rule.name) {
        output[`.cursor/rules/${rule.name}.mdc`] = transpileCursorMdc(rule);
        output[`.claude/rules/${rule.name}.md`] = transpileClaudeRule(rule);
      }
    }
  }

  // Compile MCP servers
  if (config.mcp_servers) {
    const cursorMcp = transpileCursorMcp(config);
    if (cursorMcp) output['.cursor/mcp.json'] = cursorMcp;

    const claudeMcp = transpileClaudeMcp(config);
    if (claudeMcp) output['.claude/mcp.json'] = claudeMcp;
  }

  // Compile deterministic safety hooks
  if (config.safety) {
    output['.githooks/pre-commit'] = generatePreCommitHook(config);
    output['scripts/safe-exec.sh'] = generateSafeExecScript(config);
  }

  return output;
}
