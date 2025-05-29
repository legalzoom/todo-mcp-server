import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
  ToolAnnotations,
} from '@modelcontextprotocol/sdk/types.js';

export { errorMessage, toolResponse } from '../../pkg/responses.js';

export interface ToolDefinition {
  title: string;
  description: string;
  annotations?: ToolAnnotations;
  inputSchema: Record<string, any>;
  outputSchema?: Record<string, any>;
  callback: (
    args: Record<string, any>,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => Promise<CallToolResult>;
}

export const register = (server: McpServer, name: string, def: ToolDefinition) => {
  server.registerTool(
    name,
    {
      title: def.title,
      description: def.description,
      annotations: def.annotations,
      inputSchema: def.inputSchema,
      ...(def.outputSchema && { outputSchema: def.outputSchema }),
    },
    def.callback as any,
  );
};
