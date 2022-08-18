import { Request, Response } from 'express';
import { Jwt, sign, SignOptions, verify } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import UserService from '../service/User.service';
import { IUserInd } from '../interfaces';
import ErrorCode from '../CodeError';

const secret = process.env.JWT_SECRET || 'secret';

const tokenMsg = 'Token must be a valid token';

class UserController {
  private static createToken(data: IUserInd) {
    const config: SignOptions = {
      expiresIn: '2d',
      algorithm: 'HS256',
    };
    const token = sign({ data }, secret, config);
    return token;
  }

  static async login(req: Request, res: Response) {
    const { email: em, password } = req.body;
    if (!password || !em) {
      throw new ErrorCode('All fields must be filled', 400);
    }
    const user = await UserService.getOne(em);
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      throw new ErrorCode('Incorrect email or password', 401);
    }
    const { email, username, role, id } = user;
    const token = UserController.createToken({ email, username, role, id });
    res.status(200).json({ token });
  }

  static async validate(req: Request, res: Response) {
    const auth = req.headers.authorization;
    if (!auth) { throw new ErrorCode(tokenMsg, 401); }
    const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;
    let data: Jwt;
    try { data = verify(token, secret, { complete: true }) as Jwt; } catch (e) {
      throw new ErrorCode(tokenMsg, 401);
    }
    const info = data.payload.data.email;
    const exists = await UserService.getOne(info);
    if (!exists) { throw new ErrorCode(tokenMsg, 401); }
    const { password, ...user } = exists;
    res.status(200).json({ role: user.role });
  }
}

export default UserController;
