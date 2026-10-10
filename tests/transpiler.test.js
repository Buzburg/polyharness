import test from 'node:test';
import assert from 'node:assert';
import { DEFAULT_CONFIG, compileAll } from '../src/index.js';

test('compileAll generates valid files for all 4 targets', () => {
  const result = compileAll(DEFAULT_CONFIG);

  assert.ok(result['CLAUDE.md'], 'Must generate CLAUDE.md');
  assert.ok(result['AGENTS.md'], 'Must generate AGENTS.md');
  assert.ok(result['dsh.config.json'], 'Must generate dsh.config.json');
  assert.ok(result['.cursorrules'], 'Must generate .cursorrules');

  // Verify CLAUDE.md contents
  assert.ok(result['CLAUDE.md'].includes('CLAUDE.md — Project Guidance for Claude Code'));
  assert.ok(result['CLAUDE.md'].includes('npm test'));

  // Verify dsh.config.json is valid JSON
  const parsedDsh = JSON.parse(result['dsh.config.json']);
  assert.strictEqual(parsedDsh.name, 'my-project');
  assert.strictEqual(parsedDsh.scripts.test, 'npm test');

  // Verify scoped rules (Progressive Disclosure)
  assert.ok(result['.cursor/rules/api-endpoints.mdc'], 'Must generate Cursor .mdc scoped rule');
  assert.ok(result['.cursor/rules/api-endpoints.mdc'].includes('globs: src/api/**/*.ts, routes/**/*.ts'));
  assert.ok(result['.claude/rules/api-endpoints.md'], 'Must generate Claude Code scoped rule');

  // Verify MCP server transpilation
  assert.ok(result['.cursor/mcp.json'], 'Must generate .cursor/mcp.json');
  const cursorMcp = JSON.parse(result['.cursor/mcp.json']);
  assert.ok(cursorMcp.mcpServers.github, 'Must contain github MCP server');

  // Verify deterministic safety hooks (HarnessRisk hardening)
  assert.ok(result['.githooks/pre-commit'], 'Must generate pre-commit git hook');
  assert.ok(result['.githooks/pre-commit'].includes('.env'));
  assert.ok(result['scripts/safe-exec.sh'], 'Must generate safe-exec wrapper');
  assert.ok(result['scripts/safe-exec.sh'].includes('rm -rf /'));
});
