import BookController from './bookController';
import UserController from './userController';
import LibraryController from './libraryController';
import CatalogueController from './catalogueController';

export interface IAppController {
  books: BookController;
  users: UserController;
  libraries: LibraryController
  catalogue: CatalogueController,
}

export default IAppController;
