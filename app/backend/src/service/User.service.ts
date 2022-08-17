import ErrorCode from '../CodeError';
import User from '../database/models/User.model';

class UserService {
  static async getOne(email: string) {
    const response = await User.findOne({ where: { email }, raw: true });
    if (!response) {
      throw new ErrorCode('Incorrect email or password', 400);
    }
    return response;
  }
}

export default UserService;
