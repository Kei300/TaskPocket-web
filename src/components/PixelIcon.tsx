import type { SVGProps } from 'react';

export type IconName =
  | 'close' | 'check' | 'trash' | 'plus'
  | 'arrow-left' | 'reload' | 'home' | 'list'
  | 'search' | 'user' | 'eye' | 'eye-off'
  | 'chevron-right' | 'clock' | 'play' | 'pause'
  | 'target' | 'alarm' | 'save';

interface PixelIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const ICON_PATHS: Record<IconName, string> = {
  close:
    'M7 19H5V17H7V19ZM19 19H17V17H19V19ZM9 15V17H7V15H9ZM17 17H15V15H17V17ZM11 15H15V13H11V15ZM15 15H13V13H15V15ZM13 13H11V11H13V13ZM11 11H9V9H11V11ZM15 11H13V9H15V11ZM9 9H7V7H9V9ZM17 9H15V7H17V9ZM7 7H5V5H7V7ZM19 7H17V5H19V7Z',
  check:
    'M10 18H8v-2h2v2Zm-2-2H6v-2h2v2Zm4-2v2h-2v-2h2Zm-6 0H4v-2h2v2Zm8 0h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2V8h2v2Zm2-2h-2V6h2v2Z',
  trash:
    'M18 22H6V20H18V22ZM9 6H15V4H17V6H22V8H20V20H18V8H6V20H4V8H2V6H7V4H9V6ZM15 4H9V2H15V4Z',
  plus: 'M13 11h7v2h-7v7h-2v-7H4v-2h7V4h2v7Z',
  'arrow-left':
    'M20 11v2H4v-2zM8 13v2H6v-2zm2 2v2H8v-2zm2 2v2h-2v-2zm-4-6V9H6v2zM10 15V7H8v8zm2 2V5h-2v12z',
  reload:
    'M12 6v4H8V8c-2.2 0-4 1.8-4 4s1.8 4 4 4h8c2.2 0 4-1.8 4-4h2c0 3.3-2.7 6-6 6H8c-3.3 0-6-2.7-6-6s2.7-6 6-6V4l4 2Z',
  home:
    'M4 20h16v2H4zm16-10h2v10h-2zM2 10h2v10H2zm2-2h2v2H4zm2-2h2v2H6zm2-2h2v2H8zm2-2h4v2h-4zm4 2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zM8 14h2v6H8zm2-2h4v2h-4zm4 2h2v6h-2z',
  list:
    'M4 2h16v2H4zm2 5h2v2H6zm4 0h8v2h-8zm-4 4h2v2H6zm4 0h8v2h-8zm-4 4h2v2H6zm4 0h8v2h-8zm-6 5h16v2H4zM2 4h2v16H2zm18 0h2v16h-2z',
  search:
    'M22 22h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-6-2H6v-2h8v2Zm4 0h-2v-2h2v2ZM6 16H4v-2h2v2Zm10 0h-2v-2h2v2ZM4 14H2V6h2v8Zm14 0h-2V6h2v8ZM6 6H4V4h2v2Zm10 0h-2V4h2v2Zm-2-2H6V2h8v2Z',
  user:
    'M9 2h6v2H9zm0 8h6v2H9zm6-6h2v6h-2zM7 4h2v6H7zM4 18h2v4H4zm14 0h2v4h-2zM8 14h8v2H8zm-2 2h2v2H6zm10 0h2v2h-2z',
  eye:
    'M16 20H8v-2h8v2Zm-8-2H4v-2h4v2Zm12 0h-4v-2h4v2ZM4 16H2v-2h2v2Zm10-6h-2v2h2v-2h2v4h-2v2h-4v-2H8v-4h2V8h4v2Zm8 6h-2v-2h2v2ZM2 14H0v-4h2v4Zm22 0h-2v-4h2v4ZM4 10H2V8h2v2Zm18 0h-2V8h2v2ZM8 8H4V6h4v2Zm12 0h-4V6h4v2Zm-4-2H8V4h8v2Z',
  'eye-off':
    'M0 10h2v4H0zm24 0h-2v4h2zm-8 0h-2v2h2zm-6 0H8v4h2zM2 8h2v2H2zm0 8h2v-2H2zm20-8h-2v2h2zm0 8h-2v-2h2zM4 6h4v2H4zm0 12h4v-2H4zM20 6h-4v2h4zM10 4h6v2h-6zM8 20h8v-2H8zm4-12h2v2h-2zm-2 6h4v2h-4zM8 8h2v2H8zm2 2h2v4h-2zm2 2h2v2h-2zM6 6h2v2H6zM4 4h2v2H4zM2 2h2v2H2zm12 12h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z',
  'chevron-right':
    'M16 13v-2h-2v2h2Zm-2-2V9h-2v2h2Zm0 4v-2h-2v2h2Zm-2-6V7h-2v2h2Zm0 8v-2h-2v2h2ZM10 7V5H8v2h2Zm0 12v-2H8v2h2Z',
  clock:
    'M6 2h12v2H6zM2 6h2v12H2zm18 0h2v12h-2zm-2-2h2v2h-2zM4 4h2v2H4zm2 18h12v-2H6zm12-2h2v-2h-2zM4 20h2v-2H4zm7-14h2v7h-2zm2 7h2v2h-2zm2 2h2v2h-2z',
  play: 'M8 5v14l11-7z',
  pause: 'M6 4h4v16H6zm8 0h4v16h-4z',
  target:
    'M12 4V2h-2v2H8v2H6v2H4v2H2v2h2v2h2v2h2v2h2v2h2v-2h-2v-2H8v-2H6v-2H4v-2h2V8h2V6h2V4h2zm0 8v-2h-2v2h2zm2-2h2v2h-2v-2zm-2 2h-2v2h2v-2zm0 0v2h2v-2h-2zm8-6h-2v2h-2v2h2v2h2V8h2V6h-2V4z',
  alarm:
    'M19 6V4h-2v2H7V4H5v2H3v2h2v2H3v2h2v2H3v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h-2v-2h-2V8h-2V6h-2zm0 2h2v2h-2V8zm-2-2h2v2h-2V6zM7 6h2v2H7V6zm0 0H5v2h2V6zm10 12h-2v2h-2v2h-2v-2h-2v-2H7v-2H5v-2H3v-2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v2h-2v2h-2v2h-2z',
  save:
    'M5 2h14l3 3v14l-3 3H5l-3-3V5l3-3zm0 2l-2 2v14l2 2h14l2-2V5l-2-2H5zm2 14h10v-2H7v2zm0-4h10v-2H7v2zm0-4h7V4H7v6zm9-6v4h2V4h-2z',
};

export function PixelIcon({ name, size = 24, className = '', style, ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      {...props}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
