import { Request } from 'express';
import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import games from './game.model';

// Create a type for your request with files
interface RequestWithFiles extends Request {
  files: Express.Multer.File[];
}

const createNewGameIntoDb = async (req: RequestWithFiles, userId: string) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, 'file is not uploaded', '');
    }

    if (!req.body) {
      throw new AppError(httpStatus.NOT_FOUND, 'body data is not uploaded', '');
    }

    const media_files = req.files.map((file) => file.path);
    const data = req.body;

    const gameBuilder = new games({ ...data, media_files, userId });
    const result = await gameBuilder.save();
    return result && { status: true, message: ' succesasfuyllyu uplode files' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      'create new game server is unavailable',
      '',
    );
  }
};

const GameServices = {
  createNewGameIntoDb,
};

export default GameServices;
