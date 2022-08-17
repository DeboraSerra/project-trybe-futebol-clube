import { Request, Response } from 'express';
// import { verify } from 'jsonwebtoken';
// import { ReqUser } from '../middlewares/token.middleware';
import TeamService from '../service/Team.service';
// import UserService from '../services/User.service';

// const secret = process.env.JWT_SECRET || 'secret';

class TeamController {
  static async getAll(_req: Request, res: Response) {
    const response = await TeamService.getAll();
    res.status(200).json(response);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const response = await TeamService.getOne(+id);
    res.status(200).json(response);
  }

  // public async create(req: ReqUser, res: Response) {
  //   const { name } = req.body;
  //   const response = await TeamService.create(name);
  //   res.status(200).json(response);
  // }

  // public async delete(req: ReqUser, res: Response) {
  //   const { id } = req.params;
  //   await TeamService.delete(+id);
  //   res.status(203);
  // }
}

export default TeamController;
