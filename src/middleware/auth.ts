import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../app/error/AppError';
import catchAsync from '../utility/catchAsync';
import config from '../app/config';
import users from '../module/user/user.model';
import { USER_ROLE, UserRole, AdminRole } from '../module/user/user.constant';
import { UserPayload, AdminPayload, AuthPayload } from '../types/express';

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

    if (token === config.admin_jwt_access_secret) {
      const adminRole = USER_ROLE.ADMIN;

      if (requireRoles.length && !requireRoles.includes(adminRole)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied for admin', '');
      }

      const adminPayload: AdminPayload = {
        id: 'Admin',
        role: adminRole,
      };

      req.user = adminPayload;
      return next();
    }

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
    console.log(decoded);

    const isUserExist = await users.findOne({ userId: id }, { userId: 1 });
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
