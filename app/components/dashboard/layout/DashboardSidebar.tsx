import { Form, Link, href } from "react-router";
import { LayoutDashboard, X, FileText, Tag, User, LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <aside className="drawer-side z-40">
      <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="w-72 min-h-full bg-base-200 text-base-content flex flex-col border-r border-white/5 shadow-2xl">
        <div className="p-8 flex items-center justify-between">
          <Link to={href("/")} className="group flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-content rounded-xl shadow-[0_0_15px_rgba(255,121,198,0.35)] group-hover:scale-105 transition-transform">
              <LayoutDashboard size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">MARKET<span className="text-primary">FLOW</span></span>
              <span className="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em]">Seller Hub</span>
            </div>
          </Link>
          <label htmlFor="admin-drawer" className="btn btn-xs btn-circle btn-ghost lg:hidden">
            <X size={16} />
          </label>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto">
          <SidebarSection label="Gestion Boutique">
            <SidebarItem to={href("/dashboard")} icon={LayoutDashboard} label="Tableau de bord" end />
            <SidebarItem to={href("/dashboard/products")} icon={FileText} label="Produits" end />
            <SidebarItem to={href("/dashboard/orders")} icon={FileText} label="Commandes" end />
            {isAdmin && <SidebarItem to={href("/dashboard/categories")} icon={Tag} label="Catégories" />}
          </SidebarSection>

          {isAdmin && (
            <SidebarSection label="Administration" color="text-secondary">
              <SidebarItem to={href("/dashboard/admin/users")} icon={User} label="Utilisateurs" />
            </SidebarSection>
          )}
        </nav>

        <div className="p-4 bg-base-300/40 border-t border-white/5">
          <Form method="post" action={href("/auth/logout")}>
            <button type="submit" className="btn btn-ghost hover:btn-error btn-block justify-start gap-4 normal-case font-medium text-sm group transition-all rounded-xl border border-transparent hover:border-error/20">
              <div className="p-1.5 rounded-lg bg-error/10 text-error group-hover:bg-error group-hover:text-white transition-all">
                <LogOut size={14} />
              </div>
              Se déconnecter
            </button>
          </Form>
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({ label, color = "text-base-content/30", children }: { label: string, color?: string, children: React.ReactNode }) {
  return (
    <section>
      <h3 className={`px-4 mb-4 text-[10px] font-black uppercase tracking-[0.25em] ${color}`}>{label}</h3>
      <div className="grid gap-1">{children}</div>
    </section>
  );
}
