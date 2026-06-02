'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AuthGuard } from '@/src/components/AuthGuard';
import { AppHeader, PixelInput, RetroModal, TaskRow } from '@/src/components/common';
import { Mascot } from '@/src/components/Mascot';
import { NavBar, MobileNav } from '@/src/components/NavBar';
import { PngIcon } from '@/src/components/PngIcon';
import { fetchLists } from '@/src/services/todo/listService';
import { fetchTodos, updateTodo } from '@/src/services/todo/todoService';
import { getListUuid } from '@/src/utils/todo';
import type { Todo, UpdateTodoPayload } from '@/src/types/Todo';
import type { ListModel } from '@/src/types/List';

export default function SearchPage() {
  return (
    <AuthGuard>
      <SearchScreen />
    </AuthGuard>
  );
}

function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const queryClient = useQueryClient();
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ['todos', 'full'],
    queryFn: () => fetchTodos(true),
  });

  const { data: lists = [], isLoading: listsLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'full'] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: unknown }; message?: string };
      const serverMessage = err?.response?.data && typeof err.response.data === 'object'
        ? (err.response.data as Record<string, unknown>)?.message as string || JSON.stringify(err.response.data)
        : err?.message;
      setErrorModal({ visible: true, message: `Error al actualizar:\n${JSON.stringify(serverMessage)}` });
    },
  });

  const matchedLists = useMemo(
    () => query
      ? lists.filter((l: ListModel) =>
          l.title.toLowerCase().includes(query) ||
          l.description?.toLowerCase().includes(query),
        )
      : [],
    [lists, query],
  );

  const matchedTodos = useMemo(
    () => query
      ? todos.filter((t: Todo) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query),
        )
      : [],
    [todos, query],
  );

  const recentTodos = useMemo(
    () =>
      [...todos]
        .filter((t: Todo) => !t.completed)
        .sort(
          (a: Todo, b: Todo) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 8),
    [todos],
  );

  const listTaskCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of todos) {
      const targetId = getListUuid(t);
      if (targetId) {
        map[targetId] = (map[targetId] ?? 0) + 1;
      }
    }
    return map;
  }, [todos]);

  const listProgress = useMemo(() => {
    const map: Record<string, number> = {};
    for (const list of lists) {
      const listTodos = todos.filter((t: Todo) => {
      const targetId = getListUuid(t);
        return targetId === list.id;
      });
      const total = listTodos.length;
      const completed = listTodos.filter((t: Todo) => t.completed).length;
      map[list.id] = total > 0 ? Math.round((completed / total) * 100) : 0;
    }
    return map;
  }, [lists, todos]);

  const LIST_ICONS = ['book', 'computer', 'palette', 'target', 'gear'] as const;

  if (todosLoading || listsLoading) {
    return (
      <main className="flex-1 bg-ice-white overflow-y-auto">
        <div className="md:ml-16 flex justify-center">
          <div className="w-full max-w-5xl p-6 pb-24 flex flex-col items-center justify-center gap-4 py-24">
            <Mascot state="idle" size={80} />
            <p className="text-sm text-slate-gray font-courier">Buscando…</p>
          </div>
        </div>
        <NavBar />
        <MobileNav />
      </main>
    );
  }

  const hasResults = matchedLists.length > 0 || matchedTodos.length > 0;

  return (
    <main className="flex-1 bg-ice-white overflow-y-auto">
      <div className="md:ml-16 flex justify-center">
        <div className="w-full max-w-5xl p-6 pb-24 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <AppHeader subtitle="Buscar" />
            <div className="flex items-center gap-3 mt-2">
              <PngIcon name="search" size={24} />
              <PixelInput
                value={search}
                onChange={setSearch}
                placeholder="Escribe para buscar listas y tareas..."
                className="flex-1 text-base"
              />
            </div>
          </div>

          {!query ? (
            <>
              <div className="flex flex-col gap-4">
                <p className="text-base font-bold text-electric-blue tracking-wide">MATCHED LISTS</p>
                {lists.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {lists.slice(0, 10).map((list: ListModel, idx: number) => (
                      <button
                        key={list.id}
                        onClick={() => router.push(`/list/${list.id}`)}
                        className="flex-shrink-0 w-[200px] p-4 border border-light-border rounded-[6px] bg-pure-white flex flex-col gap-2.5 text-left cursor-pointer hover:opacity-85 transition-opacity"
                      >
                        <PngIcon name={LIST_ICONS[idx % LIST_ICONS.length]} size={28} />
                        <p className="text-base font-semibold text-charcoal line-clamp-2">{list.title}</p>
                        <p className="text-sm text-slate-gray font-courier">
                          {listTaskCounts[list.id] ?? 0} tareas
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 border border-light-border rounded-[6px] bg-pure-white">
                    <p className="text-sm text-slate-gray font-courier">No hay listas todavía</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-bold text-electric-blue tracking-wide">TAREAS RECIENTES</p>
                {recentTodos.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {recentTodos.map((todo: Todo) => (
                      <TaskRow
                        key={todo.uuid}
                        title={todo.title}
                        description={todo.description}
                        isCompleted={todo.completed}
                        onToggleComplete={() => toggleMutation.mutate(todo)}
                        dueDate={todo.dueDate}
                        onClick={() => router.push(`/list/${getListUuid(todo)}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-5 border border-light-border rounded-[6px] bg-pure-white">
                    <p className="text-sm text-slate-gray font-courier">¡Todo al día! No hay tareas pendientes.</p>
                  </div>
                )}
              </div>
            </>
          ) : query && !hasResults ? (
            <div className="flex items-center justify-center py-16 border border-dashed border-light-border rounded-[6px]">
              <p className="text-base text-slate-gray font-courier">
                No hay resultados para &ldquo;{search}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {matchedLists.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-base font-bold text-electric-blue tracking-wide">LISTAS ({matchedLists.length})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchedLists.map((list: ListModel, idx: number) => (
                      <button
                        key={list.id}
                        onClick={() => router.push(`/list/${list.id}`)}
                        className="p-4 border border-light-border rounded-[6px] bg-pure-white flex flex-col gap-2.5 text-left cursor-pointer hover:opacity-85 transition-opacity"
                      >
                        <div className="flex items-center gap-2.5">
                          <PngIcon name={LIST_ICONS[idx % LIST_ICONS.length]} size={24} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-charcoal truncate">{list.title}</p>
                            {list.description && (
                              <p className="text-xs text-slate-gray font-courier truncate">{list.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-light-border overflow-hidden">
                          <div
                            className={`h-full rounded-full ${(listProgress[list.id] ?? 0) === 100 ? 'bg-mint-green' : 'bg-electric-blue'}`}
                            style={{ width: `${listProgress[list.id] ?? 0}%` }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedTodos.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-base font-bold text-electric-blue tracking-wide">TAREAS ({matchedTodos.length})</p>
                  <div className="flex flex-col gap-2.5">
                    {matchedTodos.slice(0, 15).map((todo: Todo) => (
                      <TaskRow
                        key={todo.uuid}
                        title={todo.title}
                        description={todo.description}
                        isCompleted={todo.completed}
                        onToggleComplete={() => toggleMutation.mutate(todo)}
                        dueDate={todo.dueDate}
                        onClick={() => router.push(`/list/${getListUuid(todo)}`)}
                      />
                    ))}
                  </div>
                  {matchedTodos.length > 15 && (
                    <p className="text-center text-sm text-slate-gray font-courier">
                      +{matchedTodos.length - 15} tareas más
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <NavBar />
      <MobileNav />

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
