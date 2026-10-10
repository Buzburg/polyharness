/**
 * Transpiles harness configuration into .cursorrules for Cursor AI
 */
export function transpileCursor(config) {
  const lines = [];

  lines.push(`# .cursorrules — Cursor AI Rules`);
  lines.push(`<!-- Generated automatically by polyharness v0.1.0 — DO NOT EDIT DIRECTLY -->\n`);

  lines.push(`You are working on: ${config.name}`);
  lines.push(`Project Description: ${config.description || ''}\n`);

  if (config.guidelines) {
    lines.push(`Guidelines:`);
    for (const guide of config.guidelines) {
      lines.push(`- ${guide}`);
    }
    lines.push(``);
  }

  if (config.commands) {
    lines.push(`Development Commands:`);
    for (const [k, v] of Object.entries(config.commands)) {
      lines.push(`- ${k}: ${v}`);
    }
  }

  return lines.join('\n');
}

/**
 * Transpiles a scoped rule into .cursor/rules/<name>.mdc with frontmatter
 */
export function transpileCursorMdc(rule) {
  const globsStr = Array.isArray(rule.globs) ? rule.globs.join(', ') : (rule.globs || '*');
  const lines = [
    `---`,
    `description: ${rule.description || rule.name}`,
    `globs: ${globsStr}`,
    `alwaysApply: false`,
    `---`,
    ``,
    `# ${rule.name}`,
    ``,
    `<!-- Generated automatically by polyharness — DO NOT EDIT DIRECTLY -->`,
    ``,
    `${rule.description || ''}`,
    ``,
    `## Guidelines`
  ];

  if (rule.guidelines && Array.isArray(rule.guidelines)) {
    for (const g of rule.guidelines) {
      lines.push(`- ${g}`);
    }
  }

  return lines.join('\n');
}
