import express, { NextFunction, Request, Response } from 'express';
import validationRequest from '../../middleware/validationRequest';
import GameValidationSchema from './game.zod.validation';
import GameController from './game.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utility/uplodeFile';

const router = express.Router();

router.post(
  '/upload_game',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  upload.array('file'),
  validationRequest(GameValidationSchema.GameSchema),
  GameController.createNewGame,
);

router.post(
  '/update_game',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  upload.array('file'),
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
