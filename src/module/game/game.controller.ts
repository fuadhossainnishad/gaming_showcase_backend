import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import GameServices from './game.services';
import sendRespone from '../../utility/sendRespone';
import httpStatus from 'http-status';

const createNewGame: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameServices.createNewGameIntoDb(
    req as any,
    req.user.id,
  );

  sendRespone(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully created game',
    data: result,
  });
});

const GameController = {
  createNewGame,
};

export default GameController;

const getAllGame: RequestHandler = catchAsync(async (req, res) => {
  const result = await GameController.getAllGame();
});
