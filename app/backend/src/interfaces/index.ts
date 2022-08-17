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
