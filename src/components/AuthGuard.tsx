'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/src/hooks/use-auth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-ice-white">
        <p className="text-slate-gray text-lg font-pixelify">Cargando...</p>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
