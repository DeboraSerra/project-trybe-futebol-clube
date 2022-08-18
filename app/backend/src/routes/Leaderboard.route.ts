import { Router } from 'express';
import LeaderboardController from '../controllers/Leaderboard.controller';

const router = Router();

router.route('/')
  .get(LeaderboardController.getTeamsGeneral);

router.route('/:type')
  .get(LeaderboardController.getTeams);

export default router;
