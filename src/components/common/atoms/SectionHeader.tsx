interface SectionHeaderProps {
  title: string;
  color?: string;
}

export function SectionHeader({ title, color = '#3D5CFF' }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-1 h-7 rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      <h2 className="text-lg font-bold text-charcoal">{title}</h2>
    </div>
  );
}
