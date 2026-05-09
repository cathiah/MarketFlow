/**
 * Transforme une chaîne de caractères en un slug URL-friendly.
 * Exemple: "Mon bel article @ 2026!" -> "mon-bel-article-2026"
 */
export const slugify = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
