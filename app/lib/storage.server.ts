export async function uploadProductImages(supabase: any, files: File[]) {
  const urls: string[] = [];
  
  for (const file of files.filter(f => f.size > 0)) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("products").upload(fileName, file);
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(data.path);
    urls.push(publicUrl);
  }
  
  return urls;
}
