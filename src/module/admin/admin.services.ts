import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import games from '../game/game.model';
import {
  approveGameType,
  TApproveGameUpdate,
  TApproveProfileUpdate,
} from './admin.types';
import PendingUserUpdate from '../user/userUpdateProfile';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import PendingGameUpdate from '../game/gameUpdate.model';
import { IPendingGameUpdate } from '../game/game.interface';
import { USER_ROLE } from '../user/user.constant';
import { TAuth } from '../auth/auth.constant';
import { jwtHelpers } from '../../app/jwtHalpers/jwtHalpers';
import config from '../../app/config';
import Admin from './admin.model';

const createAdminIntoDb = async (payload: IUser) => {
  try {
    console.log(payload);
    const { name, email, password } = payload;
    const role = USER_ROLE.ADMIN;
    const isExist = await Admin.findOne({
      email,
      role,
      isDeleted: { $ne: true },
    });
    if (isExist) {
      throw new AppError(httpStatus.FORBIDDEN, 'Admin already exist', '');
    }
    const createAdminBuilder = new Admin(payload);
    console.log(createAdminBuilder);
    const result = await createAdminBuilder.save();
    return result && { status: true, message: 'successfully create new admin' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      ' createUserIntoDb server unavailable',
      error.message,
    );
  }
};

const loginAdminIntoDb = async (payload: TAuth) => {
  const isAdminExist = await Admin.findOne(
    { email: payload.email },
    { password: 1, _id: 1, email: 1, role: 1 },
  );

  if (!isAdminExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found', '');
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    isAdminExist.password,
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'This Password Not Matched', '');
  }

  const jwtPayload = {
    id: isAdminExist.id,
    role: isAdminExist.role,
    email: isAdminExist.email,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.admin_jwt_access_secret as string,
    config.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const approveGame = async (payload: approveGameType) => {
  const { gameId } = payload;

  const game = await games.findById(gameId).where({ isDelete: { $ne: true } });

  if (!game) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Game not found or is deleted',
      '',
    );
  }

  const updatedGame = await games
    .findByIdAndUpdate(
      gameId,
      { $set: { isApproved: true } },
      { new: true, runValidators: true },
    )
    .where({ isDelete: { $ne: true } });

  if (!updatedGame) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to update game', '');
  }

  return updatedGame;
};

const getPendingGameUpdates = async () => {
  const updates = await PendingGameUpdate.find({ status: 'pending' }).populate(
    'userId',
    'email name',
  );
  return updates;
};

const approveGameUpdate = async (payload: TApproveGameUpdate) => {
  const pendingUpdate = await PendingGameUpdate.findById(payload.updateId);
  if (!pendingUpdate) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Pending game update not found',
      '',
    );
  }

  if (pendingUpdate.status !== 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Game update is not in pending status',
      '',
    );
  }

  const game = await games
    .findById(pendingUpdate.gameId)
    .where({ isDelete: { $ne: true } });

  if (!game) {
    throw new AppError(httpStatus.NOT_FOUND, 'Game not found', '');
  }

  const updateFields: Partial<IPendingGameUpdate> = {};
  if (pendingUpdate.game_title)
    updateFields.game_title = pendingUpdate.game_title;
  if (pendingUpdate.category) updateFields.category = pendingUpdate.category;
  if (pendingUpdate.description)
    updateFields.description = pendingUpdate.description;
  if (pendingUpdate.price) updateFields.price = pendingUpdate.price;
  if (pendingUpdate.steam_link)
    updateFields.steam_link = pendingUpdate.steam_link;
  if (pendingUpdate.x_link) updateFields.x_link = pendingUpdate.x_link;
  if (pendingUpdate.linkedin_link)
    updateFields.linkedin_link = pendingUpdate.linkedin_link;
  if (pendingUpdate.reddit_link)
    updateFields.reddit_link = pendingUpdate.reddit_link;
  if (pendingUpdate.instagram_link)
    updateFields.instagram_link = pendingUpdate.instagram_link;
  if (pendingUpdate.media_files)
    updateFields.media_files = pendingUpdate.media_files;

  const updatedGame = await games
    .findByIdAndUpdate(pendingUpdate.gameId, updateFields, {
      new: true,
      runValidators: true,
    })
    .where({ isDelete: { $ne: true } });

  if (!updatedGame) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to apply game update', '');
  }

  await PendingGameUpdate.findByIdAndUpdate(payload.updateId, {
    status: 'approved',
    reviewedAt: new Date(),
  });

  return updatedGame;
};

const rejectGameUpdate = async (updateId: string) => {
  const pendingUpdate = await PendingGameUpdate.findById(updateId);
  if (!pendingUpdate) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Pending game update not found',
      '',
    );
  }

  if (pendingUpdate.status !== 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Game update is not in pending status',
      '',
    );
  }

  await PendingGameUpdate.findByIdAndUpdate(updateId, {
    status: 'rejected',
    reviewedAt: new Date(),
  });

  return { message: 'Game update rejected successfully' };
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
    userId: pendingUpdate.id,
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
    { userId: pendingUpdate.id, isDeleted: { $ne: true } },
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

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalGames = await games.countDocuments({ isDelete: false });
  const totalUpcomingGames = await games.countDocuments({ isApproved: false });

  const userWiseGames = await User.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: 'games',
        localField: 'userId',
        foreignField: 'userId',
        as: 'games',
      },
    },
    {
      $project: {
        userId: 1,
        name: 1,
        email: 1,
        games: {
          $filter: {
            input: '$games',
            as: 'game',
            cond: { $eq: ['$$game.isDelete', false] },
          },
        },
      },
    },
    {
      $sort: { userId: 1 },
    },
  ]).project({
    userId: 1,
    name: 1,
    email: 1,
    'games._id': 1,
    'games.gameId': 1,
    'games.game_title': 1,
    'games.category': 1,
    'games.description': 1,
    'games.price': 1,
    'games.isApproved': 1,
  });

  const userGames = await games.aggregate([
    { $match: { isDelete: false } },
    {
      $group: {
        _id: '$userId',
        gameCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'userId',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$user.userId',
        userName: '$user.name',
        userEmail: '$user.email',
        gameCount: 1,
      },
    },
  ]);

  const allUsers = await User.find({ isDeleted: false })
    .select('-password')
    .lean();

  const allGames = await games.find({ isDelete: false }).lean();

  const approvedGames = await games.find({ isApproved: true }).lean();

  const gameUpdateRequest = await PendingGameUpdate.find({
    status: 'pending',
  }).lean();

  const userUpdateRequest = await PendingGameUpdate.find({
    status: 'pending',
  }).lean();

  return {
    totalUsers,
    totalGames,
    totalUpcomingGames,
    userWiseGames,
    allUsers,
    allGames,
    approvedGames,
    gameUpdateRequest,
    userUpdateRequest,
  };
};

const AdminServices = {
  createAdminIntoDb,
  loginAdminIntoDb,
  approveGame,
  getPendingGameUpdates,
  approveGameUpdate,
  rejectGameUpdate,
  getPendingProfileUpdates,
  approveProfileUpdate,
  rejectProfileUpdate,
  getDashboardStats,
};

export default AdminServices;
