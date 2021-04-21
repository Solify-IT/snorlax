import BookController from './bookController';
import UserController from './userController';
import LibraryController from './libraryController';

export interface IAppController {
  books: BookController;
  users: UserController;
  libraries: LibraryController
}

export default IAppController;
