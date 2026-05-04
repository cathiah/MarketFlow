import { href, redirect } from "react-router";
import { handleAuthAction } from "./auth.actions.server";
import { createClient } from "~/lib/supabase.server";
import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  await supabase.auth.signOut();
  return redirect(href("/auth/login"), { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await handleAuthAction(request);
}
