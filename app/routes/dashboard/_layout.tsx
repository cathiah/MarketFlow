import { data, Outlet, useLocation, useRouteError } from "react-router";
import type { Route } from "./+types/_layout";
import { RouteErrorBoundary } from "~/components/error/RouteErrorBoundary";
import { DashboardSidebar, DashboardHeader } from "~/components/dashboard/layout";
import { redirect, href } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Profile } from "~/types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw redirect(href("/auth/login"), { headers });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single<Profile>();

  if (profileError && profileError.code !== "PGRST116") {
    throw new Response("Erreur serveur", { status: 500 });
  }

  if (!profile) {
    throw redirect(href("/"), { headers });
  }

  if (profile.role !== "admin" && profile.role !== "seller") {
    throw redirect(href("/"), { headers });
  }

  const avatar_url =
    profile.avatar_url && !profile.avatar_url.startsWith("http")
      ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl
      : profile.avatar_url;

  return data({ user: { ...profile, avatar_url } satisfies Profile }, { headers });
}

export default function DashboardLayout({ loaderData: { user } }: Route.ComponentProps) {
  const { pathname } = useLocation();
  
  const getPageTitle = () => {
    if (pathname.includes("/profile")) return "Profil";
    if (pathname.includes("/categories")) return "Catégories";
    if (pathname.includes("/products")) return "Produits";
    if (pathname.includes("/orders")) return "Commandes";
    if (pathname.includes("/admin/users")) return "Utilisateurs";
    return "Dashboard";
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-300 font-sans" data-theme="dracula">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        <DashboardHeader user={user} title={getPageTitle()} />

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>

      <DashboardSidebar isAdmin={user.role === "admin"} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <RouteErrorBoundary error={error} />;
}