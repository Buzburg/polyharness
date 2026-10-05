#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { compileAll, DEFAULT_CONFIG, lintHarness, validateHarnessConfig } from '../src/index.js';

const args = process.argv.slice(2);
const command = args[0] || 'help';

const CONFIG_PATH = path.resolve(process.cwd(), 'harness.config.json');

switch (command) {
  case 'init': {
    if (fs.existsSync(CONFIG_PATH)) {
      console.log('⚠ harness.config.json already exists in this directory.');
      process.exit(0);
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
    console.log('✔ Created harness.config.json with default schema template.');
    break;
  }

  case 'build': {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.error('Error: harness.config.json not found. Run `polyharness init` first.');
      process.exit(1);
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(raw);

    const validation = validateHarnessConfig(config);
    if (!validation.valid) {
      console.error('Configuration errors:');
      for (const err of validation.errors) {
        console.error(`  ✖ ${err}`);
      }
      process.exit(1);
    }

    const compiled = compileAll(config);
    for (const [filename, content] of Object.entries(compiled)) {
      const outPath = path.resolve(process.cwd(), filename);
      fs.writeFileSync(outPath, content, 'utf-8');
      console.log(`✔ Generated ${filename}`);
    }
    console.log('✨ All agent harness targets built successfully!');
    break;
  }

  case 'check': {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.error('Error: harness.config.json not found.');
      process.exit(1);
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(raw);
    const result = lintHarness(config);

    if (result.issues.length === 0) {
      console.log('✔ Configuration is clean with 0 issues.');
    } else {
      for (const issue of result.issues) {
        const symbol = issue.level === 'ERROR' ? '✖' : '⚠';
        console.log(`${symbol} [${issue.level}] ${issue.message}`);
      }
    }
    if (!result.clean) {
      process.exit(1);
    }
    break;
  }

  case 'version': {
    console.log('polyharness v0.1.0 — Universal AI Agent Harness Transpiler');
    break;
  }

  default: {
    console.log(`polyharness — Universal Transpiler & Package Manager for AI Agent Harnesses

Usage:
  polyharness init       Generate harness.config.json template
  polyharness build      Compile harness config to CLAUDE.md, AGENTS.md, dsh.config.json, .cursorrules
  polyharness check      Lint harness config and detect contradictory rules
  polyharness version    Display version information`);
    break;
  }
}
