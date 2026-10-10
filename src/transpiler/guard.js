/**
 * Generates deterministic runtime guardrails (pre-commit hooks, safe wrappers)
 * Based on HarnessRisk (arXiv:2608.17597) recommendations for action control.
 */

export function generatePreCommitHook(config) {
  const protectedPaths = config.safety?.protected_paths || [];
  const pathsPattern = protectedPaths.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  return `#!/bin/sh
# Generated automatically by polyharness — DO NOT EDIT DIRECTLY
# Enforces deterministic protection for sensitive repository paths

PROTECTED_PATTERN="${pathsPattern}"

if [ -z "$PROTECTED_PATTERN" ]; then
  exit 0
fi

STAGED_FILES=$(git diff --cached --name-only)

for file in $STAGED_FILES; do
  if echo "$file" | grep -E -q "($PROTECTED_PATTERN)"; then
    echo "❌ [polyharness-guard] Commit blocked: staging protected path '$file' is forbidden by safety policy."
    exit 1
  fi
done

exit 0
`;
}

export function generateSafeExecScript(config) {
  const denyCommands = config.safety?.destructive_commands_deny || [];
  const jsonDeny = JSON.stringify(denyCommands);

  return `#!/bin/sh
# Generated automatically by polyharness — DO NOT EDIT DIRECTLY
# Intercepts agent command execution against prohibited commands

COMMAND="$*"
DENY_LIST='${jsonDeny}'

if [ -z "$COMMAND" ]; then
  echo "Usage: safe-exec <command...>"
  exit 1
fi

for blocked in $(echo "$DENY_LIST" | sed 's/[][]//g' | tr ',' '\\n' | tr -d '"' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'); do
  if [ -n "$blocked" ] && echo "$COMMAND" | grep -F -q "$blocked"; then
    echo "❌ [polyharness-guard] Execution blocked: command '$COMMAND' contains forbidden pattern '$blocked'."
    exit 126
  fi
done

exec "$@"
`;
}
