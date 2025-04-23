import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import GameController from '../game/game.controller';
import AdminValidationSchema from './admin.validation';
import AdminController from './admin.controller';

const router = express.Router();

router.get('/getAllGames', GameController.getAllGame);
router.post(
  '/approveGame',
  validationRequest(AdminValidationSchema.approveGameValidation),
  AdminController.approveGameByAdmin,
);

const AuthRouter = router;

export default AuthRouter;