import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { userValidation } from './user.zod.validation';
import UserController from './user.controller';
import { uploadProfile } from '../../app/multer/profile.multer';

const router = express.Router();

router.post(
  '/signup',
  validationRequest(userValidation.userSignUpValidation),
  UserController.createUser,
);

router.get('/find_all_users', UserController.findAllUser);
router.post(
  '/update_profile',
  validationRequest(userValidation.userProfileUpdateValidation),
  uploadProfile.single('photo'),
  UserController.updateProfileUser,
);

export const UserRouter = router;
