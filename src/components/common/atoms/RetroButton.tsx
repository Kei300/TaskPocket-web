'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-electric-blue text-pure-white border-charcoal',
  secondary: 'bg-pure-white text-charcoal border-charcoal',
  danger: 'bg-coral-pink text-pure-white border-charcoal',
};

export function RetroButton({
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}: RetroButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`border-2 ${VARIANT_CLASS[variant]} rounded-[6px] py-3 px-6 font-semibold text-base flex items-center justify-center gap-2 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-85 cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
