import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import User from "../user/user.model";
import { TAuth } from "./auth.constant";
import config from "../../app/config";
import { jwtHelpers } from "../../app/jwtHalpers/jwtHalpers";

const loginUserIntoDb = async (payload: TAuth) => {
  const isUserExist = await User.findOne(
    { email: payload.email },
    { password: 1, _id: 1, email: 1, role: 1 }
  );

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    isUserExist.password
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
    config.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const AuthServices = {
  loginUserIntoDb,
};

export default AuthServices;
