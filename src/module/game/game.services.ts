import { RequestWithFiles } from '../../types/express';
import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import games from './game.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import User from '../user/user.model';
import { CommentPayload, SharePayload, TGameUpdate, TopGameQuery } from './game.type';
import { startOfDay, startOfWeek, endOfDay, endOfWeek } from 'date-fns';
import { USER_ROLE, UserRole } from '../user/user.constant';
import PendingGameUpdate from './gameUpdate.model';
import { GameInterface, IPendingGameUpdate } from './game.interface';
import mongoose from 'mongoose';
import MediaUrl from '../../utility/game.media';

const createNewGameIntoDb = async (req: RequestWithFiles, userId: string) => {
  console.log('createNewGameIntoDb - Request Details:', {
    body: req.body,
    files: req.files,
    userId,
    headers: req.headers,
  });

  const payload = req.body;

  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request body is missing', '');
  }
  if (!payload.game_title) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Game title is required', '');
  }
  if (!payload.category) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category is required', '');
  }

  const files = Array.isArray(req.files)
    ? req.files
    : req.files && 'media_files' in req.files
    ? req.files['media_files']
    : undefined;

  const mediaFiles = files?.map((file) => MediaUrl.gameMediaUrl(file.path, userId)) || [];

  const gameData: GameInterface = {
    userId: userId,
    gameId: payload.gameId,
    game_title: payload.game_title,
    category: payload.category,
    description: payload.description || '',
    price: payload.price,
    steam_link: payload.steam_link || '',
    x_link: payload.x_link || '',
    linkedin_link: payload.linkedin_link || '',
    reddit_link: payload.reddit_link || '',
    instagram_link: payload.instagram_link || '',
    media_files: mediaFiles,
    comments: [],
    totalComments: 0,
    shares: [],
    totalShare: 0,
    isApproved: false,
    isDelete: false,
  };

  const result = await games.create(gameData);
  return result;
};

const getAllGameIntoDb = async (
  query: Record<string, unknown>,
  role: UserRole,
) => {
  try {
    if (!Object.values(USER_ROLE).includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid user role', '');
    }
    const baseQuery = games.find().populate('userId');

    if (role !== USER_ROLE.ADMIN) {
      baseQuery.where({ isApproved: true });
    }

    const gameQuery = new QueryBuilder(baseQuery, query)
      .search(['game_title', 'description'])
      .filter()
      .sort()
      .pagination()
      .fields();

    const allGames = await gameQuery.modelQuery;
    const meta = await gameQuery.countTotal();

    return { meta, allGames };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to retrieve games',
      '',
    );
  }
};

const userComment = async (payload: CommentPayload, userId: string) => {
  try {
    const { gameId, comment } = payload;

    const user = await User.findById(userId).where({
      isDeleted: { $ne: true },
    });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
    }

    const game = await games
      .findById(gameId)
      .where({ isDelete: { $ne: true } });
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
        {
          $push: {
            comments: { userId, comment },
          },
          $inc: {
            totalComments: 1,
          },
        },
        { new: true, runValidators: true },
      )
      .where({ isDelete: { $ne: true } })
      .populate('userId');

    if (!updatedGame) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to add comment', '');
    }

    return updatedGame;
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to add comment',
      '',
    );
  }
};

const userShare = async (payload: SharePayload, userId: string) => {
  try {
    const { gameId } = payload;

    const user = await User.findById(userId).where({
      isDeleted: { $ne: true },
    });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
    }

    const game = await games
      .findById(gameId)
      .where({ isDelete: { $ne: true } });
    if (!game) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Game not found or is deleted',
        '',
      );
    }

    const alreadyShared = game.shares.some((share) =>
      share.userId.equals(userId),
    );
    if (alreadyShared) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'User has already shared this game',
        '',
      );
    }

    const updatedGame = await games
      .findByIdAndUpdate(
        gameId,
        {
          $push: {
            shares: { userId },
          },
          $inc: {
            totalShare: 1,
          },
        },
        { new: true, runValidators: true },
      )
      .where({ isDelete: { $ne: true } })
      .populate('userId');

    if (!updatedGame) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to add share', '');
    }

    return updatedGame;
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to add share',
      '',
    );
  }
};

const getTopGameOfDay = async (query: TopGameQuery) => {
  try {
    const { limit = 10 } = query;
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());

    const topGames = await games
      .aggregate([
        {
          $match: {
            isDelete: { $ne: true },
            isApproved: true,
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $addFields: {
            popularityScore: { $add: ['$totalComments', '$totalShare'] },
          },
        },
        { $sort: { popularityScore: -1, createdAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        { $unwind: '$userId' },
      ])
      .exec();

    return topGames;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to retrieve top games of the day',
      '',
    );
  }
};

const getTopGameOfWeek = async (query: TopGameQuery) => {
  try {
    const { limit = 10 } = query;
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });

    const topGames = await games
      .aggregate([
        {
          $match: {
            isDelete: { $ne: true },
            isApproved: true,
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $addFields: {
            popularityScore: { $add: ['$totalComments', '$totalShare'] },
          },
        },
        { $sort: { popularityScore: -1, createdAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        { $unwind: '$userId' },
      ])
      .exec();

    return topGames;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to retrieve top games of the week',
      '',
    );
  }
};

const updateGameIntoDb = async (
  userId: string,
  payload: TGameUpdate,
  files?: Express.Multer.File[],
) => {
  const { gameId, ...updateData } = payload;

  if (!mongoose.isValidObjectId(gameId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid game ID', '');
  }

  const game = await games.findById(gameId).where({ isDelete: { $ne: true } });
  if (!game) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Game not found or is deleted',
      '',
    );
  }

  if (game.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own games',
      '',
    );
  }

  const existingUpdate = await PendingGameUpdate.findOne({
    gameId: gameId,
    userId,
    status: 'pending',
  });
  if (existingUpdate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already have a pending game update',
      '',
    );
  }

  const pendingUpdateData: Partial<IPendingGameUpdate> = {
    gameId: gameId,
    userId,
    game_title: updateData.game_title,
    category: updateData.category,
    description: updateData.description,
    price: updateData.price,
    steam_link: updateData.steam_link,
    x_link: updateData.x_link,
    linkedin_link: updateData.linkedin_link,
    reddit_link: updateData.reddit_link,
    instagram_link: updateData.instagram_link,
    media_files: files
      ? files.map((file) => file.path)
      : updateData.media_files,
    status: 'pending',
    submittedAt: new Date(),
  };

  const pendingUpdate = await PendingGameUpdate.create(pendingUpdateData);
  return pendingUpdate;
};

const GameServices = {
  createNewGameIntoDb,
  getAllGameIntoDb,
  userComment,
  userShare,
  getTopGameOfDay,
  getTopGameOfWeek,
  updateGameIntoDb,
};

export default GameServices;