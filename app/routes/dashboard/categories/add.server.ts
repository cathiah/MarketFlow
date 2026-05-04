import { createClient } from "~/lib/supabase.server";
import { data, href, redirect } from "react-router";

export async function performAddCategory(request: Request) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") {
    return data(
      { success: false, errors: { form: "Interdit : Accès admin requis" } }, 
      { status: 403, headers }
    );
  }

  const { error } = await supabase.from("categories").insert({
    name: String(formData.get("name")),
    slug: String(formData.get("slug")),
    parent_id: formData.get("parent_id") || null,
  });

  if (error) {
    return data(
      { success: false, errors: { form: "Cette catégorie existe déjà ou est invalide." } }, 
      { status: 400, headers }
    );
  }
  
  return redirect(href("/dashboard/categories"), { headers });
}
