import { For, Show } from 'solid-js';
import type { Todo } from '../lib/types.js';
import { TodoRow } from './TodoRow.jsx';

export function TodoList(props: {
  todos: Todo[];
  loading: boolean;
  editingId: string | null;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onEditCancel: () => void;
  onSave: (data: { id?: string; title: string; completed?: boolean; description?: string }) => void;
  onDelete: (todo: Todo) => void;
}) {
  return (
    <div class={`todo-list${props.loading ? ' loading' : ''}`}>
      <Show
        when={props.todos.length > 0}
        fallback={<p class="empty-state">{props.loading ? 'Loading todos…' : 'No todos yet. Create one!'}</p>}
      >
        <For each={props.todos}>
          {(todo) => (
            <TodoRow
              todo={todo}
              editing={props.editingId === todo.id}
              onToggle={props.onToggle}
              onEdit={props.onEdit}
              onEditCancel={props.onEditCancel}
              onSave={props.onSave}
              onDelete={props.onDelete}
            />
          )}
        </For>
      </Show>
    </div>
  );
}
