import { JwtPayload } from 'jsonwebtoken';
import { AdminRole, UserRole } from '../module/user/user.constant';
import { Request } from 'express';
import { File } from 'multer';

export interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AdminPayload extends JwtPayload {
  id: 'Admin';
  role: AdminRole;
}

export type AuthPayload = UserPayload | AdminPayload;

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export interface RequestWithFiles extends Request {
  files?: Express.Multer.File[];
}