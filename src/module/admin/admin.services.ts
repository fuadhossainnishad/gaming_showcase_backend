import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import games from '../game/game.model';
import { approveGameType } from './admin.types';

const approveGame = async (payload: approveGameType) => {
  const { id } = payload;

  // Validate game existence
  const game = await games.findById(id).where({ isDelete: { $ne: true } });

  if (!game) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Game not found or is deleted',
      '',
    );
  }

  const updatedGame = await games
    .findByIdAndUpdate(
      id,
      { $set: { isApproved: true } },
      { new: true, runValidators: true },
    )
    .where({ isDelete: { $ne: true } });

  if (!updatedGame) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to update game', '');
  }

  return updatedGame;
};

const AdminServices = {
  approveGame,
};

export default AdminServices;
