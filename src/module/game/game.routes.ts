import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { GameValidation } from './game.zod.validation';

const router = express.Router();

router.post(
  '/upload_game',
  validationRequest(GameValidation.gameUploadValidationSchema),
  UserController.createUser,
);
router.post(
  '/update_game',
  validationRequest(GameValidation.gameUpdateValidationSchema),
  UserController.createUser,
);

router.get('/find_all_games', UserController.findAllUser);

export const GameRouter = router;
