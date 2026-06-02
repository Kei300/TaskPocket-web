'use client';

import { Mascot } from '@/src/components/Mascot';

interface AppHeaderProps {
  subtitle?: string;
}

export function AppHeader({ subtitle }: AppHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Mascot state="idle" size={36} />
          <span className="text-[28px] font-vt323 text-electric-blue tracking-wide">
            TaskPocket
          </span>
        </div>
      </div>
      {subtitle && (
        <p className="text-2xl text-slate-gray mt-2 tracking-wide">{subtitle}</p>
      )}
    </div>
  );
}
