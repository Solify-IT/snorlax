import BookController from './bookController';
import UserController from './userController';

export interface IAppController {
  books: BookController;
  users: UserController;
}

export default IAppController;
