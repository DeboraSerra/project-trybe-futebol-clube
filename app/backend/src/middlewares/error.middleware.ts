import { Request, Response, NextFunction } from 'express';
import ErrorCode from '../CodeError';

const ErrorMid = (err: ErrorCode, _req: Request, res: Response, _next: NextFunction) => {
  const { message, code } = err;
  console.log({ message });
  res.status(code).json({ message });
};

export default ErrorMid;
