'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GuestGuard } from '@/src/components/GuestGuard';
import { BentoCard, PixelInput, RetroButton, RetroModal } from '@/src/components/common';
import { PixelIcon } from '@/src/components/PixelIcon';
import { Mascot } from '@/src/components/Mascot';
import { useAuth } from '@/src/hooks/use-auth';

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginScreen />
    </GuestGuard>
  );
}

function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ visible: false, message: '' });

  const showError = (msg: string) => setModal({ visible: true, message: msg });
  const closeModal = () => setModal({ visible: false, message: '' });

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Completa todos los campos.');
      return;
    }

    setSubmitting(true);
    try {
      await signIn({ email, password });
      router.replace('/home');
    } catch (error: unknown) {
      const err = error as { code?: string; response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.code === 'auth/invalid-credential'
          ? 'Email o contraseña incorrectos.'
          : err?.response?.data?.message
            || err?.message
            || 'Error al iniciar sesión.';
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex min-h-screen bg-ice-white">
      {/* Panel izquierdo: branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-electric-blue/5 to-deep-purple/5 items-center justify-center p-12">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <Mascot state="idle" size={160} />
          <h1 className="text-6xl font-vt323 text-electric-blue tracking-wider">TaskPocket</h1>
          <p className="text-base text-slate-gray font-courier leading-relaxed">
            Tareas, tiempos y organización al alcance de tu mano.
          </p>
          <div className="flex gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-coral-pink" />
            <div className="w-3 h-3 rounded-full bg-sun-yellow" />
            <div className="w-3 h-3 rounded-full bg-mint-green" />
          </div>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div className="flex-1 md:w-1/2 flex items-center justify-center p-6">
        <BentoCard className="w-full max-w-sm flex flex-col gap-6 p-8">
          {/* Mascot mobile */}
          <div className="flex flex-col items-center gap-2 md:hidden">
            <Mascot state="idle" size={80} />
            <span className="text-lg font-vt323 text-electric-blue tracking-wide">
              TaskPocket
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 bg-electric-blue rounded-[2px]" />
            <h2 className="text-xl font-bold text-charcoal">Iniciar Sesión</h2>
          </div>

          <div className="flex flex-col gap-4">
            <PixelInput
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="tu@email.com"
              type="email"
            />
            <div className="relative">
              <PixelInput
                label="Contraseña"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-8 text-slate-gray hover:text-charcoal cursor-pointer bg-transparent border-none"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <PixelIcon name={showPassword ? 'eye' : 'eye-off'} size={20} />
              </button>
            </div>
          </div>

          <RetroButton variant="primary" disabled={submitting} onClick={handleLogin}>
            {submitting ? 'ENTRANDO…' : 'INICIAR SESIÓN'}
          </RetroButton>

          <p className="text-center text-sm text-slate-gray">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-electric-blue font-bold cursor-pointer bg-transparent border-none underline"
            >
              Regístrate
            </button>
          </p>
        </BentoCard>
      </div>

      <RetroModal
        open={modal.visible}
        title="SISTEMA: ERROR"
        variant="error"
        message={modal.message}
        buttonText="OK"
        onClose={closeModal}
        onAction={closeModal}
      />
    </main>
  );
}
