import { createClient } from "~/lib/supabase.server";
import { data, redirect, href } from "react-router";

export async function performUpdateProfile(request: Request) {
  const { supabase, headers } = createClient(request as any);
  const formData = await request.formData();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect(href("/auth/login"), { headers });

 const updates = {
  full_name: formData.get("full_name") as string,
  shipping_address: formData.get("shipping_address") as string,
  billing_address: formData.get("billing_address") as string,
  updated_at: new Date().toISOString(),
};

  let avatar_url = formData.get("current_avatar_url") as string;
  const avatarFile = formData.get("avatar") as File;

  if (avatarFile && (avatarFile as File).size > 0) {
    const fileExt = (avatarFile as File).name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile as File, { upsert: true });
    if (!uploadError) avatar_url = fileName;
  }

  const { error } = await supabase.from("profiles").update({ ...updates, avatar_url }).eq("id", user.id);
  if (error) return data({ error: "Erreur lors de la mise à jour" }, { status: 400, headers });

  return redirect(href("/profile"), { headers });
}
