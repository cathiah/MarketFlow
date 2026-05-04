import { createClient } from "~/lib/supabase.server";
import { data, Outlet, useNavigation, useRouteError } from "react-router";
import { useMemo } from "react";
import { Navbar } from "../components/home/Navbar";
import type { Route } from "./+types/_layout";
import { RouteErrorBoundary } from "~/components/error/RouteErrorBoundary";
import type { Profile, UserRole } from "~/types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return data({ user: null, role: "buyer" as UserRole }, { headers });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<Pick<Profile, "role">>();

  const role: UserRole = profile?.role || "buyer";
  return data({ user, role }, { headers });
}

export default function HomeLayout({ loaderData }: Route.ComponentProps) {
  const { user, role } = loaderData;
  const navigation = useNavigation();
  
  const isNavigating = navigation.state !== "idle";
  const isAuthorized = useMemo(() => ["admin", "seller"].includes(role), [role]);

  return (
    <div data-theme="dracula" className="min-h-screen bg-base-300 text-base-content font-sans">
      <Navbar user={user} isAuthorized={isAuthorized} />

      <div 
        className={`fixed top-0 left-0 h-1 bg-primary z-60 transition-all duration-500 ease-out ${
          isNavigating ? "w-1/2 opacity-100" : "w-full opacity-0"
        }`} 
      />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-6">
        <Outlet context={{ user, role }} />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <RouteErrorBoundary error={error} />;
}
