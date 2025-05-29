import { createSignal } from 'solid-js';
import type { Todo } from '../lib/types.js';

export function TodoForm(props: {
  todo: Todo | null;
  onSave: (data: { id?: string; title: string; completed?: boolean; description?: string }) => void;
  onCancel: () => void;
}) {
  const isEdit = () => props.todo !== null;
  const [saving, setSaving] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setSaving(true);
    props.onSave({
      id: (formData.get('id') as string) || undefined,
      title: (formData.get('title') as string).trim(),
      completed: formData.has('completed'),
      description: (formData.get('description') as string)?.trim() || undefined,
    });
    setSaving(false);
  };

  return (
    <div class={`todo-form${saving() ? ' loading' : ''}`}>
      <form onSubmit={handleSubmit}>
        <h4>{isEdit() ? 'Edit Todo' : 'New Todo'}</h4>

        <input type="hidden" name="id" value={props.todo?.id ?? ''} />

        <label for="todo-title">Title</label>
        <input
          type="text"
          id="todo-title"
          name="title"
          required
          placeholder="Buy groceries"
          value={props.todo?.title ?? ''}
        />

        <label for="todo-completed" class="checkbox-label">
          <input type="checkbox" id="todo-completed" name="completed" checked={props.todo?.completed ?? false} />
          Completed
        </label>

        <label for="todo-description">Description</label>
        <textarea id="todo-description" name="description" rows="2" placeholder="Optional description">
          {props.todo?.description ?? ''}
        </textarea>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onClick={() => props.onCancel()}>
            Cancel
          </button>
          <button type="submit" class="btn btn-accent">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
