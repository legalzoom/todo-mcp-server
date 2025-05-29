// Concept: Resources & Resource Templates — server-exposed data identified by URI.
// This template uses a URI pattern with a `list` callback so clients can discover
// all available todos, then read individual ones via todos://detail/{todoId}.
// https://modelcontextprotocol.io/specification/2025-11-25/server/resources

import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { listTodos, readTodo } from '../../client.js';
import { type ResourceTemplateDefinition, resourceResponse } from '../registry.js';

const readCallback: ResourceTemplateDefinition['readCallback'] = async (uri, variables, extra) => {
  const todoId = variables.todoId as string;
  const sessionId = extra.sessionId ?? 'default';

  const todo = readTodo(sessionId, todoId);

  if (!todo) {
    return resourceResponse(
      {
        errors: [{ detail: `Todo '${todoId}' not found in this session` }],
      },
      new URL(uri.href),
    );
  }

  return resourceResponse({ data: todo }, uri);
};

export const todosTemplate: ResourceTemplateDefinition = {
  title: 'Todos',
  resourceTemplate: new ResourceTemplate('todos://detail/{+todoId}', {
    list: async (extra) => {
      try {
        const sessionId = extra?.sessionId ?? 'default';
        return {
          resources: listTodos(sessionId).map((t) => ({
            uri: `todos://detail/${t.id}`,
            name: t.title || t.id,
          })),
        };
      } catch (error) {
        console.error('[resources] Failed to list todos:', error);
        return { resources: [] };
      }
    },
  }),
  metadata: { description: 'Todos' },
  readCallback,
};
