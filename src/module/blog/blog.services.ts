import { RequestWithFiles } from '../../types/express';
import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import games from './blog.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import User from '../user/user.model';
import {
  CommentPayload,
  SharePayload,
  TGameUpdate,
  TopGameQuery,
} from './blog.type';
import { startOfDay, startOfWeek, endOfDay, endOfWeek } from 'date-fns';
import { USER_ROLE, UserRole } from '../user/user.constant';
import PendingGameUpdate from './blogUpdate.model';
import { GameInterface, IPendingGameUpdate } from './blog.interface';
import mongoose from 'mongoose';
import MediaUrl from '../../utility/game.media';
import { idConverter } from '../../utility/idCoverter';

const createNewGameIntoDb = async (req: RequestWithFiles, userId: string) => {
  console.log('createNewGameIntoDb - Request Details:', {
    body: req.body,
    files: req.files,
    userId,
    headers: req.headers,
  });

  const { data, image } = req.body;
  console.log(image);

  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Data object is missing', '');
  }
  if (!data.title) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Game title is required', '');
  }
  if (!data.categories || !data.categories.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Categories are required', '');
  }

  // const payload = req.body;

  // if (!payload) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Request body is missing', '');
  // }
  // if (!payload.game_title) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Game title is required', '');
  // }
  // if (!payload.category) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Category is required', '');
  // }

  // const files = Array.isArray(req.files)
  //   ? req.files
  //   : req.files && 'media_files' in req.files
  //     ? req.files['media_files']
  //     : undefined;

  // const mediaFiles =
  //   files?.map((file) => MediaUrl.gameMediaUrl(file.path, userId)) || [];

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFiles = files['image'] || [];
  const thumbnailFile = files['thumbnail'] ? files['thumbnail'][0] : null;

  const mediaFiles = imageFiles.map((file) =>
    MediaUrl.gameMediaUrl(file.path, userId),
  );
  const thumbnail = thumbnailFile
    ? MediaUrl.gameMediaUrl(thumbnailFile.path, userId)
    : image?.thumbnail || '';

  const user = await User.findById(userId).where({ isDeleted: { $ne: true } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const gameData: GameInterface = {
    userId:await idConverter(userId),
    author: data.author || 'Unknown',
    title: data.title,
    subTitle: data.subTitle || '',
    description: data.description || '',
    image: mediaFiles.length > 0 ? mediaFiles : image?.images || [],
    thumbnail: thumbnail,
    categories: data.categories,
    platform: data.platform || [],
    price: data.price ? parseFloat(data.price) : 0,
    socialLinks: data.socialLinks || [],
    gameStatus: data.gameStatus,
    upcomingDate: data.upcomingDate,
    comments: [],
    totalComments: 0,
    shares: [],
    totalShare: 0,
    isApproved: false,
    isDelete: false,
  };

  // const gameData: GameInterface = {
  //   userId: userId,
  //   gameId: payload.gameId,
  //   game_title: payload.game_title,
  //   category: payload.category,
  //   description: payload.description || '',
  //   price: payload.price,
  //   steam_link: payload.steam_link || '',
  //   x_link: payload.x_link || '',
  //   linkedin_link: payload.linkedin_link || '',
  //   reddit_link: payload.reddit_link || '',
  //   instagram_link: payload.instagram_link || '',
  //   media_files: mediaFiles,
  //   comments: [],
  //   totalComments: 0,
  //   shares: [],
  //   totalShare: 0,
  //   isApproved: false,
  //   isDelete: false,
  // };

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
      .search(['title', 'description'])
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
    // console.log(userId);

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
        { id: gameId },
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
  id: string,
  payload: TGameUpdate,
  files?: { [fieldname: string]: Express.Multer.File[] },
) => {
  const { data, image } = payload;
  console.log(payload);

  if (!data.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Provided user ID does not match authenticated user',
      '',
    );
  }

  if (!mongoose.isValidObjectId(data.gameId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid game ID', '');
  }

  const game = await games
    .findById(data.gameId)
    .where({ isDelete: { $ne: true } });
  if (!game) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Game not found or is deleted',
      '',
    );
  }

  if (game.userId.toString() !== data.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own games',
      '',
    );
  }

  const existingUpdate = await PendingGameUpdate.findOne({
    gameId: data.gameId,
    userId: data.userId,
    status: 'pending',
  });
  if (existingUpdate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already have a pending game update',
      '',
    );
  }

  const imageFiles = files?.['image'] || [];
  const thumbnailFile = files?.['thumbnail'] ? files['thumbnail'][0] : null;

  const mediaFiles = imageFiles.map((file) =>
    MediaUrl.gameMediaUrl(file.path, data.userId),
  );
  const thumbnail = thumbnailFile
    ? MediaUrl.gameMediaUrl(thumbnailFile.path, data.userId)
    : image?.thumbnail || '';

  const pendingUpdateData: Partial<IPendingGameUpdate> = {
    gameId:await idConverter(data.gameId),
    userId:await idConverter(data.userId),
    title: data.title,
    subTitle: data.subTitle,
    description: data.description,
    image: mediaFiles.length > 0 ? mediaFiles : image?.images || [],
    thumbnail: thumbnail,
    categories: data.categories,
    platform: data.platform,
    price: data.price,
    socialLinks: data.socialLinks,
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
