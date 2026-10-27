# Polyharness 🌐

**One config. Every coding assistant.**

Keep your project instructions in one place. Polyharness turns `harness.config.json` into agent instruction files, scoped rules, and MCP configuration templates for several coding tools.

## Try it

Requires Node.js 22+ and Git. No runtime npm dependencies.

```sh
git clone https://github.com/Buzburg/polyharness.git
cd polyharness
npm install --global .
```

In a disposable project directory:

```sh
polyharness init
# Edit harness.config.json for your own commands, rules, and tools.
polyharness check
polyharness build
```

**Build overwrites generated files.** Commit or back up existing instruction files first, then review the generated diff. The example MCP server is a template: configure a real server and credentials before use. Environment placeholders are emitted literally; expansion depends on the client.

## Generated files

- `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, and `dsh.config.json`.
- Named rules under `.claude/rules/` and `.cursor/rules/`.
- MCP templates under `.claude/mcp.json` and `.cursor/mcp.json`.
- Optional `.githooks/pre-commit` and `scripts/safe-exec.sh` policy filters.

Client configuration formats evolve; inspect output and place MCP templates where your installed client expects them. Polyharness generates text; it cannot guarantee identical behavior across models or clients.

## Opt-in checks

```sh
polyharness protect
git config core.hooksPath .githooks
sh scripts/safe-exec.sh git status
```

Run `build` before using the generated execution filter. `protect` writes an executable pre-commit hook; enabling it replaces the repository's configured hooks path. Generated checks require Node.js. They match explicit paths or literal command patterns and are bypassable; they are not a sandbox or a security boundary.

## Verify

```sh
npm test
npm pack --dry-run
```

Developer beta. [Release verification](RELEASE_VERIFICATION.md). MIT licensed. Built by Buzburg.
