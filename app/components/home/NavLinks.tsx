import type { Profile } from "~/types/profile";
import { getNavLinks } from "./navLinks.config";
import { NavItem } from "./NavItem";

interface NavLinksProps {
  user: Profile | null;
  isAuthorized: boolean;
  onClick?: () => void;
  mobile?: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ user, isAuthorized, onClick, mobile = false }) => (
  <ul className={`flex text-sm font-medium ${mobile ? "flex-col gap-1" : "items-center gap-4"}`}>
    {getNavLinks(user, isAuthorized)
      .filter((link) => link.show)
      .map((link) => (
        <NavItem
          key={link.to}
          to={link.to}
          label={link.label}
          icon={link.icon}
          onClick={onClick}
          mobile={mobile}
        />
      ))}
  </ul>
);