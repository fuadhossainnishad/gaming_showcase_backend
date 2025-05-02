import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';
import newsletterService from './newsletter.services';

const addNewsletterMail: RequestHandler = catchAsync(async (req, res) => {
  const result = await newsletterService.addNewsletterMail(req.body);
  console.log(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully add email to newsletter',
    data: result,
  });
});

const findAllNewsletterEmail: RequestHandler = catchAsync(async (req, res) => {
  const result = await newsletterService.findAllNewsletterEmailIntoDb(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully retrieve newsletter emails',
    data: result,
  });
});

const newsletterController = {
  addNewsletterMail,
  findAllNewsletterEmail,
};

export default newsletterController;
