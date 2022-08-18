import { Request, Response } from 'express';
import TeamService from '../service/Team.service';
import { ILeadeboard, IMatchIndProg } from '../interfaces';
import MatchService from '../service/Match.service';

class LeaderboardController {
  private static async calculatePoints(match: IMatchIndProg) {
    const hGoals = match.homeTeamGoals;
    const aGoals = match.awayTeamGoals;
    if (hGoals > aGoals) {
      return { homeTeam: 3, awayTeam: 0, winner: 'homeTeam' };
    } if (aGoals > hGoals) {
      return { homeTeam: 0, awayTeam: 3, winner: 'awayTeam' };
    }
    return { homeTeam: 1, awayTeam: 1, winner: 'draw' };
  }

  private static async getPoints(id: number, type: string) {
    const query = type === 'home' ? 'homeTeam' : 'awayTeam';
    const other = type !== 'home' ? 'homeTeam' : 'awayTeam';
    const matches: IMatchIndProg[] = await MatchService.getByTeamId(id, type ? query : undefined);
    const points = await Promise.all(matches.map(this.calculatePoints));
    const totalPoints = points.reduce((acc, item) => acc + item[query], 0);
    const totalGames = points.length;
    const goalsFavor = matches.reduce((acc, item) => acc + item[`${query}Goals`], 0);
    const goalsOwn = matches.reduce((acc, item) => acc + item[`${other}Goals`], 0);
    const efficiency = +((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return { totalVictories: points.filter((item) => item.winner === query).length,
      totalPoints,
      totalLosses: points.filter((item) => item.winner === other).length,
      totalGames,
      totalDraws: points.filter((item) => item.winner === 'draw').length,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency };
  }

  static async getTeams(req: Request, res: Response) {
    const { type } = req.params;
    const allTeams = await TeamService.getAll();
    const ids = allTeams.map((team) => team.id);
    const data: ILeadeboard[] = await Promise.all(ids.map(async (id) => {
      const info = await LeaderboardController.getPoints(id, type);
      const name = await TeamService.getOne(id).then((resp) => resp.teamName);
      return { ...info, name };
    }));
    const result = data.sort((a, b) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor || a.goalsOwn - b.goalsOwn);
    res.status(200).json(result);
  }
}

export default LeaderboardController;
