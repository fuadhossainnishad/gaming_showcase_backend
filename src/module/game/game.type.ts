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
