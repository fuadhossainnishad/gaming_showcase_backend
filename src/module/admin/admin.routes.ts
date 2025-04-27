import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import GameController from '../game/game.controller';
import AdminValidationSchema from './admin.validation';
import AdminController from './admin.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/getAllGame', GameController.getAllGame);
router.post(
  '/approveGame',
  auth(USER_ROLE.ADMIN),
  validationRequest(AdminValidationSchema.approveGameValidation),
  AdminController.approveGameByAdmin,
);

const AdminRouter = router;

export default AdminRouter;
