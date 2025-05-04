import { Model, Types } from 'mongoose';

export interface CommentsInterface {
  userId: Types.ObjectId;
  comment: string;
}

export interface ShareInterface {
  userId: Types.ObjectId;
}

export interface SocialLinksInterface {
  name: string;
  link: string;
}

export interface GameInterface {
  id: string;
  userId: string;
  author: string;
  title: string;
  subTitle?: string;
  description: string;
  image: string[];
  thumbnail?: string;
  categories: string[];
  platform: string[];
  price: number;
  socialLinks: SocialLinksInterface[];
  gameStatus: 'active' | 'upcoming';
  upcomingDate: Date;
  comments: CommentsInterface[];
  totalComments: number;
  shares: ShareInterface[];
  totalShare: number;
  isApproved: boolean;
  isDelete?: boolean;
}

export interface IPendingGameUpdate {
  gameId: string;
  userId: string;
  title?: string;
  subTitle?: string;
  description?: string;
  image?: string[];
  thumbnail?: string;
  categories?: string[];
  platform?: string[];
  price?: number;
  socialLinks?: SocialLinksInterface[];
  gameStatus: 'active' | 'upcoming';
  upcomingDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

// export interface GameInterface {
//   id: string
//   userId: string;
//   author: string;
//   title: string;
//   subTitle?: string;
//   category:
//   | 'Action'
//   | 'Adventure'
//   | 'RPG'
//   | 'Strategy'
//   | 'Simulation'
//   | 'Puzzle'
//   | 'Sports'
//   | 'Racing'
//   | 'Shooter';
//   description: string;
//   price: string;
//   steam_link: string;
//   x_link: string;
//   linkedin_link: string;
//   reddit_link: string;
//   instagram_link: string;
//   media_files: string[];
//   comments: CommentsInterface[];
//   totalComments: number;
//   shares: ShareInterface[];
//   totalShare: number;
//   isApproved: boolean;
//   isDelete?: boolean;
// }

// export interface IPendingGameUpdate {
//   gameId: string;
//   userId: string;
//   game_title?: string;
//   category?: string;
//   description?: string;
//   price?: string;
//   steam_link?: string;
//   x_link?: string;
//   linkedin_link?: string;
//   reddit_link?: string;
//   instagram_link?: string;
//   media_files?: string[];
//   status: 'pending' | 'approved' | 'rejected';
//   submittedAt: Date;
//   reviewedBy?: string;
//   reviewedAt?: Date;
// }

export interface CreateGameModel extends Model<GameInterface> {
  isExistGame(id: string): Promise<GameInterface>;
}
