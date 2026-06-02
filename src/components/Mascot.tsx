import Image from 'next/image';

export type MascotState = 'idle' | 'success' | 'focus' | 'oops';

interface MascotProps {
  state?: MascotState;
  size?: number;
}

const MASCT_MAP: Record<MascotState, string> = {
  idle: '/images/mascot/Idle.png',
  success: '/images/mascot/Success.png',
  focus: '/images/mascot/focus.png',
  oops: '/images/mascot/oops.png',
};

export function Mascot({ state = 'idle', size = 120 }: MascotProps) {
  return (
    <Image
      src={MASCT_MAP[state]}
      alt={`Bun ${state}`}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
}
