/**
 * Transpiles harness configuration into dsh.config.json for DeepSeek Harness
 */
export function transpileDsh(config) {
  const dshConfig = {
    $schema: "https://dsh.deepseek.com/schema/v1.json",
    name: config.name,
    version: config.version,
    description: config.description || "",
    rules: config.guidelines || [],
    scripts: config.commands || {},
    sandbox: {
      denyCommands: config.safety?.destructive_commands_deny || [],
      protectedPaths: config.safety?.protected_paths || []
    },
    plugins: (config.skills || []).map(skill => ({
      name: skill.name,
      enabled: true,
      description: skill.description
    }))
  };

  return JSON.stringify(dshConfig, null, 2);
}
