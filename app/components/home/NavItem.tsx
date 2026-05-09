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
        `group relative flex items-center gap-2 transition-all duration-200 py-1 ${
          mobile ? "w-full px-2 rounded-lg hover:bg-base-content/5" : ""
        } ${
          isActive
            ? "text-primary"
            : "opacity-70 hover:opacity-100 hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {!mobile && isActive && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
          )}

          <span className={`flex-shrink-0 transition-transform duration-200 ${mobile ? "group-hover:scale-110" : ""}`}>
            <Icon size={mobile ? 20 : 18} />
          </span>

          {!mobile && (
            <span
              className={`
                overflow-hidden whitespace-nowrap text-sm font-medium
                transition-all duration-300 ease-in-out
                ${isActive
                  ? "max-w-[120px] opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
                }
              `}
            >
              {label}
            </span>
          )}

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