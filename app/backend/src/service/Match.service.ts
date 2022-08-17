import Team from '../database/models/Team.model';
import { IMatchIndProg, IMatch, IPoints } from '../interfaces';
import ErrorCode from '../CodeError';
import Match from '../database/models/Match.model';

class MatchService {
  static async getAll() {
    const response = await Match.findAll();
    return response;
  }

  static async getOne(id: number) {
    const response = await Match.findOne({ where: { id } });
    if (!response) {
      throw new ErrorCode('Match not found', 404);
    }
    return response;
  }

  static async getByProgress(progress: boolean) {
    const response = await Match.findAll({ where: { inProgress: progress } });
    if (!response) {
      throw new ErrorCode('No matches found', 404);
    }
    return response;
  }

  static async finishMatch(id: number) {
    const response = await Match.update({ inProgress: false }, { where: { id } });
    return response;
  }

  static async createMatch(data: IMatch): Promise<IMatchIndProg> {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = data;
    if (homeTeam === awayTeam) {
      throw new ErrorCode('It is not possible to create a match with two equal teams', 401);
    }
    const hTeam = await Team.findOne({ where: { id: homeTeam } });
    const aTeam = await Team.findOne({ where: { id: awayTeam } });
    if (!hTeam || !aTeam) {
      throw new ErrorCode('There is no team with such id!', 401);
    }
    const response = await Match.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });
    return response;
  }

  static async updateMatch(id: number, data: IPoints) {
    const { homeTeamGoals, awayTeamGoals } = data;
    const response = await Match.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return response;
  }
}

export default MatchService;
