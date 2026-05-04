import { data, redirect, href } from "react-router";
import { createClient, createAdminClient } from "~/lib/supabase.server";
import { isAdmin, getAllUsers } from "~/services/users.server";

export async function performGetUsers(request: Request) {
  const { supabase, headers } = createClient(request);

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return redirect(href("/auth/login"), { headers });
  }

  const adminCheck = await isAdmin(supabase, user.id);
  if (!adminCheck) {
    return redirect(href("/"), { headers });
  }

  const users = await getAllUsers(supabase);

  return data({ users }, { headers });
}

export async function performDeleteUser(request: Request) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    throw data({ error: "Non authentifié" }, { status: 401, headers });
  }

  const adminCheck = await isAdmin(supabase, authUser.id);
  if (!adminCheck) {
    throw data({ error: "Interdit" }, { status: 403, headers });
  }

  const supabaseAdmin = createAdminClient();

  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("buyer_id", userId);

  if (orderError) {
    throw data({ error: "Erreur lors du nettoyage des commandes" }, { status: 500, headers });
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (deleteError) {
    throw data({ error: deleteError.message }, { status: 500, headers });
  }

  return data({ success: true }, { headers });
}
