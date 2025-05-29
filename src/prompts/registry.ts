import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type { GetPromptResult, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js';

export interface PromptDefinition {
  title: string;
  description: string;
  argsSchema?: Record<string, any>;
  callback: (
    args: Record<string, any>,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => GetPromptResult | Promise<GetPromptResult>;
}

export const register = (server: McpServer, name: string, def: PromptDefinition) => {
  server.registerPrompt(
    name,
    {
      title: def.title,
      description: def.description,
      ...(def.argsSchema && { argsSchema: def.argsSchema }),
    },
    def.callback as any,
  );
};
