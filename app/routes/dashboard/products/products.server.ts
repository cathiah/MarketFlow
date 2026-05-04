import { createClient } from "~/lib/supabase.server";
import { data, href, redirect } from "react-router";
import type { Product } from "~/types/products";

export async function getSellerProducts(request: Request) {
  const { supabase, headers } = createClient(request);
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { products: [], headers };
  }

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw data("Erreur de chargement des produits", { status: 500, headers });
  }

  return { 
    products: (products as unknown as Product[]) || [], 
    headers 
  };
}


export async function performDeleteProduct(request: Request) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  const productId = formData.get("productId");

  if (!productId || typeof productId !== "string") {
    return data({ success: false, errors: { form: "ID du produit manquant" } }, { status: 400, headers });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect(href("/auth/login"), { headers });

  try {
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("seller_id, main_image_url, product_images(url)")
      .eq("id", productId)
      .single();

    if (fetchError || !product) throw new Error("Produit introuvable");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isOwner = product.seller_id === user.id;
    const isAdmin = profile?.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("Droit de suppression refusé");
    }

    const extractStoragePath = (url: string) => {
      const parts = url.split("/products/");
      return parts.length > 1 ? parts[1].split("?")[0] : null;
    };

    const filesToDelete: string[] = [];
    if (product.main_image_url) {
      const path = extractStoragePath(product.main_image_url);
      if (path) filesToDelete.push(path);
    }
    product.product_images?.forEach((img: { url: string }) => {
      const path = extractStoragePath(img.url);
      if (path) filesToDelete.push(path);
    });

    if (filesToDelete.length > 0) {
      await supabase.storage.from("products").remove(filesToDelete);
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) throw deleteError;

    return data({ success: true }, { headers });
  } catch (error: any) {
    return data({ success: false, errors: { server: error.message } }, { status: 500, headers });
  }
}
