import { Router } from 'express';
import TeamController from '../controllers/Team.controller';

const router = Router();

router.route('/')
  .get(TeamController.getAll);

router.route('/:id')
  .get(TeamController.getOne);

export default router;
