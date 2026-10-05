import { validateHarnessConfig, DEFAULT_CONFIG } from './schema.js';
import { transpileClaude } from './transpiler/claude.js';
import { transpileAgents } from './transpiler/agents.js';
import { transpileDsh } from './transpiler/dsh.js';
import { transpileCursor } from './transpiler/cursor.js';
import { lintHarness } from './linter.js';

export {
  validateHarnessConfig,
  DEFAULT_CONFIG,
  transpileClaude,
  transpileAgents,
  transpileDsh,
  transpileCursor,
  lintHarness,
};

export function compileAll(config) {
  const validation = validateHarnessConfig(config);
  if (!validation.valid) {
    throw new Error(`Invalid harness config: ${validation.errors.join(', ')}`);
  }

  return {
    'CLAUDE.md': transpileClaude(config),
    'AGENTS.md': transpileAgents(config),
    'dsh.config.json': transpileDsh(config),
    '.cursorrules': transpileCursor(config),
  };
}
