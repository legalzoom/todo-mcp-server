// Concept: Lifecycle — the McpServer constructor declares server info and
// capabilities. The SDK negotiates these with the client during initialization.
// https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
//
// The SDK also provides many features out of the box without explicit code here:
//   • Ping        — https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/ping
//   • Cancellation— https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/cancellation
//   • Pagination  — https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/pagination
//   • Transports  — https://modelcontextprotocol.io/specification/2025-11-25/basic/transports

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import pkg from '../package.json' with { type: 'json' };
import { registerApps } from './apps/index.js';
import { registerPrompts } from './prompts/index.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';

export const initializeServer = (): McpServer => {
  const server = new McpServer({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  });

  registerTools(server);
  registerResources(server);
  registerPrompts(server);
  registerApps(server);

  return server;
};
