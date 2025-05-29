import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { initializeServer } from '../../src/server.js';

const transport = new StdioServerTransport();

const server = initializeServer();

console.log('Connecting MCP server to STDIO transport...');
await server.connect(transport);
