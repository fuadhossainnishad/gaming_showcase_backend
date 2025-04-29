import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import GameServices from './game.services';
import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';

const createNewGame: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.createNewGameIntoDb(
    req as any,
    req.user.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully created game',
    data: result,
  });
});

const getAllGame: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.getAllGameIntoDb(req.query, req.user.role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved all games',
    data: result,
  });
});

const addComment: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.userComment(req.body, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully added comment',
    data: result,
  });
});

const addShare: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.userShare(req.body, req.user.id);

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
    req.user.id,
    req.body,
    req.files,
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
