# polyharness 🌐

> **The Universal Transpiler & Package Manager for AI Agent Harnesses**

[![CI](https://github.com/buzburgai-arch/polyharness/actions/workflows/ci.yml/badge.svg)](https://github.com/buzburgai-arch/polyharness/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/polyharness.svg)](https://www.npmjs.com/package/polyharness)

`polyharness` is the "Babel + pnpm" for AI coding agent configurations. Instead of manually maintaining and synchronizing divergent rules across `CLAUDE.md`, `AGENTS.md`, `dsh.config.json` (DeepSeek Harness), and `.cursorrules`, define your project once in `harness.config.json` and compile to all platforms with a single command.

```
              ┌───────────────────────────┐
              │    harness.config.json    │
              │  (Single Source of Truth) │
              └─────────────┬─────────────┘
                            │  polyharness build
         ┌──────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼
    CLAUDE.md          AGENTS.md         dsh.config.json    .cursorrules
 (Anthropic specs)    (OpenCode/AGY)   (DeepSeek Harness)     (Cursor)
```

---

## ⚡ Features

- **Write Once, Target Everywhere:** Generates calibrated `CLAUDE.md`, `AGENTS.md`, `dsh.config.json`, and `.cursorrules`.
- **Conflict & Contradiction Detection:** Built-in semantic linter detects opposing instructions before agents get confused.
- **Drift Protection:** CI check guarantees that scripts referenced in agent instructions match actual project files.
- **Zero Heavy Dependencies:** Lightweight, blazingly fast ESM implementation.

---

## 🚀 Quickstart

### Installation

```bash
# Global install via npm
npm install -g polyharness

# Or npx
npx polyharness init
```

### Workflow

```bash
# 1. Initialize template in your repo
polyharness init

# 2. Compile to all agent formats
polyharness build

# 3. Lint for contradictions & missing verification scripts
polyharness check
```

---

## 📝 Example `harness.config.json`

```json
{
  "name": "my-service",
  "version": "1.0.0",
  "description": "Payment microservice",
  "stack": {
    "primary": "typescript",
    "framework": "express"
  },
  "guidelines": [
    "Run tests before completing tasks",
    "Preserve docstrings and existing tests",
    "Never commit .env files"
  ],
  "commands": {
    "test": "npm test",
    "build": "npm run build"
  },
  "safety": {
    "destructive_commands_deny": ["rm -rf /", "git push --force"],
    "protected_paths": [".env", "config/secrets.json"]
  }
}
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

[MIT](LICENSE) © 2026 Buzburg AI
