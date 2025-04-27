import { IUser } from './user.interface';

export const USER_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type updateUserProfileType = Partial<
  Pick<IUser, 'name' | 'userId' | 'bio' | 'links' | 'photo' | 'password'>
>;

export type UserRole = keyof typeof USER_ROLE