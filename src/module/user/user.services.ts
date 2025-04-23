import httpStatus from 'http-status';

import User from './user.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { IUser } from './user.interface';
import mongoose from 'mongoose';
import { updateUserProfileType } from './user.constant';
import config from '../../app/config';
import AppError from '../../app/error/AppError';

const createUserIntoDb = async (payload: IUser) => {
  try {
    const createUserBuilder = new User(payload);
    const result = await createUserBuilder.save();
    return result && { status: true, message: 'successfully create user' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      ' createUserIntoDb server unavailable',
      '',
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

    const allusers = (await allUserQuery.modelQuery) as any;
    const meta = await allUserQuery.countTotal();

    return { meta, allusers };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      'findAllUserIntoDb server unavailable',
      '',
    );
  }
};

const updateUserProfileIntoDb = async (payload: updateUserProfileType) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, password, ...updateFields } = payload;

    // if (password) {
    //   updateFields.password = await bcrypt.hash(
    //     password,
    //     Number(config.bcrypt_salt_rounds),
    //   );
    // }

    const updatedUser = await User.findOneAndUpdate(
      { userId, isDeleted: { $ne: true } },
      { $set: updateFields },
      { new: true, runValidators: true, session },
    ).select('-password');

    if (!updatedUser) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found or is deleted',
        '',
      );
    }

    await session.commitTransaction();
    return updatedUser;
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

const UserServices = {
  createUserIntoDb,
  findAllUserIntoDb,
  updateUserProfileIntoDb,
};

export default UserServices;
