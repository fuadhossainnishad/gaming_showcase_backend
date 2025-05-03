import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { userValidation } from './user.zod.validation';
import UserController from './user.controller';
import { uploadProfile } from '../../app/multer/profile.multer';
import verifyToken from '../../middleware/verifyToken';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/signup',
  validationRequest(userValidation.userSignUpValidation),
  UserController.createUser,
);

router.get('/find_all_users', UserController.findAllUser);

router.patch(
  '/update_profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  uploadProfile.single('photo'),
  validationRequest(userValidation.userProfileUpdateValidation),
  UserController.updateProfileUser,
);
// router.post(
//   '/profile/update',
//   verifyToken,
//   validationRequest(userValidation.userProfileUpdateValidation),
//   UserController.submitProfileUpdate,
// );
export const UserRouter = router;
