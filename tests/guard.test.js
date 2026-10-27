import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, writeFileSync, rmSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {generateSafeExecScript, generatePreCommitHook} from '../src/index.js';

test('execution filter matches whole patterns and keeps policy strings as data', () => {
 const d=mkdtempSync(join(tmpdir(),'polyguard-'));
 try {
  const p=join(d,'safe.sh');
  writeFileSync(p,generateSafeExecScript({safety:{destructive_commands_deny:['git push --force', "x'$(touch injected)"]}}));
  assert.equal(spawnSync('sh',[p,'printf','%s','git status'],{cwd:d}).status,0);
  assert.equal(spawnSync('sh',[p,'printf','%s','git push --force'],{cwd:d}).status,126);
  assert.equal(existsSync(join(d,'injected')),false);
 } finally {rmSync(d,{recursive:true,force:true});}
});

test('precommit handles spaces and protects exact paths rather than substrings', () => {
 const d=mkdtempSync(join(tmpdir(),'polyhook-'));
 try {
  execFileSync('git',['init','-q'],{cwd:d});
  writeFileSync(join(d,'safe.txt'),'fixture');execFileSync('git',['add','safe.txt'],{cwd:d});
  const p=join(d,'hook.sh');writeFileSync(p,generatePreCommitHook({safety:{protected_paths:['secret file.txt']}}));
  assert.equal(spawnSync('sh',[p],{cwd:d}).status,0);
  writeFileSync(join(d,'secret file.txt'),'fixture');execFileSync('git',['add','secret file.txt'],{cwd:d});
  assert.equal(spawnSync('sh',[p],{cwd:d}).status,1);
 } finally {rmSync(d,{recursive:true,force:true});}
});
