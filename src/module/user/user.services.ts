import httpStatus from 'http-status';

import User from './user.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { IPendingUserUpdate, IUser, IUserUpdate } from './user.interface';
import mongoose from 'mongoose';
import { updateUserProfileType } from './user.constant';
import config from '../../app/config';
import AppError from '../../app/error/AppError';
import PendingUserUpdate from './userUpdateProfile';
import MediaUrl from '../../utility/game.media';

const createUserIntoDb = async (payload: IUser) => {
  try {
    console.log(payload);
    const createUserBuilder = new User(payload);
    // console.log(createUserBuilder);
    const result = await createUserBuilder.save();
    return result && { status: true, message: 'successfully create user' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      ' createUserIntoDb server unavailable',
      error.message,
    );
  }
};

const findAllUserIntoDb = async (query: Record<string, unknown>) => {
  try {
    const allUserQuery = new QueryBuilder(
      User.find(),

      query,
    )
      .search(['name', 'email'])
      .filter()
      .sort()
      .pagination()
      .fields();

    const allUsers = (await allUserQuery.modelQuery) as any;
    const meta = await allUserQuery.countTotal();

    return { meta, allUsers };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      'findAllUserIntoDb server unavailable',
      '',
    );
  }
};

const updateUserProfileIntoDb = async (
  userId: string,
  payload: IUserUpdate,
  file?: Express.Multer.File,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { ...updateFields } = payload;

    console.log('file:', file?.path);

    console.log('payload: ', payload);

    console.log('userId: ', userId);

    if (!userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Provided user ID does not match authenticated user',
        '',
      );
    }

    // if (password) {
    //   updateFields.password = await bcrypt.hash(
    //     password,
    //     Number(config.bcrypt_salt_rounds),
    //   );
    // }

    const existingUser = await User.findOne({
      userId: userId,
      isDeleted: { $ne: true },
    });
    // { $set: updateFields },
    // { new: true, runValidators: true, session },
    // ).select('-password');

    if (!existingUser) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found or is deleted',
        '',
      );
    }

    if (existingUser.userId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You can only update your own profile',
        '',
      );
    }
    
    const photoPath = file
      ? MediaUrl.profileMediaUrl(file.path, userId)
      : existingUser.photo;
    console.log('photoPath:', photoPath);

    const pendingUserUpdateData: Partial<IPendingUserUpdate> = {
      userId,
      ...updateFields,
      photo: photoPath,
      status: 'pending',
    };

    const pendingUPdate = await PendingUserUpdate.create(
      [pendingUserUpdateData],
      { session },
    );

    await session.commitTransaction();

    return pendingUPdate;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to update user profile',
      '',
    );
  } finally {
    session.endSession();
  }
};
const submitProfileUpdate = async (
  userId: string,
  payload: IPendingUserUpdate,
) => {
  const user = await User.findOne({ userId: userId, isDeleted: { $ne: true } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', '');
  }

  const existingUpdate = await PendingUserUpdate.findOne({
    userId,
    status: 'pending',
  });
  if (existingUpdate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already have a pending profile update',
      '',
    );
  }

  const updateData = {
    userId,
    name: payload.name,
    bio: payload.bio,
    links: payload.links,
    photo: MediaUrl.profileMediaUrl(payload.photo as string, userId),
    status: 'pending',
    submittedAt: new Date(),
  };

  const pendingUpdate = await PendingUserUpdate.create(updateData);
  return pendingUpdate;
};
const UserServices = {
  createUserIntoDb,
  findAllUserIntoDb,
  updateUserProfileIntoDb,
  submitProfileUpdate,
};

export default UserServices;
