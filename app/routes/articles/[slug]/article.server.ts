import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Product } from "~/types/products";

export async function getArticleBySlug(request: Request, slug: string | undefined) {
  const { supabase, headers } = createClient(request);

  try {
    if (!slug) throw new Error("Missing slug");

    const { data: product, error } = await supabase
      .from("products")
      .select("*, categories(id, name), product_images(id, url)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;

    if (!product) {
      throw new Response("Article introuvable", { status: 404, headers });
    }

    return data({ product: product as Product }, { headers });

  } catch (error: any) {
    console.error("DEBUG ARTICLE ERROR:", error);
    
    if (error instanceof Response) throw error;

    throw new Response("Le serveur de base de données ne répond pas. Réessayez dans un instant.", { 
      status: 503, 
      headers 
    });
  }
}
