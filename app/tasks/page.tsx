'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { AuthGuard } from '@/src/components/AuthGuard';
import { AppHeader, PixelInput, RetroButton, RetroModal } from '@/src/components/common';
import { CreateTaskModal } from '@/src/components/common/molecules/CreateTaskModal';
import { EditTaskModal } from '@/src/components/common/molecules/EditTaskModal';
import { Mascot } from '@/src/components/Mascot';
import { NavBar, MobileNav } from '@/src/components/NavBar';
import { PngIcon } from '@/src/components/PngIcon';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '@/src/services/category/categoryService';
import { createList, deleteList, fetchLists, updateList } from '@/src/services/todo/listService';
import { fetchTodos, updateTodo, deleteTodo } from '@/src/services/todo/todoService';
import { getListUuid, formatDate, PRIORITY_LABELS } from '@/src/utils/todo';
import type { Todo, UpdateTodoPayload } from '@/src/types/Todo';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/src/types/Category';
import type { CreateListPayload, ListModel, UpdateListPayload } from '@/src/types/List';

type FilterMode = 'all' | 'active';

function getPriorityColor(p?: string) {
  if (p === 'LOW') return '#94FFD8';
  if (p === 'HIGH') return '#FF708A';
  return '#FFD166';
}

export default function TasksPage() {
  return (
    <AuthGuard>
      <TasksScreen />
    </AuthGuard>
  );
}

function TasksScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterMode>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  // List modals
  const [listModal, setListModal] = useState<{ open: boolean; edit: ListModel | null }>({ open: false, edit: null });
  const [listTitle, setListTitle] = useState('');
  const [listDesc, setListDesc] = useState('');

  // Category modals
  const [catModal, setCatModal] = useState<{ open: boolean; edit: Category | null }>({ open: false, edit: null });
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#3D5CFF');

  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ['todos', 'full'],
    queryFn: () => fetchTodos(true),
  });

  const { data: lists = [], isLoading: listsLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const filtered = useMemo(
    () => todos.filter((t: Todo) => (filter === 'active' ? !t.completed : true)),
    [todos, filter]
  );

  const toggleMutation = useMutation({
    mutationFn: (todo: Todo) => {
      const payload: UpdateTodoPayload = {
        uuid: todo.uuid,
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null,
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        listUuid: getListUuid(todo),
      };
      return updateTodo(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      setErrorModal({ visible: true, message: `Error: ${err?.response?.data?.message || err?.message || 'Error'}` });
    },
  });

  const openEdit = (todo: Todo) => {
    setSelectedTask(todo);
    setEditOpen(true);
  };

  const deleteTaskMut = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      setErrorModal({ visible: true, message: `Error al eliminar: ${err?.response?.data?.message || err?.message || 'Error'}` });
    },
  });

  // List CRUD mutations
  const saveListMut = useMutation({
    mutationFn: () => {
      if (listModal.edit) {
        const payload: UpdateListPayload = { id: listModal.edit.id, title: listTitle.trim(), description: listDesc.trim() };
        return updateList(payload);
      }
      const payload: CreateListPayload = { title: listTitle.trim(), description: listDesc.trim(), visibility: false };
      return createList(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      setListModal({ open: false, edit: null });
      setListTitle('');
      setListDesc('');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      setErrorModal({ visible: true, message: `Error al guardar lista: ${err?.response?.data?.message || err?.message || 'Error'}` });
    },
  });

  const deleteListMut = useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists'] }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      setErrorModal({ visible: true, message: `Error al eliminar lista: ${err?.response?.data?.message || err?.message || 'Error'}` });
    },
  });

  // Category CRUD mutations
  const saveCatMut = useMutation({
    mutationFn: () => {
      if (catModal.edit) {
        const payload: UpdateCategoryPayload = { id: catModal.edit.id, name: catName.trim(), color: catColor };
        return updateCategory(payload);
      }
      const payload: CreateCategoryPayload = { name: catName.trim(), color: catColor };
      return createCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCatModal({ open: false, edit: null });
      setCatName('');
      setCatColor('#3D5CFF');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      setErrorModal({ visible: true, message: `Error al guardar categoría: ${err?.response?.data?.message || err?.message || 'Error'}` });
    },
  });

  const deleteCatMut = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      setErrorModal({ visible: true, message: `Error al eliminar categoría: ${err?.response?.data?.message || err?.message || 'Error'}` });
    },
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'task' | 'list' | 'category'; id: string; label: string } | null>(null);

  if (todosLoading || listsLoading || catsLoading) {
    return (
      <main className="flex-1 bg-ice-white overflow-y-auto">
        <NavBar />
        <MobileNav />
        <div className="md:ml-16 flex justify-center">
          <div className="w-full max-w-5xl p-6 pb-24 flex flex-col items-center justify-center gap-4 py-24">
            <Mascot state="idle" size={80} />
            <p className="text-sm text-slate-gray font-courier">Cargando tareas…</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-ice-white overflow-y-auto">
      <NavBar />
      <MobileNav />
      <div className="md:ml-16 flex justify-center">
        <div className="w-full max-w-5xl p-6 pb-24">
          <AppHeader subtitle="Tareas" />

          {/* HEADER */}
          <div className="flex items-center justify-between mt-3 mb-4">
            <p className="text-sm text-slate-gray font-courier">
              {filtered.length} de {todos.length} tarea{filtered.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="w-10 h-10 rounded-full bg-electric-blue text-pure-white flex items-center justify-center cursor-pointer hover:opacity-85 transition-opacity border-2 border-charcoal"
              aria-label="Crear tarea"
            >
              <PngIcon name="plus" size={20} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {(['all', 'active'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-[4px] border text-sm font-semibold cursor-pointer transition-colors ${
                  filter === f
                    ? 'border-electric-blue bg-electric-blue text-pure-white'
                    : 'border-light-border bg-pure-white text-charcoal hover:opacity-80'
                }`}
              >
                {f === 'all' ? 'Todas' : 'Activas'}
              </button>
            ))}
          </div>

          {/* LISTS SECTION */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-electric-blue tracking-wide">LISTAS</span>
              <button
                onClick={() => { setListTitle(''); setListDesc(''); setListModal({ open: true, edit: null }); }}
                className="text-sm font-semibold text-electric-blue cursor-pointer bg-transparent border-none flex items-center gap-1"
              >
                <PngIcon name="plus" size={16} /> NUEVA
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {lists.map((l: ListModel) => (
                <div
                  key={l.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] border border-light-border bg-pure-white text-sm font-semibold text-charcoal"
                >
                  <button onClick={() => router.push(`/list/${l.id}`)} className="cursor-pointer bg-transparent border-none text-charcoal hover:opacity-80">
                    {l.title}
                  </button>
                  <button
                    onClick={() => { setListTitle(l.title); setListDesc(l.description || ''); setListModal({ open: true, edit: l }); }}
                    className="cursor-pointer bg-transparent border-none text-slate-gray hover:text-electric-blue flex items-center"
                  >
                    <PngIcon name="gear" size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'list', id: l.id, label: l.title }); }}
                    className="cursor-pointer bg-transparent border-none text-slate-gray hover:text-coral-pink flex items-center"
                  >
                    <PngIcon name="close" size={14} />
                  </button>
                </div>
              ))}
              {lists.length === 0 && (
                <p className="text-sm text-slate-gray font-courier">No hay listas. ¡Crea una!</p>
              )}
            </div>
          </section>

          {/* CATEGORIES SECTION */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-electric-blue tracking-wide">CATEGORÍAS</span>
              <button
                onClick={() => { setCatName(''); setCatColor('#3D5CFF'); setCatModal({ open: true, edit: null }); }}
                className="text-sm font-semibold text-electric-blue cursor-pointer bg-transparent border-none flex items-center gap-1"
              >
                <PngIcon name="plus" size={16} /> NUEVA
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c: Category) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] border border-light-border bg-pure-white text-sm font-semibold text-charcoal"
                >
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: c.color }} />
                  {c.name}
                  <button
                    onClick={() => { setCatName(c.name); setCatColor(c.color); setCatModal({ open: true, edit: c }); }}
                    className="cursor-pointer bg-transparent border-none text-slate-gray hover:text-electric-blue flex items-center"
                  >
                    <PngIcon name="gear" size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'category', id: c.id, label: c.name })}
                    className="cursor-pointer bg-transparent border-none text-slate-gray hover:text-coral-pink flex items-center"
                  >
                    <PngIcon name="close" size={14} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-slate-gray font-courier">No hay categorías</p>
              )}
            </div>
          </section>

          {/* TASKS LIST */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filtered.map((todo: Todo) => {
                const isExpanded = expandedTask === todo.uuid;
                return (
                  <div key={todo.uuid}>
                    <div className="flex items-center bg-pure-white border border-light-border rounded-[6px] px-3 py-3 gap-3">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getPriorityColor(todo.priority) }} />
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMutation.mutate(todo); }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          todo.completed
                            ? 'bg-mint-green border-mint-green'
                            : 'bg-transparent border-light-border'
                        }`}
                        aria-label={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                      >
                        {todo.completed && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#3D5CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : todo.uuid)}>
                        <p className={`text-sm font-semibold truncate ${todo.completed ? 'text-slate-gray line-through' : 'text-charcoal'}`}>
                          {todo.title}
                        </p>
                        {!isExpanded && todo.description && (
                          <p className="text-xs text-slate-gray truncate">{todo.description}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(todo); }}
                        className="w-8 h-8 flex items-center justify-center rounded-[4px] text-slate-gray hover:bg-ice-white cursor-pointer bg-transparent border-none"
                        aria-label="Editar tarea"
                      >
                        <PngIcon name="gear" size={16} />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-2 border border-t-0 border-light-border rounded-b-[6px] bg-ice-white flex flex-col gap-2">
                        {todo.description && (
                          <p className="text-sm text-charcoal font-courier">{todo.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-slate-gray font-courier">
                            {todo.dueDate && <span>Vence: {formatDate(todo.dueDate)}</span>}
                            <span>Prioridad: {PRIORITY_LABELS[todo.priority || 'MEDIUM']}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'task', id: todo.uuid, label: todo.title }); }}
                            className="flex items-center gap-1 text-xs font-semibold text-coral-pink cursor-pointer bg-transparent border-none hover:opacity-80"
                          >
                            <PngIcon name="close" size={14} /> ELIMINAR
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center border border-dashed border-light-border rounded-[6px]">
              <Mascot state="success" size={72} />
              <p className="text-sm text-slate-gray font-courier mt-3 text-center">
                {filter === 'active' ? 'No hay tareas activas' : 'No hay tareas aún'}
              </p>
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-3 px-5 py-2 border border-electric-blue rounded-[4px] text-sm font-semibold text-electric-blue cursor-pointer hover:opacity-80"
              >
                + CREAR TAREA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditTaskModal key={selectedTask?.uuid ?? 'none'} open={editOpen} task={selectedTask} onClose={() => setEditOpen(false)} />

      {/* List Create/Edit Modal */}
      <RetroModal open={listModal.open} title={listModal.edit ? 'Editar Lista' : 'Nueva Lista'} onClose={() => setListModal({ open: false, edit: null })}>
        <div className="flex flex-col gap-4">
          <PixelInput label="Nombre" value={listTitle} onChange={setListTitle} placeholder="Nombre de la lista" />
          <PixelInput label="Descripción" value={listDesc} onChange={setListDesc} placeholder="Descripción opcional" />
          <div className="flex gap-2">
            <RetroButton variant="primary" disabled={!listTitle.trim() || saveListMut.isPending} onClick={() => saveListMut.mutate()}>
              {saveListMut.isPending ? 'GUARDANDO…' : 'GUARDAR'}
            </RetroButton>
          </div>
        </div>
      </RetroModal>

      {/* Category Create/Edit Modal */}
      <RetroModal open={catModal.open} title={catModal.edit ? 'Editar Categoría' : 'Nueva Categoría'} onClose={() => setCatModal({ open: false, edit: null })}>
        <div className="flex flex-col gap-4">
          <PixelInput label="Nombre" value={catName} onChange={setCatName} placeholder="Nombre de la categoría" />
          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-semibold">Color</label>
            <div className="flex gap-1.5 flex-wrap">
              {['#3D5CFF', '#FF708A', '#94FFD8', '#FFD166', '#a5c7ff', '#B388FF', '#FF8A65'].map((color) => (
                <button
                  key={color}
                  onClick={() => setCatColor(color)}
                  className={`w-7 h-7 rounded-[4px] border-2 cursor-pointer transition-all ${
                    catColor === color ? 'border-charcoal scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <RetroButton variant="primary" disabled={!catName.trim() || saveCatMut.isPending} onClick={() => saveCatMut.mutate()}>
              {saveCatMut.isPending ? 'GUARDANDO…' : 'GUARDAR'}
            </RetroButton>
          </div>
        </div>
      </RetroModal>

      {/* Confirm Delete */}
      {deleteConfirm && (
        <RetroModal
          open={true}
          title="Confirmar eliminación"
          variant="error"
          message={`¿Estás seguro de eliminar "${deleteConfirm.label}"?`}
          buttonText="ELIMINAR"
          onClose={() => setDeleteConfirm(null)}
          onAction={() => {
            if (deleteConfirm.type === 'task') deleteTaskMut.mutate(deleteConfirm.id);
            if (deleteConfirm.type === 'list') deleteListMut.mutate(deleteConfirm.id);
            if (deleteConfirm.type === 'category') deleteCatMut.mutate(deleteConfirm.id);
            setDeleteConfirm(null);
          }}
        />
      )}

      {/* Error Modal */}
      <RetroModal
        open={errorModal.visible}
        title="Error"
        variant="error"
        message={errorModal.message}
        buttonText="OK"
        onClose={() => setErrorModal({ visible: false, message: '' })}
        onAction={() => setErrorModal({ visible: false, message: '' })}
      />
    </main>
  );
}
