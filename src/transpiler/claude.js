/**
 * Transpiles harness configuration into CLAUDE.md for Anthropic Claude Code
 */
export function transpileClaude(config) {
  const lines = [];

  lines.push(`# CLAUDE.md — Project Guidance for Claude Code`);
  lines.push(`<!-- Generated automatically by polyharness v0.1.0 — DO NOT EDIT DIRECTLY -->\n`);
  lines.push(`## Project Overview`);
  lines.push(`${config.description || config.name}\n`);

  if (config.commands) {
    lines.push(`## Essential Commands`);
    for (const [key, cmd] of Object.entries(config.commands)) {
      lines.push(`- **${key}**: \`${cmd}\``);
    }
    lines.push(``);
  }

  if (config.guidelines && config.guidelines.length > 0) {
    lines.push(`## Core Guidelines & Constraints`);
    for (const guide of config.guidelines) {
      lines.push(`- ${guide}`);
    }
    lines.push(``);
  }

  if (config.safety) {
    lines.push(`## Safety Boundaries`);
    if (config.safety.destructive_commands_deny) {
      lines.push(`- **Blocked Commands**: ${config.safety.destructive_commands_deny.join(', ')}`);
    }
    if (config.safety.protected_paths) {
      lines.push(`- **Protected Files**: ${config.safety.protected_paths.join(', ')}`);
    }
    lines.push(``);
  }

  if (config.skills && config.skills.length > 0) {
    lines.push(`## Active Skills`);
    for (const skill of config.skills) {
      lines.push(`- **${skill.name}**: ${skill.description}`);
    }
    lines.push(``);
  }

  return lines.join('\n');
}

/**
 * Transpiles a scoped rule into .claude/rules/<name>.md
 */
export function transpileClaudeRule(rule) {
  const lines = [
    `# Rule: ${rule.name}`,
    `<!-- Generated automatically by polyharness — DO NOT EDIT DIRECTLY -->`,
    ``,
    `${rule.description || ''}`,
    ``
  ];

  if (rule.globs) {
    const globsStr = Array.isArray(rule.globs) ? rule.globs.join(', ') : rule.globs;
    lines.push(`**Applicable Paths**: \`${globsStr}\`\n`);
  }

  lines.push(`## Specific Guidelines`);
  if (rule.guidelines && Array.isArray(rule.guidelines)) {
    for (const g of rule.guidelines) {
      lines.push(`- ${g}`);
    }
  }

  return lines.join('\n');
}
