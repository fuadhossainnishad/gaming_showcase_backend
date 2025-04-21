import { Types } from 'mongoose';

export type TUserSignUp = {
  name: string;
  email?: string;
  password: string;
};

export type TUserSignIn = {
  email?: string;
  password: string;
};
