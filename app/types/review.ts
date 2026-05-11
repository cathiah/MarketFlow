export interface ReviewProfile {
  username: string | null;
  avatar_url: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: ReviewProfile | null;
}

export function getReviewProfile(review: Review): ReviewProfile | null {
  return review.profiles;
}