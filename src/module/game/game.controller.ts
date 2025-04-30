import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import GameServices from './game.services';
import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';
import AppError from '../../app/error/AppError';
import { RequestWithFiles } from '../../types/express';

const createNewGame: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
  }
  const files = Array.isArray(req.files)
    ? req.files
    : req.files
    ? Object.values(req.files).flat()
    : undefined;
  const result = await GameServices.createNewGameIntoDb(
    { ...req, files } as RequestWithFiles, 
    req.user.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully created game',
    data: result,
  });
});

const getAllGame: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
  }
  const result = await GameServices.getAllGameIntoDb(req.query, req.user.role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved all games',
    data: result,
  });
});

const addComment: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.userComment(req.body, req.user?._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully added comment',
    data: result,
  });
});

const addShare: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.userShare(req.body, req.user?._id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully shared game',
    data: result,
  });
});

const getTopGameOfDay: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.getTopGameOfDay(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved top games of the day',
    data: result,
  });
});

const getTopGameOfWeek: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.getTopGameOfWeek(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved top games of the week',
    data: result,
  });
});

const updateGame: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.updateGameIntoDb(
    req.user!.id,
    req.body,
    Array.isArray(req.files)
      ? req.files
      : req.files
        ? Object.values(req.files).flat()
        : undefined,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Game update submitted for approval',
    data: result,
  });
});

const GameController = {
  createNewGame,
  getAllGame,
  addComment,
  addShare,
  getTopGameOfDay,
  getTopGameOfWeek,
  updateGame,
};

export default GameController;
