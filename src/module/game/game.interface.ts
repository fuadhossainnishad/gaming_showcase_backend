import { Model, Types } from 'mongoose';

export interface CommentsInterface {
  userId: Types.ObjectId;
  comment: string;
}

export interface ShareInterface {
  userId: Types.ObjectId;
}

export interface GameInterface {
  userId: Types.ObjectId;
  game_title: string;
  category:
    | 'Action'
    | 'Adventure'
    | 'RPG'
    | 'Strategy'
    | 'Simulation'
    | 'Puzzle'
    | 'Sports'
    | 'Racing'
    | 'Shooter';
  description: string;
  price: number;
  steam_link: string;
  x_link: string;
  linkedin_link: string;
  reddit_link: string;
  instagram_link: string;
  media_files: string[];
  comments: CommentsInterface[];
  totalComments: number;
  shares: ShareInterface[];
  totalShare: number;
  isApproved: boolean;
  isDelete?: boolean;
}

export interface IPendingGameUpdate {
  gameId: import('mongoose').Types.ObjectId;
  userId: string;
  game_title?: string;
  category?: string;
  description?: string;
  price?: number;
  steam_link?: string;
  x_link?: string;
  linkedin_link?: string;
  reddit_link?: string;
  instagram_link?: string;
  media_files?: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface CreateGameModel extends Model<GameInterface> {
  // eslint-disable-next-line no-unused-vars
  isExistGame(id: string): Promise<GameInterface>;
}
