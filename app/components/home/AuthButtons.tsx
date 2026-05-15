import { NavLink, href } from "react-router";
import { LogIn, UserPlus } from "lucide-react";
import type { Profile } from "~/types/profile";
import { LogoutButton } from "./LogoutButton";

interface AuthButtonsProps {
  user: Profile | null;
  onClose?: () => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ user, onClose }) => (
  <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-base-content/20 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
    {user ? (
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Infos utilisateur */}
        <div className="flex flex-col md:items-end min-w-0 flex-1 md:flex-none">
          <span className="text-xs font-bold text-primary leading-none truncate max-w-45 sm:max-w-60 md:max-w-30">
            {user.username ?? "Utilisateur"}
          </span>
          <span className="text-[10px] opacity-50 lowercase truncate max-w-45 sm:max-w-60 md:max-w-30">
            {user.email}
          </span>
        </div>
        {/* Bouton logout */}
        <div className="shrink-0">
          <LogoutButton onClose={onClose} />
        </div>
      </div>
    ) : (
      <div className="flex gap-2 w-full md:w-auto">
        <NavLink
          to={href("/auth/login")}
          onClick={onClose}
          className="btn btn-ghost btn-sm flex-1 md:flex-none gap-2 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
        >
          <LogIn size={18} /> Connexion
        </NavLink>
        <NavLink
          to={href("/auth/register")}
          onClick={onClose}
          className="btn btn-primary btn-sm flex-1 md:flex-none gap-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 touch-manipulation"
        >
          <UserPlus size={18} /> S'inscrire
        </NavLink>
      </div>
    )}
  </div>
);