'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AppHeader, BentoCard, RetroModal, SectionHeader, TaskRow } from '@/src/components/common';
import { CreateTaskModal } from '@/src/components/common/molecules/CreateTaskModal';
import { NavBar, MobileNav } from '@/src/components/NavBar';
import { Mascot } from '@/src/components/Mascot';
import { PngIcon } from '@/src/components/PngIcon';
import { useAuth } from '@/src/hooks/use-auth';
import { fetchLists } from '@/src/services/todo/listService';
import { fetchTodos, updateTodo } from '@/src/services/todo/todoService';
import { getListUuid, isToday } from '@/src/utils/todo';
import type { Todo, UpdateTodoPayload } from '@/src/types/Todo';
import type { ListModel } from '@/src/types/List';

function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const [createOpen, setCreateOpen] = useState(false);

  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ['todos', 'full'],
    queryFn: () => fetchTodos(true),
  });

  const { data: lists = [], isLoading: listsLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

  const isLoading = todosLoading || listsLoading;

  const dueToday = useMemo(() => todos.filter((t: Todo) => !t.completed && isToday(t.dueDate)), [todos]);

  const overdue = useMemo(() => {
    return todos.filter((t: Todo) => !t.completed && !isToday(t.dueDate) && new Date(t.dueDate) < new Date(new Date().toDateString()));
  }, [todos]);

  const hasOverdue = overdue.length > 0;
  const hasPending = dueToday.length > 0;

  const listProgress = useMemo(() => {
    return lists.map((list: ListModel) => {
      const listTodos = todos.filter((t: Todo) => {
        const idDeListaEnTarea = getListUuid(t);
        return idDeListaEnTarea === list.id;
      });

      const total = listTodos.length;
      const completed = listTodos.filter((t: Todo) => t.completed).length;

      return {
        id: list.id,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [lists, todos]);

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

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-ice-white">
        <div className="flex flex-col items-center gap-4">
          <Mascot state="focus" size={100} />
          <p className="text-slate-gray text-lg font-pixelify">Cargando...</p>
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
          <AppHeader subtitle="Your Atelier" />

          <div className="flex items-center justify-between mt-4 mb-6">
            <h2 className="text-lg font-bold text-charcoal">
              Bienvenido, {user?.fullName ?? 'Usuario'}
            </h2>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 border-2 border-charcoal rounded-[6px] bg-electric-blue text-pure-white text-sm font-bold cursor-pointer hover:opacity-85 transition-opacity"
            >
              <PngIcon name="plus" size={16} />
              AGREGAR TAREA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* LEFT COL: Overdue + Due Today */}
            <div className="flex flex-col gap-4">
              {hasOverdue && (
                <div>
                  <BentoCard variant="alert" className="flex flex-col gap-3 py-4">
                    <div className="flex items-center gap-3">
                      <Mascot state="oops" size={48} />
                      <p className="text-lg font-bold text-coral-pink">
                        ¡Oops! Tienes {overdue.length} tarea{overdue.length !== 1 ? 's' : ''} vencida{overdue.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </BentoCard>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {overdue.map((todo: Todo) => (
                      <div key={todo.uuid} className="border border-coral-pink rounded-[8px] overflow-hidden bg-[#FFF5F5]">
                        <TaskRow
                          title={todo.title}
                          description={todo.description}
                          isCompleted={todo.completed}
                          onToggleComplete={() => toggleMutation.mutate(todo)}
                          dueDate={todo.dueDate}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dueToday.length > 0 && (
                <div>
                  <SectionHeader title="Due Today" color="#3D5CFF" />
                  <div className="mt-3 flex flex-col gap-2.5">
                    {dueToday.slice(0, 5).map((todo: Todo) => (
                      <TaskRow
                        key={todo.uuid}
                        title={todo.title}
                        description={todo.description}
                        isCompleted={todo.completed}
                        onToggleComplete={() => toggleMutation.mutate(todo)}
                        dueDate={todo.dueDate}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!hasPending && !hasOverdue && (
                <BentoCard className="flex flex-col items-center gap-3 py-12">
                  <Mascot state="success" size={160} />
                  <p className="text-base text-slate-gray font-courier text-center">
                    ¡Todo al día! No hay tareas pendientes.
                  </p>
                </BentoCard>
              )}
            </div>

            {/* RIGHT COL: Lists */}
            <div className="flex flex-col gap-4">
              <SectionHeader title="Mis Listas" />

              {lists.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {lists.map((list: ListModel) => {
                    const prog = listProgress.find((p) => p.id === list.id);
                    const pct = prog?.progress ?? 0;
                    return (
                      <BentoCard
                        key={list.id}
                        onClick={() => router.push(`/list/${list.id}`)}
                        className="flex flex-col cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-charcoal truncate flex-1">
                            {list.title}
                          </h3>
                          <span className="text-slate-gray flex-shrink-0 text-lg">→</span>
                        </div>
                        {list.description && (
                          <p className="text-xs text-slate-gray font-courier mt-1 truncate">
                            {list.description}
                          </p>
                        )}
                        <div className="mt-2.5 flex items-center gap-2.5">
                          <div className="flex-1 h-1.5 rounded-full bg-light-border overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-mint-green' : 'bg-electric-blue'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-courier text-slate-gray tabular-nums">
                            {pct}%
                          </span>
                        </div>
                      </BentoCard>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-6 border border-dashed border-light-border rounded-[6px]">
                  <p className="text-sm text-slate-gray font-courier">Todavía no tienes listas</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />

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

export default HomeScreen;
