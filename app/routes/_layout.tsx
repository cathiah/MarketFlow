import { data, Outlet, useNavigation, useRouteError } from "react-router";
import { useMemo } from "react";
import { createClient } from "~/lib/supabase.server";
import { Navbar } from "../components/home/Navbar";
import { RouteErrorBoundary } from "~/components/error/RouteErrorBoundary";
import type { Profile, UserRole } from "~/types/profile";
import type { Route } from "./+types/_layout";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return data({ user: null }, { headers });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle<Profile>();

  if (!profile) {
    return data({ user: null }, { headers });
  }

  const avatar_url =
    profile.avatar_url && !profile.avatar_url.startsWith("http")
      ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl
      : profile.avatar_url;

  return data({ user: { ...profile, avatar_url } satisfies Profile }, { headers });
}

export default function HomeLayout({ loaderData: { user } }: Route.ComponentProps) {
  const role: UserRole = user?.role ?? "buyer";
  const isAuthorized = useMemo(() => (["admin", "seller"] as UserRole[]).includes(role), [role]);

  const { state } = useNavigation();
  const isNavigating = state !== "idle";

  return (
    <div data-theme="dracula" className="min-h-screen bg-base-300 text-base-content font-sans">
      <Navbar user={user} isAuthorized={isAuthorized} />

      <div
        className={`fixed top-0 left-0 h-1 bg-primary z-60 transition-all duration-500 ease-out ${
          isNavigating ? "w-1/2 opacity-100" : "w-full opacity-0"
        }`}
      />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-6">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <RouteErrorBoundary error={error} />;
}