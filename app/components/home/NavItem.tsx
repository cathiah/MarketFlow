import { NavLink } from "react-router";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  mobile?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ to, label, icon: Icon, onClick, mobile = false }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-2 transition-all duration-200 py-1 touch-manipulation ${
          mobile
            ? `w-full px-3 py-2.5 rounded-lg ${isActive ? "bg-primary/10" : "hover:bg-base-content/5 active:bg-base-content/10"}`
            : ""
        } ${
          isActive
            ? "text-primary"
            : "opacity-70 hover:opacity-100 hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Indicateur actif desktop */}
          {!mobile && isActive && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
          )}

          <span className={`shrink-0 transition-transform duration-200 ${mobile ? "group-hover:scale-110" : ""}`}>
            <Icon size={mobile ? 20 : 18} />
          </span>

          {/* Label desktop : apparaît au survol */}
          {!mobile && (
            <span
              className={`
                overflow-hidden whitespace-nowrap text-sm font-medium
                transition-all duration-300 ease-in-out
                ${isActive
                  ? "max-w-30 opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-30 group-hover:opacity-100"
                }
              `}
            >
              {label}
            </span>
          )}

          {/* Label mobile : toujours visible */}
          {mobile && (
            <span className="text-sm font-medium transition-transform duration-200 group-hover:translate-x-1">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  </li>
);