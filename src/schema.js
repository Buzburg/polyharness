/**
 * Validates the harness configuration schema
 */
export function validateHarnessConfig(config) {
  const errors = [];

  if (!config) {
    return { valid: false, errors: ['Configuration is empty or null'] };
  }

  if (!config.name || typeof config.name !== 'string') {
    errors.push("Missing or invalid 'name' field");
  }

  if (!config.version) {
    errors.push("Missing 'version' field");
  }

  if (!config.guidelines || !Array.isArray(config.guidelines)) {
    errors.push("'guidelines' must be an array of strings");
  }

  if (!config.commands || typeof config.commands !== 'object') {
    errors.push("'commands' must be an object defining build/test scripts");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export const DEFAULT_CONFIG = {
  name: "my-project",
  version: "1.0.0",
  description: "Production project configured with unified agent harness",
  stack: {
    primary: "typescript",
    framework: "node",
    package_manager: "npm"
  },
  guidelines: [
    "Always run tests before completing changes",
    "Preserve existing comments and docstrings",
    "Write concise commit messages following Conventional Commits",
    "Never commit API keys or plain secrets"
  ],
  commands: {
    build: "npm run build",
    test: "npm test",
    lint: "npm run lint"
  },
  safety: {
    destructive_commands_deny: [
      "rm -rf /",
      "git push --force",
      "drop database"
    ],
    protected_paths: [
      ".env",
      ".git",
      "secrets/"
    ]
  },
  skills: [
    {
      name: "git-commit-helper",
      description: "Generates standardized conventional commits",
      prompt: "Follow conventional commit format: feat(scope): message"
    }
  ]
};
