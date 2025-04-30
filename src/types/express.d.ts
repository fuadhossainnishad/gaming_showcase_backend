import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../module/user/user.constant';
import { Request } from 'express';
import { File } from 'multer';

export interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface RequestWithFiles extends Request {
  files?: Express.Multer.File[];
}