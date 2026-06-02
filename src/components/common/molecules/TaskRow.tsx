'use client';

import { formatDateShort } from '@/src/utils/todo';

interface TaskRowProps {
  title: string;
  description?: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  dueDate?: string;
  tagText?: string;
  listColor?: string;
  onClick?: () => void;
}

export function TaskRow({
  title,
  description,
  isCompleted,
  onToggleComplete,
  dueDate,
  tagText,
  listColor,
  onClick,
}: TaskRowProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center bg-pure-white border border-light-border rounded-[6px] px-3 py-3 gap-3 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {listColor && (
        <div
          className="w-1 self-stretch rounded-[2px] flex-shrink-0"
          style={{ backgroundColor: listColor }}
        />
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
        className={`w-5.5 h-5.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isCompleted
            ? 'bg-mint-green border-mint-green'
            : 'bg-transparent border-light-border'
        }`}
        aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        {isCompleted && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="#3D5CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {tagText && (
          <span className="text-xs font-bold text-electric-blue">{tagText}</span>
        )}
        <p
          className={`text-sm font-semibold truncate ${
            isCompleted ? 'text-slate-gray line-through' : 'text-charcoal'
          }`}
        >
          {title}
        </p>
        {description && (
          <p className="text-xs text-slate-gray truncate">{description}</p>
        )}
        {dueDate && (
          <span className="text-xs text-slate-gray">{formatDateShort(dueDate)}</span>
        )}
      </div>
    </div>
  );
}
