import { Router } from 'express';
import MatchController from '../controllers/Match.controller';
import tokenMiddleware from '../middlewares/token.middleware';

const router = Router();

router.route('/')
  .get(MatchController.getAll)
  .post(tokenMiddleware, MatchController.createMatch);

router.route('/:id/finish')
  .patch(MatchController.finishMatch);

router.route('/:id')
  .patch(MatchController.updateMatch);

export default router;
