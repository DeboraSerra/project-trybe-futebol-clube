import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ReqUser } from '../interfaces';
import UserService from '../service/User.service';

const secret = process.env.JWT_SECRET || 'secret';

const tokenMiddleware = async (req: ReqUser, res: Response, next: NextFunction): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new Error('Token must be a valid token');
  }
  const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;
  const data = verify(token, secret, { complete: true });
  const info = Object.entries(data)[1][1].data;
  const exists = await UserService.getOne(info.email);
  if (!exists) {
    throw new Error('Token must be a valid token');
  }
  const { password, ...user } = exists;
  req.user = user;
  next();
};

export default tokenMiddleware;
