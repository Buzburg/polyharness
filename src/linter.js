/**
 * Lints the harness config against rules and repository structure
 */
export function lintHarness(config) {
  const issues = [];

  if (!config.guidelines || config.guidelines.length === 0) {
    issues.push({ level: 'WARN', message: 'No guidelines specified; agent behavior may be unconstrained.' });
  }

  // Detect conflicting instructions across global guidelines and scoped rules
  const allGuidelines = [...(config.guidelines || [])];
  if (config.rules && Array.isArray(config.rules)) {
    for (const rule of config.rules) {
      if (!rule.name) {
        issues.push({ level: 'ERROR', message: 'Scoped rule is missing a required name.' });
      }
      if (!rule.globs || (Array.isArray(rule.globs) && rule.globs.length === 0)) {
        issues.push({ level: 'WARN', message: `Scoped rule '${rule.name || 'unnamed'}' has no globs specified.` });
      }
      if (rule.guidelines && Array.isArray(rule.guidelines)) {
        allGuidelines.push(...rule.guidelines);
      }
    }
  }

  const rules = allGuidelines.map(g => g.toLowerCase());
  for (const r of rules) {
    if (r.includes('always commit') && rules.some(other => other.includes('never commit'))) {
      issues.push({ level: 'ERROR', message: 'Contradictory guidelines detected regarding git commits.' });
    }
    if (r.includes('always mock') && rules.some(other => other.includes('run real tests'))) {
      issues.push({ level: 'WARN', message: 'Possible conflict between mocking and running real tests.' });
    }
  }

  // Safety checks (HarnessRisk: Configuration security)
  if (!config.safety || !config.safety.protected_paths || config.safety.protected_paths.length === 0) {
    issues.push({ level: 'WARN', message: 'No protected paths configured; sensitive files like .env may be exposed to agents.' });
  }

  // MCP server checks
  if (config.mcp_servers) {
    for (const [srvName, srv] of Object.entries(config.mcp_servers)) {
      if (!srv.command) {
        issues.push({ level: 'ERROR', message: `MCP server '${srvName}' has no executable command specified.` });
      }
    }
  }

  // Check commands
  if (!config.commands || Object.keys(config.commands).length === 0) {
    issues.push({ level: 'WARN', message: 'No verification commands defined (e.g. test, build).' });
  }

  return {
    clean: issues.filter(i => i.level === 'ERROR').length === 0,
    issues,
  };
}
