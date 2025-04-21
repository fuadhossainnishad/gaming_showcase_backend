import express from 'express';

import { UserRouter } from '../module/user/user.routes';
import { GameRouter } from '../module/game/game.routes';

const router = express.Router();
const moduleRoutes = [
  { path: '/user', route: UserRouter },
  { path: '/game', route: GameRouter },
];

moduleRoutes.forEach((v) => router.use(v.path, v.route));

export default router;
