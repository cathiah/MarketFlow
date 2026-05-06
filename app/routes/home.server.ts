import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Product } from "~/types/products";

export async function performGetProducts(request: Request) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_published", true);

  if (user) {
    query = query.neq("seller_id", user.id);
  }

  const { data: products, error } = await query
    .order("created_at", { ascending: false })
    .returns<Product[]>();

  if (error) {
    throw new Response("Erreur lors de la récupération des produits", {
      status: 500,
      headers,
    });
  }

  return data({ products: products ?? [], userId: user?.id ?? null }, { headers });
}


export async function performCreateOrder(request: Request) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();

  const productId = formData.get("productId") as string;
  const price = formData.get("price") as string;
  const quantityRaw = formData.get("quantity") as string;
  const quantity = parseInt(quantityRaw, 10);

  if (!productId || !price || isNaN(quantity) || quantity < 1) {
    return data(
      { success: false, message: "Données de commande invalides." },
      { headers }
    );
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    return data(
      { success: false, message: "Prix invalide." },
      { headers }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return data(
      { success: false, message: "Vous devez être connecté pour passer une commande." },
      { headers }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return data(
      { success: false, message: "Votre profil n'est pas complet. Veuillez vous reconnecter." },
      { headers }
    );
  }

  const { data: product, error: stockError } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", productId)
    .single();

  if (stockError || !product) {
    return data({ success: false, message: "Produit introuvable." }, { headers });
  }

  if (product.stock_quantity < quantity) {
    return data(
      {
        success: false,
        message: `Stock insuffisant. Il ne reste que ${product.stock_quantity} article(s) disponible(s).`,
      },
      { headers }
    );
  }

  const totalAmount = priceNum * quantity;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ buyer_id: user.id, total_amount: totalAmount, status: "pending" })
    .select()
    .single();

  if (orderError) {
    console.error("Erreur lors de la création de la commande:", orderError);
    return data(
      { success: false, message: "Impossible de créer la commande. Veuillez réessayer." },
      { headers }
    );
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: productId,
    quantity,
    unit_price: priceNum,
  });

  if (itemError) {
    console.error("Erreur lors de l'enregistrement des articles:", itemError);
    return data(
      { success: false, message: "Erreur lors de l'enregistrement des articles." },
      { headers }
    );
  }

  return data(
    { success: true, message: "Votre commande a bien été enregistrée !" },
    { headers }
  );
}