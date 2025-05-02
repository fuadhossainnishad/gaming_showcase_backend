import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import GameController from '../game/game.controller';
import AdminValidationSchema from './admin.validation';
import AdminController from './admin.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import AuthValidationSchema from '../auth/auth.validation';
import AuthController from '../auth/auth.controller';
import { userValidation } from '../user/user.zod.validation';

const router = express.Router();

router.post(
  '/signup',
  validationRequest(userValidation.userSignUpValidation),
  AdminController.createAdmin,
);

router.post(
  '/login',
  validationRequest(AuthValidationSchema.userSignInValidation),
  AdminController.loginAdmin,
);

router.get('/getAllGame', auth(USER_ROLE.ADMIN), GameController.getAllGame);

router.post(
  '/approveGame',
  auth(USER_ROLE.ADMIN),
  validationRequest(AdminValidationSchema.approveGameValidation),
  AdminController.approveGameByAdmin,
);

router.get(
  '/pending-game-updates',
  auth(USER_ROLE.ADMIN),
  AdminController.getPendingGameUpdates,
);

router.post(
  '/approve-game-update',
  auth(USER_ROLE.ADMIN),
  validationRequest(AdminValidationSchema.approveGameUpdateValidation),
  AdminController.approveGameUpdateByAdmin,
);

router.delete(
  '/reject-game-update',
  auth(USER_ROLE.ADMIN),
  validationRequest(AdminValidationSchema.rejectGameUpdateValidation),
  AdminController.rejectGameUpdateByAdmin,
);

router.get(
  '/pending-profile-updates',
  auth(USER_ROLE.ADMIN),
  AdminController.getPendingProfileUpdates,
);

router.post(
  '/approve-profile-update',
  auth(USER_ROLE.ADMIN),
  validationRequest(AdminValidationSchema.approveProfileUpdateValidation),
  AdminController.approveProfileUpdateByAdmin,
);

router.delete(
  '/reject-profile-update',
  auth(USER_ROLE.ADMIN),
  validationRequest(AdminValidationSchema.rejectProfileUpdateValidation),
  AdminController.rejectProfileUpdateByAdmin,
);

router.get(
  '/dashboard',
  auth(USER_ROLE.ADMIN),
  AdminController.getDashboardStats,
);

const AdminRouter = router;

export default AdminRouter;
