export function getPublicUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}