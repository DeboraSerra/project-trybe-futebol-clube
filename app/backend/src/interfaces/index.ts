import { Request } from 'express';

export interface IUserNoP {
  username: string;
  role: string;
  email: string;
}

export interface IUser extends IUserNoP {
  password: string;
}

export interface IUserInd extends IUserNoP {
  id: number;
}

export interface IUserIndP extends IUser {
  id: number;
}

export interface ReqUser extends Request {
  user?: IUserNoP;
}

export interface ITeam {
  id: number;
  teamName: string;
}

export interface IMatchComplete extends IMatchProg {
  teamHome: {
    teamName: string;
  };
  teamAway: {
    teamName: string;
  };
}

export interface IMatch extends IPoints {
  homeTeam: number;
  awayTeam: number;
}

export interface IMatchInd extends IMatch {
  id: number;
}

export interface IMatchProg extends IMatch {
  inProgress: boolean;
}

export interface IPoints {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface ILeadeboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

export interface IMatchIndProg extends IMatchInd, IMatchProg { }
