import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import User from '../user/user.model';
import { TAuth, TUpdateUserPassword, TVerifyForgotPassword } from './auth.constant';
import config from '../../app/config';
import { jwtHelpers } from '../../app/jwtHalpers/jwtHalpers';
import ForgotPassword from './auth.model';
import bcrypt from 'bcrypt'

const loginUserIntoDb = async (payload: TAuth) => {
  const isUserExist = await User.findOne(
    { email: payload.email },
    { password: 1, _id: 1, email: 1, role: 1 },
  );

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    isUserExist.password,
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'This Password Not Matched', '');
  }

  const jwtPayload = {
    id: isUserExist.id,
    role: isUserExist.role,
    email: isUserExist.email,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const requestForgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await ForgotPassword.deleteMany({ email });

  await ForgotPassword.create({
    email,
    otp,
    expiresAt,
  });
};

const verifyForgotPassword = async (payload: TVerifyForgotPassword) => {
  const resetRecord = await ForgotPassword.findOne({
    email: payload.email,
    otp: payload.otp,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP', '');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const updatedUser = await User.findOneAndUpdate(
    { email: payload.email },
    { password: hashedPassword },
    { new: true },
  ).select('-password');

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to reset password', '');
  }

  await ForgotPassword.deleteOne({ _id: resetRecord._id });

  return updatedUser;
};

const updateUserPassword = async (payload: TUpdateUserPassword) => {
  const user = await User.findOne(
    { userId: payload.userId, isDeleted: { $ne: true } },
    { password: 1, email: 1 },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Current password is incorrect', '');
  }

  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const updatedUser = await User.findOneAndUpdate(
    { userId: payload.userId, isDeleted: { $ne: true } },
    { password: hashedNewPassword },
    { new: true },
  ).select('-password');

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to update password', '');
  }

  return updatedUser;
};

const AuthServices = {
  loginUserIntoDb,
  requestForgotPassword,
  verifyForgotPassword,
  updateUserPassword
};

export default AuthServices;