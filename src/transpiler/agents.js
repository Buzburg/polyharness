/**
 * Transpiles harness configuration into AGENTS.md for OpenCode / Antigravity agents
 */
export function transpileAgents(config) {
  const lines = [];

  lines.push(`# AGENTS.md`);
  lines.push(`<!-- Generated automatically by polyharness v0.1.0 — DO NOT EDIT DIRECTLY -->\n`);
  lines.push(`## Repository Identity`);
  lines.push(`- **Name**: ${config.name}`);
  lines.push(`- **Version**: ${config.version}`);
  if (config.stack) {
    lines.push(`- **Primary Stack**: ${config.stack.primary || 'Universal'} (${config.stack.framework || ''})`);
  }
  lines.push(``);

  lines.push(`## Agent Rules of Engagement`);
  if (config.guidelines) {
    for (const guide of config.guidelines) {
      lines.push(`- ${guide}`);
    }
  }
  lines.push(``);

  if (config.commands) {
    lines.push(`## Verification Scripts`);
    for (const [key, cmd] of Object.entries(config.commands)) {
      lines.push(`- \`${cmd}\` (${key})`);
    }
    lines.push(``);
  }

  if (config.safety) {
    lines.push(`## Guardrails`);
    if (config.safety.protected_paths) {
      lines.push(`- Protected paths: ${config.safety.protected_paths.map(p => `\`${p}\``).join(', ')}`);
    }
    lines.push(``);
  }

  return lines.join('\n');
}
