import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import GameServices from './game.services';
import httpStatus from 'http-status';
import sendResponse from '../../utility/sendRespone';

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
  const result = await GameServices.getAllGameIntoDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved all games',
    data: result,
  });
});

const GameController = {
  createNewGame,
  getAllGame,
};

export default GameController;
