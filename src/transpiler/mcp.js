/**
 * Transpiles harness MCP server definitions into target formats
 */

export function transpileCursorMcp(config) {
  if (!config.mcp_servers) return null;

  const mcpServers = {};
  for (const [name, server] of Object.entries(config.mcp_servers)) {
    mcpServers[name] = {
      command: server.command || "npx",
      args: server.args || [],
      env: server.env || {}
    };
  }

  return JSON.stringify({ mcpServers }, null, 2);
}

export function transpileClaudeMcp(config) {
  if (!config.mcp_servers) return null;

  const mcpServers = {};
  for (const [name, server] of Object.entries(config.mcp_servers)) {
    mcpServers[name] = {
      command: server.command || "npx",
      args: server.args || [],
      env: server.env || {}
    };
  }

  return JSON.stringify({ mcpServers }, null, 2);
}
