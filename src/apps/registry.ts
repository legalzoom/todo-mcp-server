import fs from 'node:fs/promises';
import path from 'node:path';
import {
  type McpUiAppResourceConfig,
  type McpUiAppToolConfig,
  RESOURCE_MIME_TYPE,
  type ReadResourceCallback,
  registerAppResource,
  registerAppTool,
  type ToolCallback,
} from '@modelcontextprotocol/ext-apps/server';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export { RESOURCE_MIME_TYPE };

// Resolve dist/apps whether running from source (.ts) or compiled output (.js)
const DIST_DIR = import.meta.filename.endsWith('.ts')
  ? path.join(import.meta.dirname, '..', '..', 'dist', 'apps')
  : path.join(import.meta.dirname, '..', '..', 'apps');

export interface AppDefinition {
  title: string;
  description: string;
  /** File name of the bundled HTML in dist/apps (e.g. "index.html") */
  htmlFile: string;
  /** Tool input schema — pass {} for no inputs */
  inputSchema?: McpUiAppToolConfig['inputSchema'];
  /** Tool output schema */
  outputSchema?: McpUiAppToolConfig['outputSchema'];
  /** Tool callback — defaults to returning a launch confirmation text */
  toolCallback?: ToolCallback;
  /** Extra resource config (CSP, etc.) */
  resourceConfig?: Omit<McpUiAppResourceConfig, 'mimeType'>;
  /** Custom resource read callback — defaults to reading htmlFile from dist */
  readCallback?: ReadResourceCallback;
}

export const register = (server: McpServer, name: string, def: AppDefinition) => {
  const resourceUri = `ui://${name}/${def.htmlFile}`;

  const toolCb: ToolCallback =
    def.toolCallback ??
    (async (): Promise<CallToolResult> => ({
      content: [{ type: 'text', text: `${def.title} app launched.` }],
    }));

  registerAppTool(
    server,
    name,
    {
      title: def.title,
      description: def.description,
      ...(def.inputSchema && { inputSchema: def.inputSchema }),
      ...(def.outputSchema && { outputSchema: def.outputSchema }),
      _meta: { ui: { resourceUri } },
    },
    toolCb,
  );

  const readCb: ReadResourceCallback =
    def.readCallback ??
    (async (): Promise<{ contents: [{ uri: string; mimeType: string; text: string }] }> => {
      const html = await fs.readFile(path.join(DIST_DIR, def.htmlFile), 'utf-8');
      return { contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }] };
    });

  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    {
      mimeType: RESOURCE_MIME_TYPE,
      ...def.resourceConfig,
    },
    readCb,
  );
};
