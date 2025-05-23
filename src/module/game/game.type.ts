export type CommentPayload = {
  gameId: string;
  comment: string;
};

export type CommentUpvotePayload = {
  gameId: string;
  commentId: string;
};

export type GameUpvotePayload = {
  gameId: string;
};

export type SharePayload = {
  gameId: string;
};

export type TopGameQuery = {
  limit?: number;
};

export type TGameUpdate = {
  data: {
    gameId: string;
    title?: string;
    subTitle?: string;
    description?: string;
    categories?: string[];
    platform?: string[];
    price?: number;
    socialLinks?: { name: string; link: string }[];
    gameStatus?: 'active' | 'upcoming';
    upcomingDate?: Date;
  };
  image?: {
    images?: string[];
    thumbnail?: string;
  };
};
