import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { newsletterValidationSchema } from './newsletter.validation';
import newsletterController from './newsletter.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/add-mail',
  validationRequest(newsletterValidationSchema),
  newsletterController.addNewsletterMail,
);

router.get(
  '/findNewsletterMail',
  auth(USER_ROLE.ADMIN),
  newsletterController.findAllNewsletterEmail);

export const NewsletterRoute = router;
