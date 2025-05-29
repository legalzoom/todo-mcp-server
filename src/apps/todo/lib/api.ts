import type { App } from '@modelcontextprotocol/ext-apps';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { Todo } from './types.js';

let _app: App;

export function setApp(app: App) {
  _app = app;
}

export async function fetchTodos(): Promise<Todo[]> {
  const result = await _app.callServerTool({ name: 'list-todos', arguments: {} });
  return extractTodos(result);
}

export async function saveTodo(data: {
  id?: string;
  title: string;
  completed?: boolean;
  description?: string;
}): Promise<void> {
  await _app.callServerTool({
    name: 'upsert-todo',
    arguments: {
      ...(data.id && { id: data.id }),
      title: data.title,
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.description && { description: data.description }),
    },
  });
}

export async function toggleTodo(todo: Todo): Promise<void> {
  await _app.callServerTool({
    name: 'upsert-todo',
    arguments: {
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
      ...(todo.description && { description: todo.description }),
    },
  });
}

export async function deleteTodo(id: string): Promise<void> {
  await _app.callServerTool({ name: 'delete-todo', arguments: { id } });
}

function extractTodos(result: CallToolResult): Todo[] {
  if (result.structuredContent) {
    const sc = result.structuredContent as { data?: Todo[] };
    if (Array.isArray(sc.data)) return sc.data;
  }
  const textItem = result.content?.find((c) => c.type === 'text');
  if (textItem && 'text' in textItem) {
    try {
      const parsed = JSON.parse(textItem.text);
      if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* ignore */
    }
  }
  return [];
}
