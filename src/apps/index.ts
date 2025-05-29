import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register } from './registry.js';
import { todoApp } from './todo/app.js';

export const registerApps = (server: McpServer) => {
  register(server, 'todo', todoApp);
};
