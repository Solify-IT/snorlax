import User from 'src/domain/model/user';

declare global {
  namespace Express {
    interface Request {
      currentUser: User;
    }
  }
}
