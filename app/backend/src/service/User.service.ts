import ErrorCode from '../CodeError';
import User from '../database/models/User.model';

class UserService {
  static async getOne(email: string) {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regex.test(email)) {
      throw new ErrorCode('Incorrect email or password', 401);
    }
    const response = await User.findOne({ where: { email }, raw: true });
    if (!response) {
      throw new ErrorCode('Incorrect email or password', 400);
    }
    return response;
  }
}

export default UserService;
