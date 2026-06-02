'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AuthGuard } from '@/src/components/AuthGuard';
import { AppHeader, RetroButton, TaskRow } from '@/src/components/common';
import { NavBar, MobileNav } from '@/src/components/NavBar';
import { Mascot } from '@/src/components/Mascot';
import { PixelIcon } from '@/src/components/PixelIcon';
import { PngIcon } from '@/src/components/PngIcon';
import { fetchComments, createComment } from '@/src/services/comment/commentService';
import { fetchLists } from '@/src/services/todo/listService';
import { fetchTodosByList, updateTodo } from '@/src/services/todo/todoService';
import type { Todo, UpdateTodoPayload } from '@/src/types/Todo';
import type { Comment } from '@/src/types/Comment';

export default function ListDetailPage() {
  return (
    <AuthGuard>
      <ListDetailScreen />
    </AuthGuard>
  );
}

function ListDetailScreen() {
  const params = useParams();
  const uuid = params.id as string;
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState('');

  const { data: lists = [] } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

  const list = useMemo(
    () => lists?.find((l) => l.id === uuid),
    [lists, uuid]
  );

  const { data: currentListTodos = [], isLoading } = useQuery({
    queryKey: ['todos', 'list', uuid],
    queryFn: () => fetchTodosByList(uuid, true),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', uuid],
    queryFn: () => fetchComments(uuid!),
    enabled: !!uuid,
  });

  const pendingTodos = useMemo(
    () => currentListTodos.filter((t: Todo) => !t.completed),
    [currentListTodos]
  );

  const completedTodos = useMemo(
    () => currentListTodos.filter((t: Todo) => t.completed),
    [currentListTodos]
  );

  const toggleMutation = useMutation({
    mutationFn: (payload: UpdateTodoPayload) => updateTodo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'list', uuid] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'full'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (payload: { listId: string; comment: string }) => createComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', uuid] });
      setCommentText('');
    },
  });

  const handleToggle = (todo: Todo) => {
    const next = !todo.completed;
    toggleMutation.mutate({
      uuid: todo.uuid,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
      listUuid: uuid,
      completed: next,
      completedAt: next ? new Date().toISOString() : null,
    });
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-ice-white">
        <p className="text-slate-gray text-lg">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-ice-white overflow-y-auto">
      <div className="md:ml-16 flex justify-center">
        <div className="w-full max-w-5xl p-6 pb-24">
          <AppHeader subtitle="Lista" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-4">
          <div className="rounded-[10px] bg-pure-white border border-light-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold font-vt323 text-charcoal flex items-center gap-2">
                  <span className="bg-electric-blue rounded-[6px] p-1.5">
                    <PixelIcon name="list" size={20} className="text-pure-white" />
                  </span>
                  {list?.title ?? 'Cargando...'}
                </h1>
                {list?.description && (
                  <p className="text-sm text-slate-gray font-courier mt-1 ml-10">
                    {list.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-ice-white rounded-[6px] border border-light-border px-2.5 py-1.5">
                <span className="text-xs font-bold text-electric-blue">{completedTodos.length}/{currentListTodos.length}</span>
                <PixelIcon name="check" size={14} className="text-mint-green" />
              </div>
            </div>
            {currentListTodos.length > 0 && (
              <div className="mt-3 ml-10">
                <div className="w-full h-2 rounded-full bg-light-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-mint-green transition-all duration-300"
                    style={{
                      width: `${Math.round((completedTodos.length / currentListTodos.length) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {pendingTodos.length > 0 && (
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-1.5 h-6 bg-electric-blue rounded-full" />
                <p className="text-xs font-bold tracking-widest text-electric-blue">PENDIENTES</p>
                <span className="text-[10px] font-bold text-pure-white bg-electric-blue rounded-full w-5 h-5 flex items-center justify-center">{pendingTodos.length}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {pendingTodos.map((todo: Todo) => (
                  <TaskRow
                    key={todo.uuid}
                    title={todo.title}
                    description={todo.description}
                    isCompleted={todo.completed}
                    dueDate={todo.dueDate}
                    onToggleComplete={() => handleToggle(todo)}
                  />
                ))}
              </div>
            </div>
          )}

          {pendingTodos.length === 0 && currentListTodos.length > 0 && (
            <div className="py-8 flex flex-col items-center border border-dashed border-mint-green/40 rounded-[6px] bg-mint-green/5">
              <Mascot state="success" size={80} />
              <p className="text-xs text-slate-gray font-courier mt-2">
                ¡Todo listo! No hay tareas pendientes.
              </p>
            </div>
          )}

          {completedTodos.length > 0 && (
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-1.5 h-6 bg-mint-green rounded-full" />
                <p className="text-xs font-bold tracking-widest text-mint-green">COMPLETADAS</p>
                <span className="text-[10px] font-bold text-charcoal bg-mint-green rounded-full w-5 h-5 flex items-center justify-center">{completedTodos.length}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {completedTodos.map((todo: Todo) => (
                  <TaskRow
                    key={todo.uuid}
                    title={todo.title}
                    description={todo.description}
                    isCompleted={todo.completed}
                    dueDate={todo.dueDate}
                    onToggleComplete={() => handleToggle(todo)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentListTodos.length === 0 && (
            <div className="py-10 flex flex-col items-center border border-dashed border-light-border rounded-[6px]">
              <Mascot state="idle" size={80} />
              <p className="text-xs text-slate-gray font-courier mt-2 text-center px-6">
                Esta lista está vacía. ¡Agrega tareas desde la página de inicio!
              </p>
            </div>
          )}
          </div>

          <div className="md:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-deep-purple rounded-full" />
            <p className="text-xs font-bold tracking-widest text-deep-purple">COMENTARIOS</p>
            {comments.length > 0 && (
              <span className="text-[10px] font-bold text-pure-white bg-deep-purple rounded-full w-5 h-5 flex items-center justify-center">{comments.length}</span>
            )}
          </div>

          <div className="bg-pure-white border border-light-border rounded-[6px] p-3 flex flex-col gap-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full p-2.5 border border-light-border rounded-[4px] bg-ice-white font-courier text-xs text-charcoal outline-none resize-none min-h-[60px]"
            />
            <RetroButton
              variant="primary"
              disabled={!commentText.trim() || commentMutation.isPending}
              onClick={() => {
                if (commentText.trim() && uuid) {
                  commentMutation.mutate({ listId: uuid, comment: commentText.trim() });
                }
              }}
            >
              <PngIcon name="save" size={14} /> COMENTAR
            </RetroButton>
          </div>

          {comments.length > 0 ? (
            <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {comments.map((c: Comment, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-pure-white border border-light-border rounded-[6px]"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-5 h-5 rounded-full bg-electric-blue flex items-center justify-center text-[9px] font-bold text-pure-white">
                      {c.authorName?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                    <p className="text-xs font-bold text-electric-blue">{c.authorName}</p>
                  </div>
                  <p className="text-sm text-charcoal font-courier ml-7">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-pure-white border border-dashed border-light-border rounded-[6px] flex flex-col items-center">
              <Mascot state="idle" size={40} />
              <p className="text-xs text-slate-gray font-courier mt-2 text-center">
                No hay comentarios aún.
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
      </div>

      <NavBar />
      <MobileNav />
    </main>
  );
}
