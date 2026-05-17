import { href } from "react-router";
import { Home, ShoppingBag, Bell, User, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Profile } from "~/types/profile";

export interface NavLinkConfig {
  to: string;
  label: string;
  icon: LucideIcon;
  show: boolean;
  badge?: number; // nombre de notifs non lues (undefined = pas de badge)
}

export const getNavLinks = (
  user: Profile | null,
  isAuthorized: boolean,
  unreadCount = 0
): NavLinkConfig[] => [
  { to: href("/"),              label: "Accueil",       icon: Home,            show: true },
  { to: href("/orders"),        label: "Mes commandes", icon: ShoppingBag,     show: !!user },
  {
    to: href("/notifications"),
    label: "Notifications",
    icon: Bell,
    show: !!user,
    badge: unreadCount > 0 ? unreadCount : undefined,
  },
  { to: href("/profile"),       label: "Profile",       icon: User,            show: !!user },
  { to: href("/dashboard"),     label: "Dashboard",     icon: LayoutDashboard, show: isAuthorized },
];
