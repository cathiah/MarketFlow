export async function updateProductWithImages(supabase: any, productId: string, productData: any, imageUrls: string[]) {
  if (imageUrls.length === 0) throw new Error("Au moins une image est requise");

  const { data: updated, error: pError } = await supabase
    .from("products")
    .update({
      ...productData,
      main_image_url: imageUrls[0],
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (pError) throw pError;

  await supabase.from("product_images").delete().eq("product_id", productId);

  const secondary = imageUrls.slice(1);
  if (secondary.length > 0) {
    const imagesToInsert = secondary.map((url, i) => ({
      product_id: productId,
      url,
      display_order: i + 1
    }));
    const { error: imgErr } = await supabase.from("product_images").insert(imagesToInsert);
    if (imgErr) throw imgErr;
  }
  
  return updated;
}
