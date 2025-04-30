// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../app/error/AppError';
import catchAsync from '../utility/catchAsync';
import config from '../app/config';
import users from '../module/user/user.model';
import { UserRole } from '../module/user/user.constant'; // Use UserRole
import { UserPayload } from '../types/express';

const auth = (...requireRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided', '');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token format', '');
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as UserPayload; 
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token', '');
    }

    const { role, id, email } = decoded;

    const isUserExist = await users.findOne({ _id: id }, { _id: 1 });
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'This User is Not Founded', '');
    }
    if (requireRoles && !requireRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Your Role Not Exist', '');
    }
    req.user = decoded;

    next();
  });
};

export default auth;