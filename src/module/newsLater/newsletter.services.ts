import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import QueryBuilder from '../../app/builder/QueryBuilder';
import NewsLetter from './newsletter.model';

type TNewsLater = {
  email: string;
};

export const addNewsletterMail = async (payload: TNewsLater) => {
  try {
    console.log(payload);
    const { email } = payload;
    const isExist = await NewsLetter.findOne({
      email,
      isDeleted: { $ne: true },
    });
    if (isExist) {
      throw new AppError(httpStatus.FORBIDDEN, 'Mail already exist', '');
    }
    const addNewsletterMailBuilder = new NewsLetter(payload);
    // console.log(addNewsLaterMailBuilder);
    const result = await addNewsletterMailBuilder.save();
    return (
      result && { status: true, message: 'successfully add newsletter email' }
    );
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      ' addNewsletterMail server unavailable',
      error.message,
    );
  }
};

const findAllNewsletterEmailIntoDb = async (query: Record<string, unknown>) => {
  try {
    const allNewsletterMailQuery = new QueryBuilder(NewsLetter.find(), query)
      .search(['email'])
      .filter()
      .sort()
      .pagination()
      .fields();

      const emails = await allNewsletterMailQuery.modelQuery;

      const total = await NewsLetter.countDocuments(query); 
  
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
  
      return {
        meta: {
          total,
          page,
          limit,
        },
        data: emails,
      };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      'allNewsletterMailQuery server unavailable',
      '',
    );
  }
};

const newsletterService = {
  addNewsletterMail,
  findAllNewsletterEmailIntoDb,
};

export default newsletterService;
