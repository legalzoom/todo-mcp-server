// Concept: Static resources — a resource with a fixed URI (no template variables).
// Unlike resource templates, this resource is always available at the same URI
// and appears directly in the resources/list response.
// https://modelcontextprotocol.io/specification/2025-11-25/server/resources

import type { ResourceDefinition } from '../registry.js';

const readCallback: ResourceDefinition['readCallback'] = async (uri) => ({
  contents: [
    {
      uri: uri.href,
      mimeType: 'application/json',
      text: JSON.stringify(
        {
          data: {
            categories: ['planning', 'prioritization', 'habits', 'focus'],
            tools: ['list-todos', 'upsert-todo', 'delete-todo', 'breakdown-todo', 'import-todos'],
            prompts: ['analyze-todo', 'todo-coach', 'todo-planning'],
          },
        },
        null,
        2,
      ),
    },
  ],
});

export const configResource: ResourceDefinition = {
  title: 'Todo Service Config',
  uri: 'todos://config',
  metadata: {
    description: 'Static resource listing available categories, tools, and prompts',
    mimeType: 'application/json',
  },
  readCallback,
};
