'use client';

import type { ReactNode } from 'react';

type BentoVariant = 'default' | 'alert' | 'success';

interface BentoCardProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: BentoVariant;
  className?: string;
}

const VARIANT_CLASS: Record<BentoVariant, string> = {
  default: 'border-light-border',
  alert: 'border-coral-pink',
  success: 'border-mint-green',
};

export function BentoCard({
  children,
  onClick,
  variant = 'default',
  className = '',
}: BentoCardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`bg-pure-white border ${VARIANT_CLASS[variant]} rounded-[6px] p-4 text-left ${onClick ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
