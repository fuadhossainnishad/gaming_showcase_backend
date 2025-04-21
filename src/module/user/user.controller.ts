import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import UserServices from './user.services';
import sendRespone from '../../utility/sendRespone';
import httpStatus from 'http-status';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDb(req.body);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully create user',
    data: result,
  });
});


const  findAllUser:RequestHandler=catchAsync(async(req , res)=>{

  const result=await UserServices.findAllUserIntoDb(req.query);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfully find all user',
    data: result,
  });

});

const UserController = {
  createUser,

  findAllUser
};

export default UserController;
