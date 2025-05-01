export type CommentPayload = {
  gameId: string;
  comment: string;
};

export type SharePayload = {
  gameId: string;
};

export type TopGameQuery = {
  limit?: number;
};

export type TGameUpdate = {
  gameId: string;
  game_title?: string;
  category?: string;
  description?: string;
  price?: string;
  steam_link?: string;
  x_link?: string;
  linkedin_link?: string;
  reddit_link?: string;
  instagram_link?: string;
  media_files?: string[];
};