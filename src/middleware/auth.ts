import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../app/error/AppError';
import catchAsync from '../utility/catchAsync';
import config from '../app/config';
import users from '../module/user/user.model';
import Admin from '../module/admin/admin.model';
import { USER_ROLE, UserRole } from '../module/user/user.constant';
import { UserPayload } from '../types/express';
import User from '../module/user/user.model';

const auth = (...requireRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    console.log('Required Roles:', requireRoles);

    if (!authHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided', '');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    let decoded: UserPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as UserPayload;
    } catch {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Invalid or expired token',
        '',
      );
    }

    const { role, id } = decoded;

    if (requireRoles.length && !requireRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Access denied', '');
    }
    console.log('Decoded Token:', decoded);

    let isUserExist = await User.findOne({ _id: id }, { _id: 1 });
    if (!isUserExist && role === USER_ROLE.ADMIN) {
      isUserExist = await Admin.findOne({ _id: id }, { _id: 1 });
    }

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'User or Admin not found', '');
    }

    req.user = decoded;
    next();
  });
};

export default auth;