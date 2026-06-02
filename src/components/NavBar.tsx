'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PixelIcon } from './PixelIcon';

const NAV_ITEMS = [
  { href: '/home', label: 'Inicio', icon: 'home' as const },
  { href: '/tasks', label: 'Tareas', icon: 'list' as const },
  { href: '/search', label: 'Buscar', icon: 'search' as const },
  { href: '/pomodoro', label: 'Pomodoro', icon: 'alarm' as const },
  { href: '/profile', label: 'Perfil', icon: 'user' as const },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 flex-col items-center gap-6 py-6 bg-pure-white border-r border-light-border z-40">
      <Link href="/home" className="text-electric-blue font-vt323 text-2xl no-underline">
        TP
      </Link>
      <div className="flex flex-col items-center gap-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center w-10 h-10 rounded-[6px] transition-colors ${
                isActive
                  ? 'bg-electric-blue text-pure-white'
                  : 'text-slate-gray hover:text-charcoal hover:bg-ice-white'
              }`}
              title={item.label}
            >
              <PixelIcon name={item.icon} size={20} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-pure-white border-t border-light-border z-40">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors no-underline ${
                isActive ? 'text-electric-blue' : 'text-slate-gray'
              }`}
            >
              <PixelIcon name={item.icon} size={18} />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
