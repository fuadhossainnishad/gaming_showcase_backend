import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import games from '../game/game.model';
import { approveGameType, TApproveProfileUpdate } from './admin.types';
import PendingUserUpdate from '../user/userUpdateProfile';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';

const approveGame = async (payload: approveGameType) => {
  const { id } = payload;

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

const getPendingProfileUpdates = async () => {
  const updates = await PendingUserUpdate.find({ status: 'pending' }).populate(
    'userId',
    'email name',
  );
  return updates;
};

const approveProfileUpdate = async (
  adminId: string,
  payload: TApproveProfileUpdate,
) => {
  const pendingUpdate = await PendingUserUpdate.findById(payload.updateId);
  if (!pendingUpdate) {
    throw new AppError(httpStatus.NOT_FOUND, 'Pending update not found', '');
  }

  if (pendingUpdate.status !== 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Update is not in pending status',
      '',
    );
  }

  const user = await User.findOne({
    userId: pendingUpdate.userId,
    isDeleted: { $ne: true },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const updateFields: Partial<IUser> = {
    approvedUpdate: true,
  };
  if (pendingUpdate.name) updateFields.name = pendingUpdate.name;
  if (pendingUpdate.bio !== undefined) updateFields.bio = pendingUpdate.bio;
  if (pendingUpdate.links) updateFields.links = pendingUpdate.links;
  if (pendingUpdate.photo !== undefined)
    updateFields.photo = pendingUpdate.photo;

  const updatedUser = await User.findOneAndUpdate(
    { userId: pendingUpdate.userId, isDeleted: { $ne: true } },
    updateFields,
    { new: true },
  ).select('-password');

  if (!updatedUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Failed to apply profile update',
      '',
    );
  }

  await PendingUserUpdate.findByIdAndUpdate(payload.updateId, {
    status: 'approved',
    reviewedBy: adminId,
    reviewedAt: new Date(),
  });

  return updatedUser;
};

const rejectProfileUpdate = async (adminId: string, updateId: string) => {
  const pendingUpdate = await PendingUserUpdate.findById(updateId);
  if (!pendingUpdate) {
    throw new AppError(httpStatus.NOT_FOUND, 'Pending update not found', '');
  }

  if (pendingUpdate.status !== 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Update is not in pending status',
      '',
    );
  }

  await PendingUserUpdate.findByIdAndUpdate(updateId, {
    status: 'rejected',
    reviewedBy: adminId,
    reviewedAt: new Date(),
  });

  return { message: 'Profile update rejected successfully' };
};

const AdminServices = {
  approveGame,
  getPendingProfileUpdates,
  approveProfileUpdate,
  rejectProfileUpdate,
};

export default AdminServices;
