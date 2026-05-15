/**
 * types/reviews.ts
 *
 * Source unique de vérité pour les types Review.
 * Aligne dashboard et article sur le vrai schéma profiles :
 *   profiles.username    (affiché comme nom)
 *   profiles.avatar_url  (avatar)
 *
 * Supabase retourne les joins FK comme des tableaux même en relation 1-1,
 * donc RawReview.profiles est un tableau — normalisé via normalizeReview().
 */

export interface ReviewProfile {
  username: string | null;
  avatar_url: string | null;
}

/** Forme normalisée utilisée dans tous les composants */
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: ReviewProfile | null;
}

/** Forme brute retournée par Supabase (join FK = tableau) */
export interface RawReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: ReviewProfile[] | null;
}

/** Aplatit profiles[0] en objet unique */
export function normalizeReview(raw: RawReview): Review {
  return {
    ...raw,
    profiles: Array.isArray(raw.profiles)
      ? (raw.profiles[0] ?? null)
      : (raw.profiles ?? null),
  };
}

/** Helper pour lire le profil d'un review en toute sécurité */
export function getReviewProfile(review: Review): ReviewProfile | null {
  return review.profiles ?? null;
}
