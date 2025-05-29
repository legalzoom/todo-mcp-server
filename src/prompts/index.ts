import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register } from './registry.js';
import { analyzeTodoPrompt } from './todo/analyzeTodoPrompt.js';
import { todoCoachPrompt } from './todo/coachPrompt.js';

export const registerPrompts = (server: McpServer) => {
  register(server, 'analyze-todo', analyzeTodoPrompt);
  register(server, 'todo-coach', todoCoachPrompt);
};
