import { createClient } from "~/lib/supabase.server";
import { data, href, redirect } from "react-router";

export async function performEditCategory(request: Request, slug: string) {
  const { supabase, headers } = createClient(request as any);
  const formData = await request.formData();

  const { error } = await supabase
    .from("categories")
    .update({
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      parent_id: formData.get("parent_id") || null,
    })
    .eq("slug", slug);

  if (error) {
    return data({ success: false, errors: { form: error.message } }, { status: 400, headers });
  }

  return redirect(href("/dashboard/categories"), { headers });
}
