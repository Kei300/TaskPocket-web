'use client';

import { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '@/src/components/AuthGuard';
import { AppHeader, BentoCard } from '@/src/components/common';
import { Mascot } from '@/src/components/Mascot';
import { PixelIcon } from '@/src/components/PixelIcon';
import { NavBar, MobileNav } from '@/src/components/NavBar';

type PomodoroMode = 'focus' | 'break';

const FOCUS_OPTIONS = [15, 20, 25, 30, 45];
const BREAK_OPTIONS = [5, 10, 15, 20, 30];

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PomodoroPage() {
  return (
    <AuthGuard>
      <PomodoroScreen />
    </AuthGuard>
  );
}

function PomodoroScreen() {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [remaining, setRemaining] = useState(focusMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  const modeRef = useRef(mode);
  const focusRef = useRef(focusMinutes);
  const breakRef = useRef(breakMinutes);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { focusRef.current = focusMinutes; }, [focusMinutes]);
  useEffect(() => { breakRef.current = breakMinutes; }, [breakMinutes]);

  const config = mode === 'focus'
    ? { seconds: focusMinutes * 60, accent: '#FF708A', label: 'ENFOQUE', icon: 'target' as const }
    : { seconds: breakMinutes * 60, accent: '#FFD166', label: 'DESCANSO', icon: 'check' as const };

  const total = config.seconds;
  const elapsed = total - remaining;
  const progress = total > 0 ? (elapsed / total) * 100 : 0;

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          const next = modeRef.current === 'focus' ? 'break' : 'focus';
          setMode(next);
          return next === 'focus' ? focusRef.current * 60 : breakRef.current * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setMode('focus');
    setRemaining(focusMinutes * 60);
  };

  const handleSetFocus = (mins: number) => {
    if (isActive) return;
    setFocusMinutes(mins);
    if (mode === 'focus') setRemaining(mins * 60);
  };

  const handleSetBreak = (mins: number) => {
    if (isActive) return;
    setBreakMinutes(mins);
    if (mode === 'break') setRemaining(mins * 60);
  };

  return (
    <main className="flex-1 bg-ice-white overflow-y-hidden">
      <NavBar />
      <MobileNav />
      <div className="md:ml-16 flex justify-center">
        <div className="w-full max-w-5xl p-6 pb-24">
          <AppHeader subtitle="Pomodoro" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[calc(100vh-5rem)]">
          <div className="flex flex-col items-center gap-6">

            <BentoCard className="w-full border" variant={mode === 'focus' ? 'alert' : 'default'}>
              <div className="flex flex-col items-center gap-6 py-12">
                <span
                  className="text-base font-bold tracking-widest"
                  style={{ color: config.accent }}
                >
                  {config.label}
                </span>

                <span
                  className="text-8xl md:text-[10rem] font-bold font-vt323 text-charcoal tabular-nums tracking-wider leading-none"
                  style={{ fontVariant: 'tabular-nums' }}
                >
                  {formatTime(remaining)}
                </span>

                <div className="w-full h-2.5 rounded-full bg-light-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%`, backgroundColor: config.accent }}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={handleStart}
                    disabled={isActive}
                    className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center cursor-pointer transition-all ${
                      isActive
                        ? 'opacity-40 border-light-border bg-light-border'
                        : 'border-mint-green bg-mint-green text-charcoal hover:opacity-85'
                    }`}
                    aria-label="Iniciar"
                  >
                    <PixelIcon name="play" size={32} />
                  </button>
                  <button
                    onClick={handlePause}
                    disabled={!isActive}
                    className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center cursor-pointer transition-all ${
                      isActive
                        ? 'border-sun-yellow bg-sun-yellow text-charcoal hover:opacity-85'
                        : 'opacity-40 border-light-border bg-light-border text-slate-gray'
                    }`}
                    aria-label="Pausar"
                  >
                    <PixelIcon name="pause" size={32} />
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-16 h-16 rounded-full border-[3px] border-light-border flex items-center justify-center cursor-pointer hover:opacity-75 text-charcoal bg-transparent"
                    aria-label="Reiniciar"
                  >
                    <PixelIcon name="reload" size={32} />
                  </button>
                </div>
              </div>
            </BentoCard>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Mascot state={isActive ? (mode === 'focus' ? 'focus' : 'success') : 'idle'} size={128} />
            <BentoCard>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-coral-pink tracking-wider">
                  ENFOQUE (min)
                </span>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_OPTIONS.map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSetFocus(mins)}
                      disabled={isActive}
                      className={`px-4 py-2 rounded-[6px] border text-sm font-bold cursor-pointer transition-all ${
                        focusMinutes === mins
                          ? 'border-coral-pink bg-coral-pink text-pure-white'
                          : 'border-light-border bg-pure-white text-charcoal hover:opacity-80'
                      } ${isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-sun-yellow tracking-wider">
                  DESCANSO (min)
                </span>
                <div className="flex flex-wrap gap-2">
                  {BREAK_OPTIONS.map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSetBreak(mins)}
                      disabled={isActive}
                      className={`px-4 py-2 rounded-[6px] border text-sm font-bold cursor-pointer transition-all ${
                        breakMinutes === mins
                          ? 'border-sun-yellow bg-sun-yellow text-charcoal'
                          : 'border-light-border bg-pure-white text-charcoal hover:opacity-80'
                      } ${isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
