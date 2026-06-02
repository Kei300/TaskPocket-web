'use client';

import Image from 'next/image';

const FILE_MAP: Record<string, string> = {
  search: 'search.png',
  target: 'target.png',
  close: 'x.png',
  save: 'save.png',
  gear: 'gear.png',
  computer: 'computer.png',
  book: 'book.png',
  palette: 'art%20palette.png',
  plus: '+.png',
};

interface PngIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function PngIcon({ name, size = 24, className = '' }: PngIconProps) {
  const filename = FILE_MAP[name];
  if (!filename) return null;
  return (
    <Image
      src={`/icons/${filename}`}
      alt={name}
      width={size}
      height={size}
      className={className}
      unoptimized
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
