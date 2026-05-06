import { createClient } from "~/lib/supabase.server";
import type { Category } from "~/types/category";
import { data } from "react-router";

export interface CategoryWithParent extends Category {
  parent: { name: string } | null;
}

export async function getCategories(request: Request) {
  const { supabase, headers } = createClient(request);
  
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      parent_id,
      created_at,
      parent:parent_id (
        name
      )
    `)
    .order("name")
    .returns<CategoryWithParent[]>();

  return { categories: categories || [], headers };
}

export async function performDeleteCategory(request: Request) {
  const { supabase, headers } = createClient(request);
  
  const formData = await request.formData();
  const id = formData.get("categoryId") || formData.get("id");

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return data({ success: false, error: "Non connecté" }, { status: 401, headers });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return data({ success: false, error: "Interdit" }, { status: 403, headers });
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  
  if (error) {
    return data({ success: false, error: error.message }, { status: 400, headers });
  }

  return data({ success: true }, { headers });
}
