import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import AuthValidationSchema from './auth.validation';
import AuthController from './auth.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import UserServices from '../user/user.services';

const router = express.Router();

router.post('/login',
  validationRequest(AuthValidationSchema.userSignInValidation),
  AuthController.loginUser,
);
router.post('/forgot_password',
  validationRequest(AuthValidationSchema.forgotPasswordValidation),
  AuthController.requestForgotPassword,
);

router.post('/verify_forgot_password',
  validationRequest(AuthValidationSchema.verifyForgotPasswordValidation),
  AuthController.verifyForgotPassword,
);
router.patch('/update-password',
  validationRequest(AuthValidationSchema.updateUserPasswordValidation),
  AuthController.updateUserPassword,
);

const AuthRouter = router;

export default AuthRouter;
