'use client';

import { useState, type InputHTMLAttributes } from 'react';

interface PixelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function PixelInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}: PixelInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label className="text-charcoal text-sm font-semibold">{label}</label>
      ) : null}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`border ${focused ? 'border-electric-blue' : 'border-light-border'} rounded-[6px] px-3 py-2.5 text-base text-charcoal bg-pure-white font-courier outline-none transition-colors`}
      />
    </div>
  );
}
