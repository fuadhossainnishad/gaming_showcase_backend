import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import { TUserSignUp } from './user.interface';
import User from './user.model';
import QueryBuilder from '../../app/builder/QueryBuilder';

const createUserIntoDb = async (payload: TUserSignUp) => {
  try {
    const createUserBuilder = new User(payload);
    const result = await createUserBuilder.save();
    return result && { status: true, message: 'successfully create user' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      ' createUserIntoDb server unavilable',
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
      '  findAllUserIntoDb server unavilable',
      '',
    );
  }
};

const UserServices = {
  createUserIntoDb,
  findAllUserIntoDb,
};

export default UserServices;
