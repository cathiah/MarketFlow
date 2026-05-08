import React from "react";
import { Link, href } from "react-router";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface HeaderProps {
  isUpdating: boolean;
}

export const EditProfileHeader: React.FC<HeaderProps> = React.memo(function EditProfileHeader({ isUpdating }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-200/50 p-4 rounded-3xl border border-white/5 shadow-xl">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link to={href("/profile")} className="btn btn-ghost btn-circle bg-base-300/50 hover:bg-primary hover:text-primary-content transition-all duration-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          Paramètres <span className="text-primary hidden sm:inline">|</span>
          <span className="text-sm font-medium opacity-50 lowercase">compte</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-white/5">
        <Link to={href("/profile")} className="btn btn-ghost btn-sm flex-1 sm:flex-none rounded-xl hover:bg-error/10 hover:text-error transition-colors">
          Annuler
        </Link>
        <button 
          form="edit-form" 
          type="submit" 
          disabled={isUpdating} 
          className="btn btn-primary btn-sm flex-1 sm:flex-none gap-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
        >
          {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {isUpdating ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
});
