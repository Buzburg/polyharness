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

  if (config.rules && !Array.isArray(config.rules)) {
    errors.push("'rules' must be an array of scoped rule objects");
  }

  if (config.mcp_servers && (typeof config.mcp_servers !== 'object' || Array.isArray(config.mcp_servers))) {
    errors.push("'mcp_servers' must be an object defining MCP servers");
  }

  if (Array.isArray(config.rules)) {
    const names = new Set();
    for (const rule of config.rules) {
      if (!rule || typeof rule.name !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(rule.name)) {
        errors.push('Rule names must contain only letters, numbers, underscores and hyphens');
      } else if (names.has(rule.name.toLowerCase())) {
        errors.push('Rule names must be unique, ignoring case');
      } else { names.add(rule.name.toLowerCase()); }
      if (!rule || !Array.isArray(rule.guidelines) || !rule.guidelines.every(x => typeof x === 'string')) {
        errors.push('Rule guidelines must be strings');
      }
    }
  }
  if (Array.isArray(config.guidelines) && !config.guidelines.every(x => typeof x === 'string')) {
    errors.push('Guidelines must be strings');
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
  rules: [
    {
      name: "api-endpoints",
      description: "Standards for REST API routes and handlers",
      globs: ["src/api/**/*.ts", "routes/**/*.ts"],
      guidelines: [
        "Validate incoming request parameters with schema validation",
        "Return standardized JSON error responses"
      ]
    },
    {
      name: "testing-standards",
      description: "Requirements for unit and integration tests",
      globs: ["tests/**/*.test.js", "tests/**/*.test.ts"],
      guidelines: [
        "Mock external HTTP requests",
        "Assert error conditions and edge cases"
      ]
    }
  ],
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
  mcp_servers: {
    github: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}"
      }
    }
  },
  skills: [
    {
      name: "git-commit-helper",
      description: "Generates standardized conventional commits",
      prompt: "Follow conventional commit format: feat(scope): message"
    }
  ]
};
