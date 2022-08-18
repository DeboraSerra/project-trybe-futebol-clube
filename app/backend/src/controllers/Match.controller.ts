import { Request, Response } from 'express';
import MatchService from '../service/Match.service';

class MatchController {
  static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress !== undefined) {
      const matches = await MatchService.getByProgress(inProgress === 'true');
      return res.status(200).json(matches);
    }
    const matches = await MatchService.getAll();
    res.status(200).json(matches);
  }

  // static async getOne(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const match = await MatchService.getOne(+id);
  //   res.status(200).json(match);
  // }

  static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    await MatchService.finishMatch(+id);
    res.status(200).json({ message: 'Finished' });
  }

  static async createMatch(req: Request, res: Response) {
    const match = await MatchService.createMatch(req.body);
    res.status(201).json(match);
  }

  static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const match = await MatchService.updateMatch(+id, req.body);
    res.status(200).json(match);
  }
}

export default MatchController;
