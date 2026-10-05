/**
 * Lints the harness config against rules and repository structure
 */
export function lintHarness(config) {
  const issues = [];

  if (!config.guidelines || config.guidelines.length === 0) {
    issues.push({ level: 'WARN', message: 'No guidelines specified; agent behavior may be unconstrained.' });
  }

  // Detect conflicting instructions
  const rules = (config.guidelines || []).map(g => g.toLowerCase());
  for (const r of rules) {
    if (r.includes('always commit') && rules.some(other => other.includes('never commit'))) {
      issues.push({ level: 'ERROR', message: 'Contradictory guidelines detected regarding git commits.' });
    }
    if (r.includes('always mock') && rules.some(other => other.includes('run real tests'))) {
      issues.push({ level: 'WARN', message: 'Possible conflict between mocking and running real tests.' });
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
