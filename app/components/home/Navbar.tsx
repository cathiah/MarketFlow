import React from "react";
import { Form, NavLink, href } from "react-router";
import { LogIn, UserPlus, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export interface NavbarProps {
  user: User | null;
  isAuthorized: boolean;
}

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `transition-all hover:text-primary relative py-1 ${
          isActive
            ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
            : 'opacity-70'
        }`
      }
    >
      {label}
    </NavLink>
  </li>
);

const AuthButtons: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="flex items-center gap-2 sm:gap-4 border-l border-base-content/20 pl-4 sm:pl-6">
    {user ? (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-primary leading-none">
            {user.user_metadata?.username || "Utilisateur"}
          </span>
          <span className="text-[10px] opacity-50 lowercase">{user.email}</span>
        </div>
        
        <Form method="post" action={href("/auth/logout")}>
          <button
            type="submit"
            name="intent"
            value="logout"
            className="btn btn-circle btn-ghost btn-sm text-error hover:bg-error/10"
          >
            <LogOut size={18} />
          </button>
        </Form>
      </div>
    ) : (
      <div className="flex gap-1 sm:gap-2">
        <NavLink to={href("/auth/login")} className="btn btn-ghost btn-sm px-2 sm:px-4">
          <LogIn size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">Connexion</span>
        </NavLink>
        <NavLink to={href("/auth/register")} className="btn btn-primary btn-sm px-2 sm:px-4">
          <UserPlus size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">S'inscrire</span>
        </NavLink>
      </div>
    )}
  </div>
);



export const Navbar: React.FC<NavbarProps> = React.memo(function Navbar({ user, isAuthorized }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-base-200/80 backdrop-blur-md px-6 py-3 border-b border-base-content/10 flex justify-between items-center shadow-sm">
      <NavLink to={href("/")} className="text-xl font-black text-primary tracking-tighter">
        Market Flow
      </NavLink>

      <div className="flex items-center gap-8">
        <ul className="flex gap-6 text-sm font-medium">
          <NavItem to={href("/")} label="Accueil" />
          {!!user && <NavItem to={href("/orders")} label="Mes commandes" />}
          {!!user && <NavItem to={href("/notifications")} label="Notifications" />}
          {isAuthorized && <NavItem to={href("/dashboard/profile")} label="Dashboard" />}
        </ul>

        <AuthButtons user={user} />
      </div>
    </nav>
  );
});
