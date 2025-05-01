import express, { NextFunction, Request, Response } from 'express';
import validationRequest from '../../middleware/validationRequest';
import GameValidationSchema from './game.zod.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { uploadGames } from '../../app/multer/game.multer';
import GameController from './game.controller';

const router = express.Router();

router.post(
  '/upload_game',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  uploadGames.array('media_files', 5),
  validationRequest(GameValidationSchema.GameSchema),
  GameController.createNewGame,
);

router.patch(
  '/update_game',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  uploadGames.array('media_files'),
  validationRequest(GameValidationSchema.GameUpdateSchema),
  GameController.updateGame,
);

router.post(
  '/comment',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validationRequest(GameValidationSchema.CommentSchema),
  GameController.addComment,
);

router.post(
  '/share',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validationRequest(GameValidationSchema.ShareSchema),
  GameController.addShare,
);

router.get(
  '/getAllGame',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  GameController.getAllGame,
);

router.get(
  '/top-game/day',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validationRequest(GameValidationSchema.TopGameQuerySchema),
  GameController.getTopGameOfDay,
);

router.get(
  '/top-game/week',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validationRequest(GameValidationSchema.TopGameQuerySchema),
  GameController.getTopGameOfWeek,
);

const GameRouter = router;

export default GameRouter;