import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';
import { GameInterface } from '../game/game.interface';

export type TSignup = {
  name: string;
  email: string;
  password: string;
};

export interface IUser {
  // id?: Types.ObjectId;
  name?: string;
  userName?: string;
  email: string;
  password: string;
  role: string;
  bio?: string;
  links?: string[];
  photo?: string;
  approvedUpdate: boolean;
  uploadedGame?: GameInterface[];
  upVotedGame: GameInterface[];
  isDeleted?: boolean;
}

export interface IUserUpdate {
  userId?: Types.ObjectId;
  name?: string;
  userName?: string;
  bio?: string;
  links?: string[];
  photo?: string;
  approvedUpdate?: boolean;
  isDeleted?: boolean;
}

export interface IPendingUserUpdate {
  userId: Types.ObjectId;
  name?: string;
  userName?: string;
  bio?: string;
  links?: string[];
  photo?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface IUserModel extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJWTIssuesBeforePasswordChange(
    passwordChangeTimestamp: Date,
    jwtIssuesTime: number,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
