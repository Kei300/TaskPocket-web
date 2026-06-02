'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { AuthGuard } from '@/src/components/AuthGuard';
import { BentoCard, RetroButton, RetroModal } from '@/src/components/common';
import { NavBar, MobileNav } from '@/src/components/NavBar';
import { Mascot } from '@/src/components/Mascot';
import { PngIcon } from '@/src/components/PngIcon';
import { useAuth } from '@/src/hooks/use-auth';
import { fetchLists } from '@/src/services/todo/listService';
import { fetchTodos } from '@/src/services/todo/todoService';
import { isToday, isOverdue } from '@/src/utils/todo';
import type { Todo } from '@/src/types/Todo';

const STACK_CHIPS = ['REACT NATIVE', 'QUARKUS', 'RETRO UI', 'TYPESCRIPT', 'FIREBASE'];

function AboutPanel() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-charcoal tracking-wide flex items-center gap-2">
        <PngIcon name="book" size={24} />
        SOBRE EL PROYECTO
      </h2>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-electric-blue tracking-wide">About TaskPocket</h3>
        <p className="text-sm text-charcoal font-courier leading-relaxed">
          Es una app para gestionar tareas pendientes con estética Pixel-Art, diseñada para React Native (Expo) y Quarkus, en la que Bun, el conejo guardián del tiempo, te ayuda a organizarte.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-electric-blue tracking-wide flex items-center gap-1.5">
          <PngIcon name="computer" size={20} />
          STACK TÉCNICO
        </h3>
        <div className="flex flex-wrap gap-2">
          {STACK_CHIPS.map((chip) => (
            <span
              key={chip}
              className="text-sm font-bold text-electric-blue px-3 py-1.5 border border-electric-blue rounded bg-ice-white"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-electric-blue tracking-wide flex items-center gap-1.5">
          <PngIcon name="palette" size={20} />
          SOBRE MÍ
        </h3>

        <div className="flex items-center gap-4 p-3 border border-light-border rounded-[6px]">
          <div className="w-14 h-14 rounded-[6px] border border-light-border bg-pure-white flex items-center justify-center">
            <PngIcon name="target" size={28} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-lg font-bold text-charcoal">Ana</p>
            <p className="text-sm text-slate-gray font-courier">Developer & Designer</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 p-3.5 border border-light-border rounded-[6px]">
            <p className="text-sm font-bold text-electric-blue tracking-wide mb-2 flex items-center gap-1.5">
              <PngIcon name="palette" size={16} />
              INTERESES
            </p>
            <p className="text-sm text-charcoal font-courier leading-relaxed">
              Desarrollo de Software, Diseño de Interfaces y Nuevas Tecnologías
            </p>
          </div>
          <div className="flex-1 p-3.5 border border-light-border rounded-[6px]">
            <p className="text-sm font-bold text-coral-pink tracking-wide mb-2">HOBBIES</p>
            <p className="text-sm text-charcoal font-courier leading-relaxed">
              Dibujo, Lectura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileScreen />
    </AuthGuard>
  );
}

function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [showSignOut, setShowSignOut] = useState(false);

  const { data: lists = [], isLoading: listsLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ['todos', 'full'],
    queryFn: () => fetchTodos(true),
  });

  const completedCount = useMemo(() => todos.filter((t: Todo) => t.completed).length, [todos]);
  const listCount = lists.length;
  const dueTodayCount = useMemo(() => todos.filter((t: Todo) => !t.completed && isToday(t.dueDate)).length, [todos]);
  const overdueCount = useMemo(() => todos.filter((t: Todo) => !t.completed && isOverdue(t.dueDate)).length, [todos]);

  const ranks = [
    { label: 'Aprendiz de Organización', desc: '0 – 9 tareas', current: completedCount < 10, next: 10 },
    { label: 'Organizador Experto', desc: '10 – 29 tareas', current: completedCount >= 10 && completedCount < 30, next: 30 },
    { label: 'Maestro del Enfoque', desc: '30 – 49 tareas', current: completedCount >= 30 && completedCount < 50, next: 50 },
    { label: 'Maestro del Atelier', desc: '50+ tareas', current: completedCount >= 50, next: null },
  ];

  const handleSignOut = async () => {
    setShowSignOut(false);
    await signOut();
  };

  if (listsLoading || todosLoading) {
    return (
      <main className="flex-1 bg-ice-white overflow-y-auto">
        <div className="md:ml-16 flex justify-center">
          <div className="w-full max-w-5xl p-6 pb-24 flex flex-col items-center justify-center gap-4 py-24">
            <Mascot state="idle" size={80} />
            <p className="text-sm text-slate-gray font-courier">Cargando perfil…</p>
          </div>
        </div>
        <NavBar />
        <MobileNav />
      </main>
    );
  }

  return (
    <main className="flex-1 bg-ice-white overflow-y-auto">
      <div className="md:ml-16 flex justify-center">
        <div className="w-full max-w-5xl p-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">

        {/* LEFT: Profile + Ranks */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Mascot state="idle" size={64} />
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-charcoal">
                {user?.fullName ?? 'Ana Keila Martínez Moreno'}
              </h1>
              <p className="text-sm text-slate-gray font-courier truncate">
                {user?.email ?? ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <BentoCard className="flex flex-col items-center gap-1.5 py-4">
              <span className="text-3xl font-bold text-mint-green">{completedCount}</span>
              <span className="text-xs text-slate-gray font-courier text-center">Completadas</span>
            </BentoCard>
            <BentoCard className="flex flex-col items-center gap-1.5 py-4">
              <span className="text-3xl font-bold text-electric-blue">{listCount}</span>
              <span className="text-xs text-slate-gray font-courier text-center">Listas</span>
            </BentoCard>
            <BentoCard className="flex flex-col items-center gap-1.5 py-4">
              <span className={`text-2xl font-bold ${dueTodayCount > 0 ? 'text-coral-pink' : 'text-mint-green'}`}>
                {dueTodayCount}
              </span>
              <span className="text-xs text-slate-gray font-courier text-center">Vencen Hoy</span>
            </BentoCard>
            <BentoCard className="flex flex-col items-center gap-1.5 py-4">
              <span className="text-2xl font-bold text-coral-pink">{overdueCount}</span>
              <span className="text-xs text-slate-gray font-courier text-center">Vencidas</span>
            </BentoCard>
          </div>

          <div>
            <span className="text-sm font-bold text-charcoal tracking-wide mb-3 block flex items-center gap-1.5">
              <PngIcon name="target" size={18} />
              RANGO DEL ATELIER
            </span>
            <div className="flex flex-col gap-2.5">
              {ranks.map((rank) => {
                const unlocked = completedCount >= (rank.next ? rank.next - 10 : 50);
                const threshold = rank.next ? rank.next - 10 : 50;
                const barProgress = rank.next ? Math.min(100, ((completedCount - threshold) / 10) * 100) : 100;
                return (
                  <div
                    key={rank.label}
                    className={`p-3.5 border rounded-[6px] flex flex-col gap-2 transition-all ${
                      rank.current
                        ? 'border-electric-blue bg-ice-white'
                        : unlocked
                          ? 'border-mint-green bg-pure-white'
                          : 'border-light-border bg-pure-white opacity-45'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                          rank.current ? 'bg-electric-blue' : unlocked ? 'bg-mint-green' : 'bg-light-border'
                        }`}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            {rank.current ? (
                              <circle cx="7" cy="7" r="3" stroke="white" strokeWidth="2"/>
                            ) : unlocked ? (
                              <path d="M2 7L5 10L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            ) : (
                              <circle cx="7" cy="7" r="3" stroke="#6B7280" strokeWidth="2"/>
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${rank.current ? 'text-electric-blue' : 'text-charcoal'}`}>
                            {rank.label}
                          </p>
                          <p className="text-xs text-slate-gray font-courier">{rank.desc}</p>
                        </div>
                      </div>
                      {rank.current && (
                        <span className="text-xs font-bold text-pure-white px-2 py-0.5 rounded bg-electric-blue">ACTUAL</span>
                      )}
                      {unlocked && !rank.current && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L7 12L13 4" stroke="#94FFD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {rank.current && rank.next && (
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="h-1.5 rounded-full bg-light-border overflow-hidden">
                          <div className="h-full rounded-full bg-mint-green transition-all" style={{ width: `${Math.min(100, barProgress)}%` }} />
                        </div>
                        <p className="text-xs text-slate-gray font-courier text-right">
                          {completedCount - threshold} / 10
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: About panel */}
        <div className="flex flex-col gap-5">
          <BentoCard>
            <AboutPanel />
          </BentoCard>
          <RetroButton variant="danger" onClick={() => setShowSignOut(true)}>
            CERRAR SESIÓN
          </RetroButton>
        </div>
      </div>
      </div>
      </div>

      <NavBar />
      <MobileNav />

      <RetroModal
        open={showSignOut}
        title="CONFIRMAR"
        variant="error"
        message="¿Estás seguro de cerrar sesión?"
        buttonText="CERRAR SESIÓN"
        onClose={() => setShowSignOut(false)}
        onAction={handleSignOut}
      />
    </main>
  );
}
