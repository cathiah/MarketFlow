import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

export function SidebarItem({ to, icon: Icon, label, end = false }: SidebarItemProps) {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all active:scale-95 ${
        isActive 
          ? "bg-primary text-primary-content shadow-lg shadow-primary/20" 
          : "text-base-content/70 hover:bg-base-content/10 hover:text-base-content"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}