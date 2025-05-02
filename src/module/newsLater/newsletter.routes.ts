import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { newsletterValidationSchema } from './newsletter.validation';
import newsletterController from './newsletter.controller';
const router = express.Router();

router.post(
  '/add-mail',
  validationRequest(newsletterValidationSchema),
  newsletterController.addNewsletterMail,
);

router.get('/findNewsletterMail', newsletterController.findAllNewsletterEmail);

export const NewsletterRoute = router;
