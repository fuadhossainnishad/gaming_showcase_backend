import { Request, Response, NextFunction } from 'express';
import { File } from 'multer';
import { JwtPayload } from 'jsonwebtoken';
import { AdminRole, UserRole } from '../module/user/user.constant';

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

export interface RequestWithFiles extends Request {
  user?: AuthPayload;
  files?: { [fieldname: string]: File[] } | File[] | undefined;
}

export type RequestHandlerWithFiles = (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
