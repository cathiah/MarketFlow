import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Product } from "~/types/products";

export async function getProductBySlug(request: Request, slug: string) {
  const { supabase, headers } = createClient(request);

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (id, name),
      product_images (id, url)
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) {
    throw data("Produit non trouvé", { status: 404, headers });
  }

  return data({ product: product as unknown as Product }, { headers });
}
