import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../app/error/AppError';
import catchAsync from '../utility/catchAsync';
import config from '../app/config';
import User from '../module/user/user.model';
import { USER_ROLE, UserRole } from '../module/user/user.constant';
import { UserPayload } from '../types/express';
import RefreshToken from '../module/auth/refreshToken.model';
import { v4 as uuidv4 } from 'uuid';

// Interface for session tracking
interface SessionPayload {
  sessionId: string;
}

// Extend UserPayload to include sessionId
interface ExtendedUserPayload extends UserPayload, SessionPayload {
  id: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

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

    let decoded: ExtendedUserPayload;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as ExtendedUserPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token', '');
    }

    const { id, role, sessionId, email } = decoded;

    // Validate role
    if (requireRoles.length && !requireRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Access denied', '');
    }

    // Check if user exists
    const user = await User.findOne({ userId: id, isDeleted: { $ne: true } }, { userId: 1, role: 1 });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
    }

    // Verify session (prevent frequent logins or token reuse)
    const activeSession = await RefreshToken.findOne({
      userId: id,
      sessionId,
      expiresAt: { $gt: new Date() },
    });
    if (!activeSession) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Session invalid or expired', '');
    }

    // Attach user payload to request
    req.user = { id, role, email };
    next();
  });
};

const generateTokens = async (
  user: { userId: string; role: UserRole; email: string },
  rememberMe: boolean,
): Promise<{ accessToken: string; refreshToken?: string; sessionId: string }> => {
  const sessionId = uuidv4(); 

  const accessToken = jwt.sign(
    { id: user.userId, role: user.role, email: user.email, sessionId },
    config.jwt_access_secret as string,
    { expiresIn: config.expires_in as string }, 
  );

  const response: { accessToken: string; refreshToken?: string; sessionId: string } = {
    accessToken,
    sessionId,
  };

  if (rememberMe) {
    const refreshToken = jwt.sign(
      { id: user.userId, role: user.role, email: user.email, sessionId },
      config.jwt_refresh_secret as string,
      { expiresIn: config.refresh_expires_in as string }, 
    );

    await RefreshToken.create({
      userId: user.userId,
      token: refreshToken,
      sessionId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    });

    response.refreshToken = refreshToken;
  }

  return response;
};

export default auth;
export { generateTokens };