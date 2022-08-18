import { Response, NextFunction } from 'express';
import { Jwt, verify } from 'jsonwebtoken';
import ErrorCode from '../CodeError';
import { ReqUser } from '../interfaces';
import UserService from '../service/User.service';

const secret = process.env.JWT_SECRET || 'secret';

const tokenMsg = 'Token must be a valid token';

const tokenMiddleware = async (req: ReqUser, res: Response, next: NextFunction): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new ErrorCode(tokenMsg, 401);
  }
  const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;
  let data: Jwt;
  try { data = verify(token, secret, { complete: true }) as Jwt; } catch (e) {
    throw new ErrorCode(tokenMsg, 401);
  }
  const info = data.payload.data.email;
  const exists = await UserService.getOne(info);
  if (!exists) { throw new ErrorCode(tokenMsg, 401); }
  const { password, ...user } = exists;
  req.user = user;
  next();
};

export default tokenMiddleware;
