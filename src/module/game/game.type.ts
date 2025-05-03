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
  data: {
    userId: string;
    gameId: string;
    title?: string;
    subTitle?: string;
    description?: string;
    categories?: string[];
    platform?: string[];
    price?: number;
    socialLinks?: { name: string; link: string }[];
  };
  image?: {
    images?: string[];
    thumbnail?: string;
  };
};