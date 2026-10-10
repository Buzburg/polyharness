import test from 'node:test';
import assert from 'node:assert';
import { lintHarness, DEFAULT_CONFIG } from '../src/index.js';

test('lintHarness passes clean default configuration', () => {
  const result = lintHarness(DEFAULT_CONFIG);
  assert.strictEqual(result.clean, true);
  assert.strictEqual(result.issues.length, 0);
});

test('lintHarness flags contradictory instructions', () => {
  const badConfig = {
    ...DEFAULT_CONFIG,
    guidelines: [
      'Always commit changes immediately',
      'Never commit code without manual review'
    ]
  };

  const result = lintHarness(badConfig);
  assert.strictEqual(result.clean, false);
  assert.ok(result.issues.some(i => i.message.includes('Contradictory guidelines')));
});

test('lintHarness flags invalid scoped rules and missing MCP commands', () => {
  const badConfig = {
    ...DEFAULT_CONFIG,
    rules: [
      {
        name: '',
        globs: [],
        guidelines: ['Do something']
      }
    ],
    mcp_servers: {
      broken: {
        command: ''
      }
    }
  };

  const result = lintHarness(badConfig);
  assert.strictEqual(result.clean, false);
  assert.ok(result.issues.some(i => i.message.includes('missing a required name')));
  assert.ok(result.issues.some(i => i.message.includes('no executable command')));
});
