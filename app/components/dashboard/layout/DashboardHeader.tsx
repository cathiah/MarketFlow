import { Menu, ChevronRight } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import type { Profile } from "~/types/profile";

export function DashboardHeader({ user, title }: { user: Profile, title: string }) {
  return (
    <header className="navbar sticky top-0 z-20 bg-base-300/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 h-16">
      <div className="flex-none lg:hidden">
        <label htmlFor="admin-drawer" className="btn btn-square btn-ghost drawer-button">
          <Menu size={22} />
        </label>
      </div>
      
      <div className="flex-1 ml-2 lg:ml-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] leading-none mb-1">
            Espace {user.role}
          </span>
          <h1 className="text-sm font-bold flex items-center gap-2 opacity-90">
            Dashboard <ChevronRight size={12} className="opacity-30" /> 
            <span className="font-medium text-xs opacity-60">{title}</span>
          </h1>
        </div>
      </div>

      <div className="flex-none flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-xs font-bold">{user.full_name}</span>
          <span className="text-[9px] uppercase opacity-40 font-black tracking-tighter">En ligne</span>
        </div>
        <UserAvatar user={user} />
      </div>
    </header>
  );
}
