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
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body && req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON data provided',
          errorSources: [
            {
              path: '',
              message: 'Invalid JSON data provided',
            },
          ],
        });
      }
    } else {
      req.body = {};
    }
    next();
  },
  validationRequest(GameValidationSchema.GameSchema),
  GameController.createNewGame,
);

const GameRouter = router;

export default GameRouter;
