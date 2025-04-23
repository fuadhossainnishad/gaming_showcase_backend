import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser {
  userId?: string;
  name?: string;
  email: string;
  password: string;
  role: string;
  bio?: string;
  links?: string[];
  photo?: string;
  uploadedGame?: string[];
  isDeleted?: boolean;
}

// Define the static methods interface
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
