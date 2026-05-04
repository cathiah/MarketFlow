import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "~/types/profile";

/**
 * Vérifie si un utilisateur a le rôle admin
 */
export async function isAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}

/**
 * Récupère tous les utilisateurs pour l'administration
 */
export async function getAllUsers(supabase: SupabaseClient): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, username, full_name, email, avatar_url, shipping_address, billing_address, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Erreur lors de la récupération des utilisateurs");
  return (data as Profile[]) ?? [];
}