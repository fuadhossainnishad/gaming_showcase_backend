import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import AdminServices from './admin.services';
import sendResponse from '../../utility/sendRespone';

const approveGameByAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.approveGame(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully approved game',
    data: result,
  });
});

const AdminController = {
  approveGameByAdmin,
};

export default AdminController;