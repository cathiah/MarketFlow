import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) close(); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-base-200/80 backdrop-blur-md border-b border-base-content/10 shadow-sm">
      {/* Barre principale */}
      <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-3">
        <NavLink
          to={href("/")}
          onClick={close}
          className="text-xl font-black text-primary tracking-tighter transition-opacity duration-200 hover:opacity-80 shrink-0"
        >
          Market Flow
        </NavLink>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 min-w-0">
          <NavLinks user={user} isAuthorized={isAuthorized} />
          <AuthButtons user={user} />
        </div>

        {/* Bouton hamburger mobile */}
        <button
          className="md:hidden btn btn-ghost btn-sm btn-circle transition-transform duration-200 active:scale-90"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen
            ? <X size={22} className="transition-transform duration-200 rotate-90" />
            : <Menu size={22} className="transition-transform duration-200" />
          }
        </button>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        role="region"
        aria-label="Navigation mobile"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[calc(100dvh-56px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 bg-base-200/95 backdrop-blur-md border-t border-base-content/10 overflow-y-auto">
          <div className="pt-4 flex flex-col gap-1">
            <NavLinks user={user} isAuthorized={isAuthorized} onClick={close} mobile={true} />
          </div>
          <div className="mt-4">
            <AuthButtons user={user} onClose={close} />
          </div>
        </div>
      </div>
    </nav>
  );
});