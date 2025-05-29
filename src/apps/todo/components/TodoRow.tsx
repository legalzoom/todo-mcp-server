import { createSignal, Show } from 'solid-js';
import type { Todo } from '../lib/types.js';

export function TodoRow(props: {
  todo: Todo;
  editing: boolean;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onEditCancel: () => void;
  onSave: (data: { id?: string; title: string; completed?: boolean; description?: string }) => void;
  onDelete: (todo: Todo) => void;
}) {
  const [confirming, setConfirming] = createSignal(false);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    props.onSave({
      id: props.todo.id,
      title: (fd.get('title') as string).trim(),
      completed: fd.has('completed'),
      description: (fd.get('description') as string)?.trim() || undefined,
    });
  };

  return (
    <div
      class={`todo-row${props.todo.completed ? ' completed' : ''}${props.editing ? ' editing' : ''}`}
      data-id={props.todo.id}
    >
      <div class="todo-row-summary">
        <button type="button" class="btn-icon toggle-btn" title="Toggle" onClick={() => props.onToggle(props.todo)}>
          {props.todo.completed ? '✅' : '⬜'}
        </button>
        <button type="button" class="todo-info" onClick={() => !props.editing && props.onEdit(props.todo)}>
          <div class="todo-title">{props.todo.title}</div>
          {props.todo.description && <div class="todo-meta">{props.todo.description}</div>}
        </button>
        <Show
          when={!confirming()}
          fallback={
            <div class="confirm-inline">
              <span class="confirm-text">Delete?</span>
              <button type="button" class="btn btn-danger btn-sm" onClick={() => props.onDelete(props.todo)}>
                Yes
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onClick={() => setConfirming(false)}>
                No
              </button>
            </div>
          }
        >
          <div class="todo-actions">
            <button
              type="button"
              class="btn-icon edit-btn"
              title="Edit"
              onClick={() => (props.editing ? props.onEditCancel() : props.onEdit(props.todo))}
            >
              {props.editing ? '✕' : '✏️'}
            </button>
            <button type="button" class="btn-icon delete-btn" title="Delete" onClick={() => setConfirming(true)}>
              🗑️
            </button>
          </div>
        </Show>
      </div>

      <div class="todo-row-expand">
        <Show when={props.editing}>
          <form class="todo-edit-form" onSubmit={handleSubmit}>
            <label for={`title-${props.todo.id}`}>Title</label>
            <input type="text" id={`title-${props.todo.id}`} name="title" required value={props.todo.title} />

            <label for={`completed-${props.todo.id}`} class="checkbox-label">
              <input
                type="checkbox"
                id={`completed-${props.todo.id}`}
                name="completed"
                checked={props.todo.completed}
              />
              Completed
            </label>

            <label for={`desc-${props.todo.id}`}>Description</label>
            <textarea id={`desc-${props.todo.id}`} name="description" rows="2" placeholder="Optional description">
              {props.todo.description ?? ''}
            </textarea>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary btn-sm" onClick={() => props.onEditCancel()}>
                Cancel
              </button>
              <button type="submit" class="btn btn-accent btn-sm">
                Save
              </button>
            </div>
          </form>
        </Show>
      </div>
    </div>
  );
}
