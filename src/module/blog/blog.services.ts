import httpStatus from 'http-status';
import AppError from '../../app/error/AppError';
import { RequestWithFiles } from '../../types/express';
import MediaUrl from '../../utility/game.media';
import { BlogInterface, IBlogUpdate } from './blog.interface';
import Blog from './blog.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import mongoose from 'mongoose';
import { idConverter } from '../../utility/idCoverter';

const createNewBlogIntoDb = async (req: RequestWithFiles) => {
  console.log('createNewGameIntoDb - Request Details:', {
    body: req.body,
    files: req.files,
    headers: req.headers,
  });

  const { data } = req.body;

  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Data object is missing', '');
  }

  if (!data.title) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog title is required', '');
  }

  if (!data.author) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Author is required', '');
  }
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const blogImageFiles = files?.blogImage || [];
  const blogImage =
    blogImageFiles.length > 0
      ? MediaUrl.profileMediaUrl(blogImageFiles[0].path, 'blogs')
      : '';
  const blogData: BlogInterface = {
    author: data.author || 'Unknown',
    title: data.title,
    description: data.description || '',
    blogImage,
    updatedAt: new Date(),
    isDeleted: false,
  };

  const result = await Blog.create(blogData);
  return result;
};

const getAllBlogIntoDb = async (query: Record<string, unknown>) => {
  try {
    const baseQuery = Blog.find();

    const blogQuery = new QueryBuilder(baseQuery, query)
      .search(['title', 'description'])
      .filter()
      .sort()
      .pagination()
      .fields();

    const allBlogs = await blogQuery.modelQuery;
    const meta = await blogQuery.countTotal();

    return { meta, allBlogs };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to retrieve blogs',
      '',
    );
  }
};

const updateBlogIntoDb = async (
  payload: IBlogUpdate,
  file?: Express.Multer.File,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('file:', file?.path);

    console.log('payload: ', payload);

    console.log('userId: ', payload.blogId);

    if (!payload.blogId) {
      throw new AppError(httpStatus.FORBIDDEN, 'Blog does not exist', '');
    }
    const blogIdObject = await idConverter(payload.blogId);

    const existingBlog = await Blog.findOne({
      _id: blogIdObject,
      isDeleted: { $ne: true },
    });
    // { $set: updateFields },
    // { new: true, runValidators: true, session },
    // ).select('-password');

    if (!existingBlog) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found or is deleted',
        '',
      );
    }

    if (existingBlog.id !== payload.blogId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Blog does not exist for edit',
        '',
      );
    }
    const updateFields: Partial<IBlogUpdate> = {};

    if (payload.title) updateFields.title = payload.title;
    if (payload.description) updateFields.description = payload.description;
    if (payload.author) updateFields.author = payload.author;

    if (file) {
      updateFields.blogImage = MediaUrl.profileMediaUrl(
        file.path,
        payload.blogId,
      );
    }

    updateFields.updatedAt = new Date();

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogIdObject,
      { $set: updateFields },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();

    return updatedBlog;
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

const BlogServices = {
  createNewBlogIntoDb,
  getAllBlogIntoDb,
  updateBlogIntoDb,
};

export default BlogServices;
