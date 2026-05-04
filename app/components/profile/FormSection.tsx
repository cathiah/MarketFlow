// components/Profil/FormSection.tsx
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  colorClass: string; 
  children: ReactNode;
}

export function FormSection({ title, colorClass, children }: FormSectionProps) {
  const gradientClass = `from-${colorClass}/50`;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`h-px flex-1 bg-gradient-to-r ${gradientClass} to-transparent`}></div>
        <h3 className={`text-[10px] uppercase tracking-[0.4em] font-black text-${colorClass} shrink-0`}>{title}</h3>
        <div className={`h-px flex-1 bg-gradient-to-l ${gradientClass} to-transparent`}></div>
      </div>
      {children}
    </div>
  );
}
