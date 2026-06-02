'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PixelInput, RetroButton, RetroModal } from '@/src/components/common';
import { associateCategory, fetchCategories } from '@/src/services/category/categoryService';
import { createTodo } from '@/src/services/todo/todoService';
import { fetchLists } from '@/src/services/todo/listService';
import { PRIORITIES, PRIORITY_LABELS } from '@/src/utils/todo';
import type { Priority } from '@/src/types/Todo';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateTaskModal({ open, onClose, onSuccess }: CreateTaskModalProps) {
  const queryClient = useQueryClient();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM');
  const [taskListId, setTaskListId] = useState('');
  const [taskCategoryId, setTaskCategoryId] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: lists = [] } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

  const resetForm = () => {
    setTaskTitle('');
    setTaskDesc('');
    setTaskDate(new Date().toISOString().split('T')[0]);
    setTaskPriority('MEDIUM');
    setTaskListId('');
    setTaskCategoryId(null);
  };

  const createTaskMut = useMutation({
    mutationFn: (p: Parameters<typeof createTodo>[0]) => createTodo(p),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      if (taskCategoryId && data?.uuid) {
        associateCategory({ todoId: data.uuid, categoryId: taskCategoryId });
      }
      resetForm();
      onClose();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
      const serverMessage = err?.response?.data?.message || err?.message || 'Error desconocido';
      setErrorModal({ visible: true, message: `Error al crear tarea:\n${serverMessage}` });
    },
  });

  const isValid = taskTitle.trim() && taskListId;

  return (
    <>
      <RetroModal open={open} title="Nueva Tarea" onClose={onClose}>
        <div className="flex flex-col gap-4">
          <PixelInput label="Título" value={taskTitle} onChange={setTaskTitle} placeholder="Nombre de la tarea" />
          <PixelInput label="Descripción" value={taskDesc} onChange={setTaskDesc} placeholder="Descripción opcional" />

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-semibold">Fecha de vencimiento</label>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="border border-light-border rounded-[6px] px-3 py-2.5 text-base text-charcoal bg-pure-white font-courier outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-semibold">Prioridad</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTaskPriority(p)}
                  className={`flex-1 py-2 rounded-[4px] border text-sm font-semibold cursor-pointer transition-colors ${
                    taskPriority === p
                      ? 'border-electric-blue bg-electric-blue text-pure-white'
                      : 'border-light-border bg-pure-white text-charcoal hover:opacity-80'
                  }`}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-semibold">Lista *</label>
            {lists.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {lists.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setTaskListId(l.id)}
                    className={`px-3 py-1.5 rounded-[4px] border text-xs font-semibold cursor-pointer transition-colors ${
                      taskListId === l.id
                        ? 'border-electric-blue bg-electric-blue text-pure-white'
                        : 'border-light-border bg-pure-white text-charcoal hover:opacity-80'
                    }`}
                  >
                    {l.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-gray font-courier">Crea una lista primero</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-semibold">
              Categoría <span className="text-xs text-slate-gray font-normal">(opcional)</span>
            </label>
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {taskCategoryId !== null && (
                  <button
                    type="button"
                    onClick={() => setTaskCategoryId(null)}
                    className="px-3 py-1.5 rounded-[4px] border border-coral-pink text-xs font-semibold text-coral-pink cursor-pointer"
                  >
                    Sin categoría
                  </button>
                )}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTaskCategoryId(taskCategoryId === cat.id ? null : cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border text-xs font-semibold cursor-pointer transition-colors ${
                      taskCategoryId === cat.id
                        ? 'border-charcoal text-charcoal'
                        : 'border-light-border text-charcoal hover:opacity-80'
                    }`}
                    style={taskCategoryId === cat.id ? { backgroundColor: cat.color || '#E0F2FE' } : {}}
                  >
                    <span className="w-2.5 h-2.5 rounded-[3px] flex-shrink-0" style={{ backgroundColor: cat.color || '#E0F2FE' }} />
                    {cat.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-gray font-courier">No hay categorías disponibles</p>
            )}
          </div>

          <RetroButton
            variant="primary"
            disabled={!isValid || createTaskMut.isPending}
            onClick={() => {
              if (!isValid) return;
              createTaskMut.mutate({
                title: taskTitle.trim(),
                description: taskDesc.trim(),
                dueDate: new Date(taskDate).toISOString(),
                priority: taskPriority,
                listUuid: taskListId,
              });
            }}
          >
            {createTaskMut.isPending ? 'CREANDO…' : 'CREAR TAREA'}
          </RetroButton>
        </div>
      </RetroModal>

      <RetroModal
        open={errorModal.visible}
        title="Error"
        variant="error"
        message={errorModal.message}
        buttonText="OK"
        onClose={() => setErrorModal({ visible: false, message: '' })}
        onAction={() => setErrorModal({ visible: false, message: '' })}
      />
    </>
  );
}
