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
});
