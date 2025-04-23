import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

// First, define your interfaces clearly
export interface IUser {
  name: string;
  email?: string;
  password: string;
  role: string;
  photo?: string;
  isDeleted?: boolean;
}

// Define the static methods interface
export interface IUserModel extends Model<IUser> {
  isPasswordMatched(plainTextPassword: string, hashPassword: string): Promise<boolean>;
  isJWTIssuesBeforePasswordChange(passwordChangeTimestamp: Date, jwtIssuesTime: number): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
