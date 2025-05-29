import type {
  McpServer,
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  ResourceMetadata,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

export { errorMessage, resourceResponse } from '../../pkg/responses.js';
export { ResourceTemplate };

export interface ResourceDefinition {
  title: string;
  uri: string;
  metadata: ResourceMetadata;
  readCallback: ReadResourceCallback;
}

export interface ResourceTemplateDefinition {
  title: string;
  resourceTemplate: ResourceTemplate;
  metadata: ResourceMetadata;
  readCallback: ReadResourceTemplateCallback;
}

export type { ReadResourceCallback, ReadResourceTemplateCallback, ResourceMetadata };

export function register(server: McpServer, name: string, def: ResourceDefinition): void;
export function register(server: McpServer, name: string, def: ResourceTemplateDefinition): void;
export function register(server: McpServer, name: string, def: ResourceDefinition | ResourceTemplateDefinition): void {
  const config = { title: def.title, ...def.metadata };

  if ('resourceTemplate' in def) {
    server.registerResource(name, def.resourceTemplate, config, def.readCallback);
  } else {
    server.registerResource(name, def.uri, config, def.readCallback);
  }
}
