import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { userValidation } from './user.zod.validation';
import UserController from './user.controller';

const router = express.Router();

router.post('/signup',
  validationRequest(userValidation. userSignUpValidation),
 UserController.createUser
);

router.get("/find_all_users",UserController.findAllUser)

export const UserRouter = router;
