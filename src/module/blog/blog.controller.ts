import { RequestHandlerWithFiles } from '../../types/express';
import catchAsync from '../../utility/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';
import { RequestHandler } from 'express';
import BlogServices from './blog.services';

const createNewBlog: RequestHandlerWithFiles = catchAsync(async (req, res) => {
  console.log('GameController.createNewGame - Inputs:', {
    body: req.body,
    files: req.files,
    user: req.user,
    headers: req.headers,
  });

  const result = await BlogServices.createNewBlogIntoDb(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully created blog',
    data: result,
  });
});

const getAllBlog: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogIntoDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved all blogs',
    data: result,
  });
});

const updateBlog: RequestHandlerWithFiles = catchAsync(async (req, res) => {
  console.log('GameController.createNewGame - Inputs:', {
    body: req.body.data,
    file: req.file,
    headers: req.headers,
  });

  const result = await BlogServices.updateBlogIntoDb(req.body.data, req.file);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog updated perfectly',
    data: result,
  });
});

const deleteBlog: RequestHandler = catchAsync(async (req, res) => {
  console.log('BlogController.createNewGame - Inputs:', {
    body: req.body.data,
    headers: req.headers,
  });

  const result = await BlogServices.deleteBlogIntoDb(req.body.data?.blogId!)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog deleted perfectly',
    data: result,
  });
})

const deleteAllBlog: RequestHandler = catchAsync(async (req, res) => {
  console.log('BlogController.createNewGame - Inputs:', {
    body: req.body.data,
    headers: req.headers,
  });

  const result = await BlogServices.deleteAllBlogIntoDb()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All blogs deleted perfectly',
    data: result,
  });
})

const BlogController = {
  createNewBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  deleteAllBlog
};

export default BlogController;
