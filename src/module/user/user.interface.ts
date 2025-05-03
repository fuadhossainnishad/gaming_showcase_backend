import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser {
  id?: string;
  name?: string;
  email: string;
  password: string;
  role: string;
  bio?: string;
  links?: string[];
  photo?: string;
  approvedUpdate: boolean;
  uploadedGame?: string[];
  isDeleted?: boolean;
}

export interface IUserUpdate {
  id?: string;
  name?: string;
  email?: string;
  bio?: string;
  links?: string[];
  photo?: string;
  approvedUpdate?: boolean;
  uploadedGame?: string[];
  isDeleted?: boolean;
}

export interface IPendingUserUpdate {
  id: string;
  name?: string;
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
