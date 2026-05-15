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
export function getReviewProfile<T extends { profiles?: ReviewProfile | null }>(
  review: T
): ReviewProfile | null {
  return review.profiles ?? null;
}
