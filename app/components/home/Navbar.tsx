import React, { useState } from "react";
import { NavLink, href } from "react-router";
import { Menu, X } from "lucide-react";
import type { Profile } from "~/types/profile";
import { AuthButtons } from "./AuthButtons";
import { NavLinks } from "./NavLinks";

export interface NavbarProps {
  user: Profile | null;
  isAuthorized: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(function Navbar({ user, isAuthorized }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-base-200/80 backdrop-blur-md border-b border-base-content/10 shadow-sm">
      {/* Desktop */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3">
        <NavLink
          to={href("/")}
          className="text-xl font-black text-primary tracking-tighter transition-opacity duration-200 hover:opacity-80"
        >
          Market Flow
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          <NavLinks user={user} isAuthorized={isAuthorized} />
          <AuthButtons user={user} />
        </div>

        <button
          className="md:hidden btn btn-ghost btn-sm btn-circle transition-transform duration-200 active:scale-90"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Menu"
        >
          {isOpen
            ? <X size={22} className="transition-transform duration-200 rotate-90" />
            : <Menu size={22} className="transition-transform duration-200" />
          }
        </button>
      </div>

      {/* Mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 bg-base-200/95 backdrop-blur-md border-t border-base-content/10">
          <div className="pt-4 flex flex-col gap-3">
            <NavLinks user={user} isAuthorized={isAuthorized} onClick={close} mobile={true} />
          </div>
          <AuthButtons user={user} onClose={close} />
        </div>
      </div>
    </nav>
  );
});