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
