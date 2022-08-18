import { ITeam } from '../interfaces';
import Team from '../database/models/Team.model';
import ErrorCode from '../CodeError';

class TeamService {
  static async getAll(): Promise<ITeam[]> {
    const response = await Team.findAll({ raw: true });
    return response;
  }

  static async getOne(id: number) {
    const response = await Team.findOne({ where: { id }, raw: true });
    if (!response) throw new ErrorCode('Team not found', 404);
    return response;
  }

  // static async create(name: string) {
  //   if (!name) {
  //     throw new Error('no name');
  //   }
  //   const response = await Team.create({ teamName: name });
  //   return response;
  // }

  // static async delete(id: number) {
  //   const exists = await Team.findOne({ where: { id } });
  //   if (!exists) throw new Error();
  //   await Team.destroy({ where: { id } });
  // }
}

export default TeamService;
