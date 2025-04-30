import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import AdminServices from './admin.services';
import sendResponse from '../../utility/sendResponse';

const approveGameByAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.approveGame(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully approved game',
    data: result,
  });
});

const getPendingProfileUpdates: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.getPendingProfileUpdates();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Pending profile updates retrieved successfully',
    data: result,
  });
});

const approveProfileUpdateByAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.approveProfileUpdate(req.user!.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile update approved successfully',
    data: result,
  });
});

const rejectProfileUpdateByAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.rejectProfileUpdate(req.user!.id, req.body.updateId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile update rejected successfully',
    data: result,
  });
});

const getDashboardStats: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.getDashboardStats();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

const AdminController = {
  approveGameByAdmin,
  getPendingProfileUpdates,
  approveProfileUpdateByAdmin,
  rejectProfileUpdateByAdmin,
  getDashboardStats
};

export default AdminController;