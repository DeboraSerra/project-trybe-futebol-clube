import Team from '../database/models/Team.model';
import { IMatchIndProg, IMatch, IPoints } from '../interfaces';
import ErrorCode from '../CodeError';
import Match from '../database/models/Match.model';

class MatchService {
  static async getTeamNames(match: IMatchIndProg) {
    const { homeTeam, awayTeam, inProgress } = match;
    const hTeamName = await Team.findOne({ where: { id: homeTeam }, attributes: ['teamName'] })
      .then((res) => res?.teamName);
    const aTeamName = await Team.findOne({ where: { id: awayTeam }, attributes: ['teamName'] })
      .then((res) => res?.teamName);
    return {
      ...match,
      inProgress: !!inProgress,
      teamHome: { teamName: hTeamName },
      teamAway: { teamName: aTeamName },
    };
  }

  static async getAll() {
    const matches = await Match.findAll({ raw: true });
    const response = await Promise.all(matches.map(MatchService.getTeamNames));
    return response;
  }

  static async getByTeamId(id: number, type = '') {
    let matches: IMatchIndProg[];
    if (type) {
      matches = await Match.findAll({ where: { [type]: id, inProgress: false }, raw: true });
    } else {
      matches = await Match.findAll({ where: { inProgress: false }, raw: true });
    }
    return matches;
  }

  // static async getOne(id: number) {
  //   const match = await Match.findOne({ where: { id } });
  //   if (!match) {
  //     throw new ErrorCode('Match not found', 404);
  //   }
  //   const response = await this.getTeamNames(match);
  //   return response;
  // }

  static async getByProgress(progress: boolean) {
    const matches = await Match.findAll({ where: { inProgress: progress }, raw: true });
    if (!matches) { throw new ErrorCode('No matches found', 404); }
    const response = await Promise.all(matches.map(MatchService.getTeamNames));
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
      throw new ErrorCode('There is no team with such id!', 404);
    }
    const response = await Match.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    }, { raw: true });
    return response;
  }

  static async updateMatch(id: number, data: IPoints) {
    const { homeTeamGoals, awayTeamGoals } = data;
    const response = await Match.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return response;
  }
}

export default MatchService;
