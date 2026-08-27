export interface ReviewUser {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Review {
  id: number;
  user: ReviewUser;
  venue_type: string | null;
  member_reservation: number | null;
  non_member_reservation: number | null;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  user_vote: 1 | -1 | null; // 1 for upvote, -1 for downvote, null for no vote
}

export interface ReviewPayload {
  venue_type?: string | null;
  member_reservation?: number | null;
  non_member_reservation?: number | null;
  rating: number;
  comment?: string;
}

export interface VotePayload {
  vote: 1 | -1;
}
