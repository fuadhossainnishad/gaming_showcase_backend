import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import UserServices from './user.services';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully create user',
    data: result,
  });
});

const findAllUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.findAllUserIntoDb(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfully find all user',
    data: result,
  });
});

const updateProfileUser: RequestHandler = catchAsync(async (req, res) => {
  const photoPath = req.file ? req.file.path : undefined;
  const result = await UserServices.updateUserProfileIntoDb({
    ...req.body,
    photo: photoPath,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfully updated user profile',
    data: result,
  });
});

const submitProfileUpdate: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.submitProfileUpdate(
    req.body.userId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile update submitted for approval',
    data: result,
  });
});

const UserController = {
  createUser,
  findAllUser,
  updateProfileUser,
  submitProfileUpdate,
};

export default UserController;
