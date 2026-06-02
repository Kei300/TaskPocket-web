import type { Todo } from '@/src/types/Todo';

export function getListUuid(todo: Todo): string {
  return todo.listUuid || (todo as Todo & { listId?: string }).listId || '';
}

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const PRIORITY_LABELS: Record<string, string> = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' };

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}
