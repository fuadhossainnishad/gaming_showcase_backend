import { Model, Types } from 'mongoose';

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
  steam_link: string;
  x_link: string;
  linkedin_link: string;
  reddit_link: string;
  instagram_link: string;
  media_files: string[];
  isApproved: boolean;
  isDelete?: boolean;
}

export interface CreateGameModel extends Model<GameInterface> {
  // eslint-disable-next-line no-unused-vars
  isExistGame(id: string): Promise<GameInterface>;
}
