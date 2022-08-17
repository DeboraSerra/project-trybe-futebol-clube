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
    return { ...match,
      inProgress: !!inProgress,
      teamHome: { teamName: hTeamName },
      teamAway: { teamName: aTeamName } };
  }

  static async getAll() {
    const matches = await Match.findAll({ raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    const response = await Promise.all(matches.map(MatchService.getTeamNames));
    return response;
  }

  static async getOne(id: number) {
    const match = await Match.findOne({ where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      } });
    if (!match) {
      throw new ErrorCode('Match not found', 404);
    }
    const { homeTeam, awayTeam } = match;
    const hTeamName = await Team.findOne({ where: { id: homeTeam }, attributes: ['teamName'] })
      .then((res) => res?.teamName);
    const aTeamName = await Team.findOne({ where: { id: awayTeam }, attributes: ['teamName'] })
      .then((res) => res?.teamName);
    const response = { ...match,
      teamHome: { teamName: hTeamName },
      teamAway: { teamName: aTeamName } };
    return response;
  }

  static async getByProgress(progress: boolean) {
    const matches = await Match.findAll({ where: { inProgress: progress },
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    if (!matches) {
      throw new ErrorCode('No matches found', 404);
    }
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
      throw new ErrorCode('There is no team with such id!', 401);
    }
    const response = await Match.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    }, { raw: true, attributes: { exclude: ['createdAt', 'updatedAt'] } });
    return response;
  }

  static async updateMatch(id: number, data: IPoints) {
    const { homeTeamGoals, awayTeamGoals } = data;
    const response = await Match.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return response;
  }
}

export default MatchService;
