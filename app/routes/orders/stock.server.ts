import { createClient } from "~/lib/supabase.server";

type SupabaseClient = ReturnType<typeof createClient>["supabase"];

export async function restoreStock(
  supabase: SupabaseClient,
  orderItems: { product_id: string; quantity: number }[]
) {
  for (const item of orderItems) {
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (product) {
      await supabase
        .from("products")
        .update({ stock_quantity: product.stock_quantity + item.quantity })
        .eq("id", item.product_id);
    }
  }
}

export async function decrementStock(
  supabase: SupabaseClient,
  orderItems: { product_id: string; quantity: number }[]
) {
  for (const item of orderItems) {
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (!product || product.stock_quantity < item.quantity)
      throw new Response("Stock insuffisant pour un article", { status: 400 });

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_quantity: product.stock_quantity - item.quantity })
      .eq("id", item.product_id);

    if (updateError)
      throw new Response("Erreur lors de la mise à jour du stock", {
        status: 500,
      });
  }
}
