import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import AuthServices from './auth.services';
import sendRespone from '../../utility/sendResponse';
import httpStatus from 'http-status';
import config from '../../app/config';

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDb(req.body);

  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully Login',
    data: {
      accessToken,
    },
  });
});

const AuthController = {
  loginUser,
};

export default AuthController;
