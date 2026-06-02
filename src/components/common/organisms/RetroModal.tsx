'use client';

import type { ReactNode } from 'react';
import { RetroButton } from '../atoms/RetroButton';

type ModalVariant = 'default' | 'error' | 'success';

interface RetroModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  variant?: ModalVariant;
  message?: string;
  buttonText?: string;
  onAction?: () => void;
}

const VARIANT_HEADER: Record<ModalVariant, string> = {
  default: 'text-charcoal',
  error: 'bg-coral-pink text-pure-white',
  success: 'bg-mint-green text-charcoal',
};

export function RetroModal({
  open,
  title,
  onClose,
  children,
  variant = 'default',
  message,
  buttonText,
  onAction,
}: RetroModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[85%] max-w-md bg-pure-white border border-light-border rounded-[6px] overflow-hidden">
        <div className={`flex items-center justify-between px-4 py-3 ${VARIANT_HEADER[variant]}`}>
          <span className="text-base font-bold tracking-wide">{title}</span>
          <button onClick={onClose} className="p-1 cursor-pointer" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {message ? (
            <p className="text-base text-charcoal font-courier leading-relaxed">{message}</p>
          ) : (
            children
          )}

          {buttonText && (
            <RetroButton variant="secondary" onClick={onAction || onClose}>
              {buttonText}
            </RetroButton>
          )}
        </div>
      </div>
    </div>
  );
}
