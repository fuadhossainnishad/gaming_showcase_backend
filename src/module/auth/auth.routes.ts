import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import AuthValidationSchema from './auth.validation';
import AuthController from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  validationRequest(AuthValidationSchema.userSignInValidation),
  AuthController.loginUser,
);

const AuthRouter = router;

export default AuthRouter;
