import { App } from '@modelcontextprotocol/ext-apps';
import { createSignal, Show } from 'solid-js';
import { render } from 'solid-js/web';
import { TodoForm } from './components/TodoForm.jsx';
import { TodoList } from './components/TodoList.jsx';
import { deleteTodo, fetchTodos, saveTodo, setApp, toggleTodo } from './lib/api.js';
import { applyHostContext } from './lib/host.js';
import type { Todo } from './lib/types.js';
import './styles/global.css';
import './styles/app.css';

// --- MCP App ---

declare const __APP_VERSION__: string;

const app = new App({ name: 'Todo Admin', version: __APP_VERSION__ });
setApp(app);

// --- Root Component ---

function TodoAdmin() {
  let mainEl!: HTMLElement;

  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [creating, setCreating] = createSignal(false);
  const [editingId, setEditingId] = createSignal<string | null>(null);

  async function loadTodos() {
    setLoading(true);
    try {
      setTodos(await fetchTodos());
    } catch (e) {
      console.error('Failed to load todos:', e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setCreating(true);
  }

  function openEdit(todo: Todo) {
    setCreating(false);
    setEditingId(todo.id);
  }

  async function handleSave(data: { id?: string; title: string; completed?: boolean; description?: string }) {
    try {
      await saveTodo(data);
      setCreating(false);
      setEditingId(null);
      await loadTodos();
    } catch (e) {
      console.error('Failed to save todo:', e);
      await app.sendLog({ level: 'error', data: `Save failed: ${e}` });
    }
  }

  async function handleToggle(todo: Todo) {
    try {
      await toggleTodo(todo);
      await loadTodos();
    } catch (e) {
      console.error('Failed to toggle todo:', e);
    }
  }

  async function handleDelete(todo: Todo) {
    try {
      await deleteTodo(todo.id);
      await loadTodos();
    } catch (e) {
      console.error('Failed to delete todo:', e);
      await app.sendLog({ level: 'error', data: `Delete failed: ${e}` });
    }
  }

  // --- Host context ---

  app.onhostcontextchanged = (ctx) => applyHostContext(ctx, mainEl);

  app.onteardown = async () => {
    console.info('Todo Admin tearing down');
    return {};
  };

  app.ontoolinput = (params) => console.info('Tool input:', params);
  app.ontoolresult = () => loadTodos();
  app.ontoolcancelled = (params) => console.info('Tool cancelled:', params.reason);
  app.onerror = console.error;

  app.connect().then(() => {
    const ctx = app.getHostContext();
    if (ctx) applyHostContext(ctx, mainEl);
    loadTodos();
  });

  return (
    <main ref={mainEl} class="main">
      <header class="header">
        <h3>Todos</h3>
        <Show when={!creating()}>
          <button type="button" class="btn btn-accent" onClick={openCreate}>
            + New Todo
          </button>
        </Show>
      </header>

      <Show when={creating()}>
        <TodoForm todo={null} onSave={handleSave} onCancel={() => setCreating(false)} />
      </Show>

      <TodoList
        todos={todos()}
        loading={loading()}
        editingId={editingId()}
        onToggle={handleToggle}
        onEdit={openEdit}
        onEditCancel={() => setEditingId(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </main>
  );
}

const root = document.getElementById('app');
if (root) render(() => <TodoAdmin />, root);
